/**
 * Authoritative data access repository for Supabase tables with pre-built lookup indexes.
 */

import {
  DEFAULT_MANUFACTURERS,
  DEFAULT_MODELS,
  DEFAULT_PARTS,
  DEFAULT_PART_SYNONYMS,
  DEFAULT_RESPONSE_TEMPLATES,
  ManufacturerRecord,
  ModelRecord,
  PartRecord,
  PartSynonymRecord,
  ResponseTemplateRecord,
} from "./default_catalog";
import { getSupabaseClient } from "./supabase_client";

export class IndexedCatalog {
  public items: any[];
  public name_key: string;
  public canonical_key: string;
  public exact_map: Record<string, any>;
  public by_length: Record<number, Array<[string, string, any]>>;

  constructor(items: any[], nameKey: string = "name", canonicalKey: string = "name") {
    this.items = items;
    this.name_key = nameKey;
    this.canonical_key = canonicalKey;
    this.exact_map = {};
    this.by_length = {};

    for (const item of items) {
      const rawName = String(item[nameKey] || "").trim();
      const lowered = rawName.toLowerCase();
      if (!lowered) continue;

      const canonical = item[canonicalKey] || rawName;
      if (!this.exact_map[lowered]) {
        this.exact_map[lowered] = item;
      }

      const len = lowered.length;
      if (!this.by_length[len]) {
        this.by_length[len] = [];
      }
      this.by_length[len].push([lowered, canonical, item]);
    }
  }
}

export class CatalogRepository {
  public useSupabase: boolean;
  private isLoaded: boolean = false;
  private loadPromise: Promise<void> | null = null;

  private manufacturers: ManufacturerRecord[] = [];
  private models: ModelRecord[] = [];
  private modelsByMfgId: Record<string, ModelRecord[]> = {};
  private partsById: Record<string, PartRecord> = {};
  private partLookupItems: any[] = [];
  private responseTemplates: ResponseTemplateRecord[] = [];
  private templatesByCategory: Record<string, ResponseTemplateRecord[]> = {};

  public indexed_manufacturers: IndexedCatalog | null = null;
  public indexed_all_models: IndexedCatalog | null = null;
  public indexed_models_by_mfg_id: Record<string, IndexedCatalog> = {};
  public indexed_parts: IndexedCatalog | null = null;

  constructor(useSupabase: boolean = true) {
    this.useSupabase = useSupabase;
  }

