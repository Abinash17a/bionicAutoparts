"""Authoritative data access repository for Supabase tables with pre-built lookup indexes."""

import logging
from typing import Any
from tony_beta3.database.default_catalog import (
    DEFAULT_MANUFACTURERS,
    DEFAULT_MODELS,
    DEFAULT_PARTS,
    DEFAULT_PART_SYNONYMS,
    DEFAULT_RESPONSE_TEMPLATES,
)
from tony_beta3.database.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)


class IndexedCatalog:
    """Pre-indexed catalog container for O(1) exact match and length-bucketed fuzzy search."""

    def __init__(self, items: list[dict[str, Any]], name_key: str = "name", canonical_key: str = "name") -> None:
        self.items = items
        self.name_key = name_key
        self.canonical_key = canonical_key

        self.exact_map: dict[str, dict[str, Any]] = {}
        self.by_length: dict[int, list[tuple[str, str, dict[str, Any]]]] = {}

        for item in items:
            raw_name = item.get(name_key, "").strip()
            lowered = raw_name.lower()
            if not lowered:
                continue

            canonical = item.get(canonical_key, raw_name)
            if lowered not in self.exact_map:
                self.exact_map[lowered] = item

            self.by_length.setdefault(len(lowered), []).append((lowered, canonical, item))


