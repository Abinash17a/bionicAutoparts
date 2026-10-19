// src/lib/inventory/inventoryRepository.ts
/**
 * Inventory Repository Abstraction Layer
 * 
 * Acts as the single source of truth for inventory and taxonomy queries across all
 * commercial routes, product pages, sitemaps, and search components.
 * 
 * Production-ready: Interfaces directly with Supabase PostgreSQL database
 * while maintaining graceful fallback to verified in-memory dataset during build/offline times.
 */

import {
  INVENTORY_ITEMS,
  CATEGORIES,
  InventoryItem,
  CategoryMeta,
  mapPartToCategorySlug,
  toSlug,
  formatSlugToName,
  isValidCategorySlug as rawIsValidCategorySlug,
} from '../../app/data/inventoryData';
import { supabaseAdmin } from '../supabase/admin';

export type { InventoryItem, CategoryMeta };
export { mapPartToCategorySlug, toSlug, formatSlugToName };
export { CATEGORIES };

export interface Make {
  slug: string;
  name: string;
  logo?: string;
}

export interface Model {
  slug: string;
  name: string;
}

export interface VehicleCombination {
  categorySlug: string;
  makeSlug: string;
  make: string;
  modelSlug: string;
  model: string;
  year: number;
  id: string;
}

const PART_SELECT_QUERY = `
  id,
  category_slug,
  donor_vehicle_id,
  part_name,
  condition,
  price,
  currency,
  availability,
  warranty,
  shipping,
  fitment_notes,
  primary_image_url,
  created_at,
  updated_at,
  categories (
    slug,
    title,
    short_title
  ),
  donor_vehicles (
    id,
    vin,
    vehicle_summary,
    mileage_miles,
    mileage_formatted,
    run_condition
  ),
  part_interchanges (
    interchange_type,
    interchange_number
  ),
  part_images (
    image_url,
    alt_text,
    display_order
  ),
  part_fitments (
    year_start,
    year_end,
    notes,
    vehicles (
      id,
      year,
      trim,
      engine_code,
      transmission_code,
      models (
        id,
        slug,
        name,
        makes (
          id,
          slug,
          name,
          logo_url
        )
      )
    )
  )
`;

