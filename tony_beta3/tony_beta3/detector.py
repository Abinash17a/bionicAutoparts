"""Main entity detection orchestrator for Tony Beta 3."""

from typing import Any
from tony_beta3.database.repository import CatalogRepository, get_repository
from tony_beta3.details_detector import COLORS, POSITION_MAP, SIDE_MAP, detect_details
from tony_beta3.matching import find_best_candidate_in_index
from tony_beta3.normalizer import normalize_text
from tony_beta3.year_detector import detect_year

MIN_ACCEPTABLE_CONFIDENCE = 0.75


STOP_WORDS: set[str] = {
    "i", "need", "a", "an", "the", "for", "my", "me", "car", "auto", "vehicle", "cars",
    "please", "can", "you", "find", "get", "looking", "want", "have", "of", "to", "is",
    "it", "with", "and", "or", "in", "on", "some", "any", "give", "actually", "no",
    "wait", "make", "that", "sorry", "its", "change", "hello", "hi", "hey", "thanks",
    "thank", "ok", "okay", "bye", "goodbye", "do", "does", "what", "whats", "how",
    "hows", "where", "who", "why", "tell", "searching", "check", "got", "just", "like",
    "s", "re", "ve", "t", "d", "ll", "m", "side", "hand", "view", "part", "parts",
    "model", "make", "year", "car", "type", "piece",
}


def detect_entities(message: str | None, repository: CatalogRepository | None = None) -> dict[str, Any]:
    """Extract automotive entities (manufacturer, model, year, part, details) from user message.

    Workflow:
        USER MESSAGE
            ↓
        NORMALIZE TEXT
            ↓
        DETECT ENTITIES
            ↓
        RETURN STRUCTURED JSON

    Schema:
        {
          "original_text": "...",
          "normalized_text": "...",
          "entities": {
            "manufacturer": null,
            "model": null,
            "year": null,
            "part": null,
            "details": {},
            "unrecognized_tokens": []
          },
          "confidence": {
            "manufacturer": 0.0,
            "model": 0.0,
            "year": 0.0,
            "part": 0.0,
            "details": 0.0
          }
        }
    """
    raw_message = "" if message is None else str(message)
    normalized = normalize_text(raw_message)
    tokens = normalized.split() if normalized else []

    repo = repository or get_repository()
    repo.ensure_loaded()

    matched_indices: set[int] = set()

    # 1. Year detection (deterministic, no DB lookup)
    year_result = detect_year(normalized)
    year_val = year_result["value"]
    year_conf = year_result["confidence"]
    if year_val is not None:
        for idx, tok in enumerate(tokens):
            if tok.isdigit() and len(tok) == 4 and int(tok) == year_val:
                matched_indices.add(idx)

    # 2. Details detection (side, position, color)
    details_result = detect_details(normalized)
    details_val = details_result["value"]
    details_conf = details_result["confidence"]
    if details_val:
        for idx, tok in enumerate(tokens):
            if any(tok in phrase.split() for phrase in SIDE_MAP) or \
               any(tok in phrase.split() for phrase in POSITION_MAP) or \
               tok in COLORS:
                matched_indices.add(idx)

    # 3. Manufacturer detection (exact + fuzzy against Supabase catalog)
    mfg_val: str | None = None
    mfg_conf: float = 0.0
    detected_mfg_id: str | None = None
    mfg_candidate = None

    if tokens and repo.indexed_manufacturers:
        mfg_candidate = find_best_candidate_in_index(
            tokens=tokens,
            indexed_catalog=repo.indexed_manufacturers,
            min_confidence=MIN_ACCEPTABLE_CONFIDENCE,
            max_ngram=2,
        )
        if mfg_candidate:
            mfg_val = mfg_candidate.canonical_name
            mfg_conf = mfg_candidate.score
            detected_mfg_id = mfg_candidate.entity.get("id")
            for i in range(mfg_candidate.span[0], mfg_candidate.span[1]):
                matched_indices.add(i)

    # 4. Model detection (exact + fuzzy against Supabase catalog)
    # Prefer models belonging to detected manufacturer if known
    model_val: str | None = None
    model_conf: float = 0.0
    model_candidate = None

    if tokens:
        if detected_mfg_id and detected_mfg_id in repo.indexed_models_by_mfg_id:
            mfg_models_indexed = repo.indexed_models_by_mfg_id[detected_mfg_id]
            model_candidate = find_best_candidate_in_index(
                tokens=tokens,
                indexed_catalog=mfg_models_indexed,
                min_confidence=MIN_ACCEPTABLE_CONFIDENCE,
                max_ngram=3,
            )

        # Fallback to global model search if not found within manufacturer
        if not model_candidate and repo.indexed_all_models:
            model_candidate = find_best_candidate_in_index(
                tokens=tokens,
                indexed_catalog=repo.indexed_all_models,
                min_confidence=MIN_ACCEPTABLE_CONFIDENCE,
                max_ngram=3,
            )

        if model_candidate:
            model_val = model_candidate.canonical_name
            model_conf = model_candidate.score
            for i in range(model_candidate.span[0], model_candidate.span[1]):
                matched_indices.add(i)

    # 5. Part detection (exact + fuzzy against parts + part_synonyms)
    part_val: str | None = None
    part_conf: float = 0.0

    if tokens and repo.indexed_parts:
        part_candidate = find_best_candidate_in_index(
            tokens=tokens,
            indexed_catalog=repo.indexed_parts,
            min_confidence=MIN_ACCEPTABLE_CONFIDENCE,
            max_ngram=3,
        )
        if part_candidate:
            part_val = part_candidate.canonical_name
            part_conf = part_candidate.score
            for i in range(part_candidate.span[0], part_candidate.span[1]):
                matched_indices.add(i)

    # Identify unrecognized substantive tokens
    unrecognized_tokens = [
        tok for i, tok in enumerate(tokens)
        if i not in matched_indices and tok.lower() not in STOP_WORDS and len(tok) > 1 and not tok.isdigit()
    ]

    return {
        "original_text": raw_message,
        "normalized_text": normalized,
        "entities": {
            "manufacturer": mfg_val,
            "model": model_val,
            "year": year_val,
            "part": part_val,
            "details": details_val,
            "unrecognized_tokens": unrecognized_tokens,
        },
        "confidence": {
            "manufacturer": mfg_conf,
            "model": model_conf,
            "year": year_conf,
            "part": part_conf,
            "details": details_conf,
        },
    }