class CatalogRepository:
    """Data repository for manufacturers, models, parts, part synonyms, and response templates.

    Encapsulates all Supabase queries and provides high-performance cached lookups.
    """

    def __init__(self, use_supabase: bool = True) -> None:
        self.use_supabase = use_supabase
        self._is_loaded: bool = False

        # In-memory cached entities
        self._manufacturers: list[dict[str, Any]] = []
        self._models: list[dict[str, Any]] = []
        self._models_by_mfg_id: dict[str, list[dict[str, Any]]] = {}
        self._parts_by_id: dict[str, dict[str, Any]] = {}
        self._part_lookup_items: list[dict[str, Any]] = []
        self._response_templates: list[dict[str, Any]] = []
        self._templates_by_category: dict[str, list[str]] = {}

        # Pre-indexed containers
        self.indexed_manufacturers: IndexedCatalog | None = None
        self.indexed_all_models: IndexedCatalog | None = None
        self.indexed_models_by_mfg_id: dict[str, IndexedCatalog] = {}
        self.indexed_parts: IndexedCatalog | None = None

    def ensure_loaded(self, force_reload: bool = False) -> None:
        """Load catalog from Supabase if available, or fall back to default catalog."""
        if self._is_loaded and not force_reload:
            return

        client = get_supabase_client() if self.use_supabase else None

        if client is not None:
            try:
                # Query manufacturers
                mfg_res = client.table("manufacturers").select("id, name, slug").execute()
                manufacturers = mfg_res.data if mfg_res.data else DEFAULT_MANUFACTURERS

                # Query models
                mod_res = client.table("models").select("id, manufacturer_id, name, slug").execute()
                models = mod_res.data if mod_res.data else DEFAULT_MODELS

                # Query parts
                prt_res = client.table("parts").select("id, name, slug").execute()
                parts = prt_res.data if prt_res.data else DEFAULT_PARTS

                # Query part_synonyms
                syn_res = client.table("part_synonyms").select("id, part_id, synonym").execute()
                synonyms = syn_res.data if syn_res.data else DEFAULT_PART_SYNONYMS

                # Query response_templates if exists
                try:
                    tpl_res = client.table("response_templates").select("id, category, template_text").execute()
                    templates = tpl_res.data if tpl_res.data else DEFAULT_RESPONSE_TEMPLATES
                except Exception:
                    templates = DEFAULT_RESPONSE_TEMPLATES

                self._build_indexes(manufacturers, models, parts, synonyms, templates)
                self._is_loaded = True
                logger.info(
                    f"Loaded catalog from Supabase: {len(manufacturers)} manufacturers, "
                    f"{len(models)} models, {len(parts)} parts, {len(synonyms)} synonyms, "
                    f"{len(templates)} templates."
                )
                return
            except Exception as e:
                logger.warning(f"Error querying Supabase tables: {e}. Using fallback catalog.")

        # Fallback to default catalog
        self._build_indexes(
            DEFAULT_MANUFACTURERS,
            DEFAULT_MODELS,
            DEFAULT_PARTS,
            DEFAULT_PART_SYNONYMS,
            DEFAULT_RESPONSE_TEMPLATES,
        )
        self._is_loaded = True

    def _build_indexes(
        self,
        manufacturers: list[dict[str, Any]],
        models: list[dict[str, Any]],
        parts: list[dict[str, Any]],
        synonyms: list[dict[str, Any]],
        templates: list[dict[str, Any]] | None = None,
    ) -> None:
        """Construct fast lookup indexes and token matching structures."""
        self._manufacturers = manufacturers
        self._models = models

        # Index models by manufacturer_id
        self._models_by_mfg_id = {}
        for mod in models:
            mfg_id = mod.get("manufacturer_id")
            if mfg_id:
                self._models_by_mfg_id.setdefault(mfg_id, []).append(mod)

        # Index parts by id
        self._parts_by_id = {p["id"]: p for p in parts if "id" in p}

        # Build combined part lookup items (canonical parts + synonyms)
        lookup_items: list[dict[str, Any]] = []

        # Add canonical parts
        for p in parts:
            lookup_items.append({
                "part_id": p.get("id"),
                "name": p.get("name", ""),
                "canonical_name": p.get("name", ""),
                "is_synonym": False,
            })

        # Add synonyms mapped to canonical part name
        for syn in synonyms:
            part_id = syn.get("part_id")
            canonical_part = self._parts_by_id.get(part_id)
            canonical_name = canonical_part.get("name", "") if canonical_part else ""
            if canonical_name and syn.get("synonym"):
                lookup_items.append({
                    "part_id": part_id,
                    "name": syn.get("synonym", ""),
                    "canonical_name": canonical_name,
                    "is_synonym": True,
                })

        self._part_lookup_items = lookup_items

        # Build response templates index
        tpl_list = templates or DEFAULT_RESPONSE_TEMPLATES
        self._response_templates = tpl_list
        self._templates_by_category = {}
        for tpl in tpl_list:
            cat = tpl.get("category", "").strip().upper()
            text = tpl.get("template_text", "").strip()
            if cat and text:
                self._templates_by_category.setdefault(cat, []).append(tpl)

        # Build expanded manufacturer list with common aliases (e.g. Mercedes -> Mercedes-Benz, Chevy -> Chevrolet, VW -> Volkswagen)
        mfg_lookup_items = list(manufacturers)
        for m in manufacturers:
            name_lower = m.get("name", "").strip().lower()
            if name_lower == "mercedes-benz":
                mfg_lookup_items.append({"id": m["id"], "name": "Mercedes", "slug": "mercedes", "canonical_name": m.get("name", "Mercedes-Benz")})
                mfg_lookup_items.append({"id": m["id"], "name": "Mercedes Benz", "slug": "mercedes-benz", "canonical_name": m.get("name", "Mercedes-Benz")})
                mfg_lookup_items.append({"id": m["id"], "name": "Benz", "slug": "benz", "canonical_name": m.get("name", "Mercedes-Benz")})
            elif name_lower == "chevrolet":
                mfg_lookup_items.append({"id": m["id"], "name": "Chevy", "slug": "chevy", "canonical_name": m.get("name", "Chevrolet")})
            elif name_lower == "volkswagen":
                mfg_lookup_items.append({"id": m["id"], "name": "VW", "slug": "vw", "canonical_name": m.get("name", "Volkswagen")})

        # Build pre-indexed search containers
        self.indexed_manufacturers = IndexedCatalog(mfg_lookup_items, name_key="name", canonical_key="canonical_name")
        self.indexed_all_models = IndexedCatalog(models, name_key="name", canonical_key="name")
        self.indexed_models_by_mfg_id = {
            mfg_id: IndexedCatalog(mod_list, name_key="name", canonical_key="name")
            for mfg_id, mod_list in self._models_by_mfg_id.items()
        }
        self.indexed_parts = IndexedCatalog(lookup_items, name_key="name", canonical_key="canonical_name")

    def find_manufacturer_by_name(self, name: str | None) -> dict[str, Any] | None:
        """Find manufacturer dictionary by name or alias."""
        if not name or not isinstance(name, str):
            return None
        self.ensure_loaded()
        if not self.indexed_manufacturers:
            return None
        clean_name = name.strip().lower()
        if clean_name in self.indexed_manufacturers.exact_map:
            return self.indexed_manufacturers.exact_map[clean_name]
        for m in self._manufacturers:
            if m.get("name", "").strip().lower() == clean_name:
                return m
            if clean_name in ("mercedes", "mercedes benz", "benz") and m.get("name", "").strip().lower() == "mercedes-benz":
                return m
        return None

    def is_model_compatible(self, manufacturer_name: str | None, model_name: str | None) -> bool:
        """Check if a model belongs to a manufacturer."""
        if not manufacturer_name or not model_name:
            return False
        self.ensure_loaded()
        mfg = self.find_manufacturer_by_name(manufacturer_name)
        if not mfg or "id" not in mfg:
            return False
        mfg_id = mfg["id"]
        models_for_mfg = self._models_by_mfg_id.get(mfg_id, [])
        clean_model = model_name.strip().lower()
        for mod in models_for_mfg:
            if mod.get("name", "").strip().lower() == clean_model:
                return True
        return False

    def get_manufacturers(self) -> list[dict[str, Any]]:
        self.ensure_loaded()
        return self._manufacturers

    def get_models(self, manufacturer_id: str | None = None) -> list[dict[str, Any]]:
        self.ensure_loaded()
        if manufacturer_id:
            return self._models_by_mfg_id.get(manufacturer_id, [])
        return self._models

    def get_parts(self) -> list[dict[str, Any]]:
        self.ensure_loaded()
        return list(self._parts_by_id.values())

    def get_part_lookup_items(self) -> list[dict[str, Any]]:
        self.ensure_loaded()
        return self._part_lookup_items

    def get_response_templates(self, category: str | None = None) -> list[dict[str, Any]]:
        """Fetch template objects for a given category from repository."""
        self.ensure_loaded()
        if category:
            cat_upper = category.strip().upper()
            return self._templates_by_category.get(cat_upper, [])
        return self._response_templates


_repository_instance: CatalogRepository | None = None


def get_repository() -> CatalogRepository:
    global _repository_instance
    if _repository_instance is None:
        _repository_instance = CatalogRepository()
        _repository_instance.ensure_loaded()
    return _repository_instance