function mapPartRowToInventoryItem(row: any): InventoryItem {
  const fitment = row.part_fitments?.[0];
  const vehicle = fitment?.vehicles;
  const model = vehicle?.models;
  const make = model?.makes;
  const donor = row.donor_vehicles;
  const hollander = (row.part_interchanges || []).find((i: any) => i.interchange_type === 'Hollander')?.interchange_number || '';
  const oem = (row.part_interchanges || []).find((i: any) => i.interchange_type === 'OEM')?.interchange_number || '';

  const priceNum = Number(row.price) || 0;
  return {
    id: row.id,
    partName: row.part_name,
    categorySlug: row.category_slug,
    categoryName: row.categories?.title || row.category_slug,
    year: vehicle?.year || 0,
    make: make?.name || '',
    makeSlug: make?.slug || '',
    model: model?.name || '',
    modelSlug: model?.slug || '',
    trim: vehicle?.trim || undefined,
    engineCode: vehicle?.engine_code || undefined,
    transmissionCode: vehicle?.transmission_code || undefined,
    oemPartNumber: oem,
    interchangeNumber: hollander,
    donorVehicle: donor?.vehicle_summary || '',
    donorVin: donor?.vin || '',
    donorMileage: donor?.mileage_formatted || '',
    condition: row.condition || 'Used OEM',
    image: row.primary_image_url || '',
    price: priceNum,
    priceFormatted: `$${priceNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    availability: row.availability || 'In Stock',
    warranty: row.warranty || '',
    shipping: row.shipping || '',
    fitmentNotes: row.fitment_notes || '',
  };
}

/**
 * Retrieve an individual inventory item by its unique stock ID.
 * Returns null if the item is not found.
 */
export async function getInventoryById(id: string): Promise<InventoryItem | null> {
  if (!id) return null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      const { data, error } = await supabaseAdmin
        .from('parts')
        .select(PART_SELECT_QUERY)
        .eq('id', id.trim())
        .maybeSingle();

      if (!error && data) {
        return mapPartRowToInventoryItem(data);
      }
    } catch (err) {
      console.warn('Supabase getInventoryById fallback:', err);
    }
  }

  const item = INVENTORY_ITEMS.find((item) => item.id.toLowerCase() === id.trim().toLowerCase());
  return item ? { ...item } : null;
}

/**
 * Retrieve all active inventory items within a category.
 * Returns an empty array if no items match.
 */
export async function getInventoryByCategory(categorySlug: string): Promise<InventoryItem[]> {
  if (!categorySlug) return [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      let query = supabaseAdmin.from('parts').select(PART_SELECT_QUERY);
      if (categorySlug !== 'used-auto-parts') {
        query = query.eq('category_slug', categorySlug);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(mapPartRowToInventoryItem);
      }
    } catch (err) {
      console.warn('Supabase getInventoryByCategory fallback:', err);
    }
  }

  if (categorySlug === 'used-auto-parts') {
    return [...INVENTORY_ITEMS];
  }
  return INVENTORY_ITEMS.filter((item) => item.categorySlug === categorySlug).map((i) => ({ ...i }));
}

/**
 * Retrieve inventory filtered by vehicle hierarchy (category, make, model, year).
 * Any filter can be applied progressively.
 * Returns an empty array if no items match.
 */
export async function getInventoryByVehicle(
  categorySlug: string,
  makeSlug: string,
  modelSlug?: string,
  year?: number | string
): Promise<InventoryItem[]> {
  if (!categorySlug || !makeSlug) return [];

  const targetCategory = categorySlug.toLowerCase();
  const targetMake = makeSlug.toLowerCase();
  const targetModel = modelSlug ? modelSlug.toLowerCase() : undefined;
  const targetYear = year !== undefined && year !== null && year !== '' ? String(year) : undefined;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      let query = supabaseAdmin.from('parts').select(PART_SELECT_QUERY);
      if (targetCategory !== 'used-auto-parts') {
        query = query.eq('category_slug', targetCategory);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const items = data.map(mapPartRowToInventoryItem);
        const filtered = items.filter((item) => {
          const makeMatches = item.makeSlug.toLowerCase() === targetMake;
          const modelMatches = !targetModel || item.modelSlug.toLowerCase() === targetModel;
          const yearMatches = !targetYear || String(item.year) === targetYear;
          return makeMatches && modelMatches && yearMatches;
        });

        if (filtered.length > 0) return filtered;
      }
    } catch (err) {
      console.warn('Supabase getInventoryByVehicle fallback:', err);
    }
  }

  return INVENTORY_ITEMS.filter((item) => {
    const categoryMatches = targetCategory === 'used-auto-parts' || item.categorySlug === targetCategory;
    const makeMatches = item.makeSlug.toLowerCase() === targetMake;
    const modelMatches = !targetModel || item.modelSlug.toLowerCase() === targetModel;
    const yearMatches = !targetYear || String(item.year) === targetYear;
    return categoryMatches && makeMatches && modelMatches && yearMatches;
  }).map((i) => ({ ...i }));
}

/**
 * Retrieve distinct makes that have in-stock inventory for a specific category.
 */
export async function getActiveMakes(categorySlug: string): Promise<Make[]> {
  if (!categorySlug) return [];

  const items = await getInventoryByCategory(categorySlug);
  const makesMap = new Map<string, Make>();
  for (const item of items) {
    if (!makesMap.has(item.makeSlug)) {
      makesMap.set(item.makeSlug, {
        slug: item.makeSlug,
        name: item.make,
      });
    }
  }

  return Array.from(makesMap.values());
}

/**
 * Retrieve distinct models for a make that have in-stock inventory for a category.
 */
export async function getActiveModels(categorySlug: string, makeSlug: string): Promise<Model[]> {
  if (!categorySlug || !makeSlug) return [];

  const items = await getInventoryByCategory(categorySlug);
  const targetMake = makeSlug.toLowerCase();

  const modelsMap = new Map<string, Model>();
  for (const item of items) {
    if (item.makeSlug.toLowerCase() === targetMake) {
      if (!modelsMap.has(item.modelSlug)) {
        modelsMap.set(item.modelSlug, {
          slug: item.modelSlug,
          name: item.model,
        });
      }
    }
  }

  return Array.from(modelsMap.values());
}

/**
 * Retrieve distinct model years available for a specific category, make, and model.
 * Returned in descending chronological order.
 */
export async function getActiveYears(
  categorySlug: string,
  makeSlug: string,
  modelSlug: string
): Promise<number[]> {
  if (!categorySlug || !makeSlug || !modelSlug) return [];

  const items = await getInventoryByCategory(categorySlug);
  const targetMake = makeSlug.toLowerCase();
  const targetModel = modelSlug.toLowerCase();

  const yearsSet = new Set<number>();
  for (const item of items) {
    if (item.makeSlug.toLowerCase() === targetMake && item.modelSlug.toLowerCase() === targetModel) {
      yearsSet.add(item.year);
    }
  }

  return Array.from(yearsSet).sort((a, b) => b - a);
}

/**
 * Retrieve related parts for the same vehicle in different component categories.
 * For example: showing transmissions or body parts when browsing a Camry engine.
 */
export async function getRelatedInventory(
  makeSlug: string,
  modelSlug: string,
  year: number | string,
  excludeCategorySlug?: string
): Promise<InventoryItem[]> {
  if (!makeSlug || !modelSlug || !year) return [];

  const targetMake = makeSlug.toLowerCase();
  const targetModel = modelSlug.toLowerCase();
  const targetYear = String(year);
  const targetExcludeCategory = excludeCategorySlug ? excludeCategorySlug.toLowerCase() : undefined;

  const items = await getAllActiveInventory();
  return items.filter((item) => {
    const makeMatches = item.makeSlug.toLowerCase() === targetMake;
    const modelMatches = item.modelSlug.toLowerCase() === targetModel;
    const yearMatches = String(item.year) === targetYear;
    const categoryNotExcluded = !targetExcludeCategory || item.categorySlug !== targetExcludeCategory;
    return makeMatches && modelMatches && yearMatches && categoryNotExcluded;
  });
}

/**
 * Retrieve other parts from the same automaker (make).
 * Used on PDP to display alternative/related inventory.
 */
export async function getRelatedInventoryByMake(
  makeSlug: string,
  excludeId?: string,
  limit: number = 3
): Promise<InventoryItem[]> {
  if (!makeSlug) return [];
  const targetMake = makeSlug.toLowerCase();
  const items = await getAllActiveInventory();

  return items
    .filter((other) => (!excludeId || other.id.toLowerCase() !== excludeId.toLowerCase()) && other.makeSlug.toLowerCase() === targetMake)
    .slice(0, limit);
}

/**
 * Retrieve all categories metadata.
 */
export async function getAllCategories(): Promise<CategoryMeta[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      const { data, error } = await supabaseAdmin.from('categories').select('*');
      if (!error && data && data.length > 0) {
        return data.map((cat: any) => ({
          slug: cat.slug,
          title: cat.title,
          shortTitle: cat.short_title,
          metaTitle: cat.meta_title,
          metaDescription: cat.meta_description,
          heroDescription: cat.hero_description,
          iconName: CATEGORIES[cat.slug]?.iconName || 'FaTools',
          image: cat.image_url || CATEGORIES[cat.slug]?.image || '',
          warrantySummary: cat.warranty_summary,
          inspectionDetails: Array.isArray(cat.inspection_details) ? cat.inspection_details : [],
        }));
      }
    } catch (err) {
      console.warn('Supabase getAllCategories fallback:', err);
    }
  }

  return Object.values(CATEGORIES);
}

/**
 * Retrieve category metadata by category slug.
 * Returns null if slug is not a recognized category.
 */
export async function getCategoryBySlug(categorySlug: string): Promise<CategoryMeta | null> {
  if (!categorySlug || !rawIsValidCategorySlug(categorySlug)) return null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (!error && data) {
        return {
          slug: data.slug,
          title: data.title,
          shortTitle: data.short_title,
          metaTitle: data.meta_title,
          metaDescription: data.meta_description,
          heroDescription: data.hero_description,
          iconName: CATEGORIES[data.slug]?.iconName || 'FaTools',
          image: data.image_url || CATEGORIES[data.slug]?.image || '',
          warrantySummary: data.warranty_summary,
          inspectionDetails: Array.isArray(data.inspection_details) ? data.inspection_details : [],
        };
      }
    } catch (err) {
      console.warn('Supabase getCategoryBySlug fallback:', err);
    }
  }

  return CATEGORIES[categorySlug] || null;
}

/**
 * Validate whether a string is a valid commercial category slug.
 */
export function isValidCategorySlug(slug: string): slug is CategoryMeta['slug'] {
  return rawIsValidCategorySlug(slug);
}

/**
 * Retrieve all currently active inventory units.
 */
export async function getAllActiveInventory(): Promise<InventoryItem[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      const { data, error } = await supabaseAdmin.from('parts').select(PART_SELECT_QUERY);
      if (!error && data && data.length > 0) {
        return data.map(mapPartRowToInventoryItem);
      }
    } catch (err) {
      console.warn('Supabase getAllActiveInventory fallback:', err);
    }
  }

  return [...INVENTORY_ITEMS];
}

/**
 * Retrieve distinct vehicle combinations backed by real inventory.
 * Used for dynamic sitemap indexing and selective crawlability.
 */
export async function getIndexedVehicleCombinations(): Promise<VehicleCombination[]> {
  const items = await getAllActiveInventory();
  return items.map((item) => ({
    categorySlug: item.categorySlug,
    makeSlug: item.makeSlug,
    make: item.make,
    modelSlug: item.modelSlug,
    model: item.model,
    year: item.year,
    id: item.id,
  }));
}