  public async ensureLoaded(forceReload: boolean = false): Promise<void> {
    if (this.isLoaded && !forceReload) {
      return;
    }
    if (this.loadPromise && !forceReload) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      const client = this.useSupabase ? getSupabaseClient() : null;

      if (client) {
        try {
          const [mfgRes, modRes, prtRes, synRes, tplRes] = await Promise.all([
            client.from("usaautopartsbot_manufacturers").select("id, name, slug, canonical_name"),
            client.from("usaautopartsbot_models").select("id, manufacturer_id, name, slug"),
            client.from("usaautopartsbot_parts").select("id, name, slug"),
            client.from("usaautopartsbot_part_synonyms").select("id, part_id, synonym"),
            client.from("usaautopartsbot_response_templates").select("id, category, template_text"),
          ]);

          if (mfgRes.error || modRes.error || prtRes.error || synRes.error || tplRes.error) {
            const err = mfgRes.error || modRes.error || prtRes.error || synRes.error || tplRes.error;
            console.warn("[CatalogRepository] Supabase catalog query error:", err?.message);
          } else if (mfgRes.data && mfgRes.data.length > 0) {
            const manufacturers = mfgRes.data as ManufacturerRecord[];
            const models = (modRes.data && modRes.data.length > 0 ? modRes.data : DEFAULT_MODELS) as ModelRecord[];
            const parts = (prtRes.data && prtRes.data.length > 0 ? prtRes.data : DEFAULT_PARTS) as PartRecord[];
            const synonyms = (synRes.data && synRes.data.length > 0 ? synRes.data : DEFAULT_PART_SYNONYMS) as PartSynonymRecord[];
            const templates = (tplRes.data && tplRes.data.length > 0 ? tplRes.data : DEFAULT_RESPONSE_TEMPLATES) as ResponseTemplateRecord[];

            this.buildIndexes(manufacturers, models, parts, synonyms, templates);
            this.isLoaded = true;
            return;
          }
        } catch (err: any) {
          console.warn("[CatalogRepository] Failed to load catalog from Supabase, falling back to static catalog:", err?.message);
        }
      }

      this.buildIndexes(
        DEFAULT_MANUFACTURERS,
        DEFAULT_MODELS,
        DEFAULT_PARTS,
        DEFAULT_PART_SYNONYMS,
        DEFAULT_RESPONSE_TEMPLATES
      );
      this.isLoaded = true;
    })();

    return this.loadPromise;
  }

  private buildIndexes(
    manufacturers: ManufacturerRecord[],
    models: ModelRecord[],
    parts: PartRecord[],
    synonyms: PartSynonymRecord[],
    templates?: ResponseTemplateRecord[]
  ): void {
    this.manufacturers = manufacturers;
    this.models = models;

    // Index models by manufacturer_id
    this.modelsByMfgId = {};
    for (const mod of models) {
      const mfgId = mod.manufacturer_id;
      if (mfgId) {
        if (!this.modelsByMfgId[mfgId]) {
          this.modelsByMfgId[mfgId] = [];
        }
        this.modelsByMfgId[mfgId].push(mod);
      }
    }

    // Index parts by id
    this.partsById = {};
    for (const p of parts) {
      if (p.id) {
        this.partsById[p.id] = p;
      }
    }

    // Build combined part lookup items (canonical parts + synonyms)
    const lookupItems: any[] = [];
    for (const p of parts) {
      lookupItems.push({
        part_id: p.id,
        name: p.name,
        canonical_name: p.name,
        is_synonym: false,
      });
    }

    for (const syn of synonyms) {
      const partId = syn.part_id;
      const canonicalPart = this.partsById[partId];
      const canonicalName = canonicalPart ? canonicalPart.name : "";
      if (canonicalName && syn.synonym) {
        lookupItems.push({
          part_id: partId,
          name: syn.synonym,
          canonical_name: canonicalName,
          is_synonym: true,
        });
      }
    }

    this.partLookupItems = lookupItems;

    // Build response templates index
    const tplList = templates || DEFAULT_RESPONSE_TEMPLATES;
    this.responseTemplates = tplList;
    this.templatesByCategory = {};
    for (const tpl of tplList) {
      const cat = String(tpl.category || "").trim().toUpperCase();
      const text = String(tpl.template_text || "").trim();
      if (cat && text) {
        if (!this.templatesByCategory[cat]) {
          this.templatesByCategory[cat] = [];
        }
        this.templatesByCategory[cat].push(tpl);
      }
    }

    // Build expanded manufacturer list with common aliases
    const mfgLookupItems: ManufacturerRecord[] = [...manufacturers];
    for (const m of manufacturers) {
      const nameLower = m.name.trim().toLowerCase();
      if (nameLower === "mercedes-benz") {
        mfgLookupItems.push({ id: m.id, name: "Mercedes", slug: "mercedes", canonical_name: m.name });
        mfgLookupItems.push({ id: m.id, name: "Mercedes Benz", slug: "mercedes-benz", canonical_name: m.name });
        mfgLookupItems.push({ id: m.id, name: "Benz", slug: "benz", canonical_name: m.name });
      } else if (nameLower === "chevrolet") {
        mfgLookupItems.push({ id: m.id, name: "Chevy", slug: "chevy", canonical_name: m.name });
      } else if (nameLower === "volkswagen") {
        mfgLookupItems.push({ id: m.id, name: "VW", slug: "vw", canonical_name: m.name });
      }
    }

    // Build pre-indexed search containers
    this.indexed_manufacturers = new IndexedCatalog(mfgLookupItems, "name", "canonical_name");
    this.indexed_all_models = new IndexedCatalog(models, "name", "name");
    this.indexed_models_by_mfg_id = {};
    for (const [mfgId, modList] of Object.entries(this.modelsByMfgId)) {
      this.indexed_models_by_mfg_id[mfgId] = new IndexedCatalog(modList, "name", "name");
    }
    this.indexed_parts = new IndexedCatalog(lookupItems, "name", "canonical_name");
  }

  public findManufacturerByName(name: string | null | undefined): ManufacturerRecord | null {
    if (!name || typeof name !== "string") return null;
    const cleanName = name.trim().toLowerCase();
    if (this.indexed_manufacturers && this.indexed_manufacturers.exact_map[cleanName]) {
      return this.indexed_manufacturers.exact_map[cleanName];
    }
    for (const m of this.manufacturers) {
      if (m.name.trim().toLowerCase() === cleanName) {
        return m;
      }
      if (["mercedes", "mercedes benz", "benz"].includes(cleanName) && m.name.trim().toLowerCase() === "mercedes-benz") {
        return m;
      }
    }
    return null;
  }

  public isModelCompatible(manufacturerName: string | null | undefined, modelName: string | null | undefined): boolean {
    if (!manufacturerName || !modelName) return false;
    const mfg = this.findManufacturerByName(manufacturerName);
    if (!mfg || !mfg.id) return false;
    const modelsForMfg = this.modelsByMfgId[mfg.id] || [];
    const cleanModel = modelName.trim().toLowerCase();
    return modelsForMfg.some((mod) => mod.name.trim().toLowerCase() === cleanModel);
  }

  public getResponseTemplates(category?: string | null): ResponseTemplateRecord[] {
    if (category) {
      const catUpper = category.trim().toUpperCase();
      return this.templatesByCategory[catUpper] || [];
    }
    return this.responseTemplates;
  }

  public getManufacturers(): ManufacturerRecord[] {
    return this.manufacturers;
  }

  public getModels(): ModelRecord[] {
    return this.models;
  }

  public getParts(): PartRecord[] {
    return Object.values(this.partsById);
  }
}

let repositoryInstance: CatalogRepository | null = null;

export function getRepository(): CatalogRepository {
  if (!repositoryInstance) {
    repositoryInstance = new CatalogRepository();
    // Synchronously initialize with default catalog for zero latency
    (repositoryInstance as any).buildIndexes(
      DEFAULT_MANUFACTURERS,
      DEFAULT_MODELS,
      DEFAULT_PARTS,
      DEFAULT_PART_SYNONYMS,
      DEFAULT_RESPONSE_TEMPLATES
    );
    (repositoryInstance as any).isLoaded = true;
  }
  return repositoryInstance;
}
