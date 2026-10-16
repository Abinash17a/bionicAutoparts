"""Deterministic response engine for Tony Beta 3 (Stage 4).

Consumes Stage 3 context, selects appropriate response category, fetches templates from Supabase,
chooses random template, interpolates variables, and returns structured reply.
"""

import random
import re
from typing import Any, TypedDict
from tony_beta3.database.repository import CatalogRepository, get_repository
from tony_beta3.normalizer import normalize_text


class ResponseOutput(TypedDict):
    category: str
    template_id: str | int
    reply: str


GREETING_TRIGGERS: set[str] = {
    "hi",
    "hello",
    "hey",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "howdy",
}

THANKS_TRIGGERS: set[str] = {
    "thanks",
    "thank you",
    "thx",
    "thank u",
    "appreciate it",
    "many thanks",
}

GOODBYE_TRIGGERS: set[str] = {
    "bye",
    "goodbye",
    "see you",
    "cya",
    "farewell",
    "have a good day",
    "have a nice day",
}


def build_vehicle_string(mfg: str | None, model: str | None, year: int | str | None) -> str:
    """Build natural vehicle string from available vehicle fields."""
    parts = []
    if year:
        parts.append(str(year))
    if mfg:
        parts.append(str(mfg))
    if model:
        parts.append(str(model))
    return " ".join(parts).strip() or "vehicle"


def build_detailed_part_string(part: str | None, details: dict[str, str] | None) -> str:
    """Combine base part and auxiliary details (side, position, color) naturally."""
    if not part:
        return ""
    base_part = str(part).strip()
    if not details:
        return base_part

    side = details.get("side", "").strip()
    position = details.get("position", "").strip()
    color = details.get("color", "").strip()

    part_tokens = set(base_part.lower().split())

    # Build sequence of modifier words that are not already part of the base part string
    modifiers: list[str] = []
    if side and side.lower() not in part_tokens:
        modifiers.append(side)
    if position and position.lower() not in part_tokens:
        modifiers.append(position)
    if color and color.lower() not in part_tokens:
        modifiers.append(color)

    if modifiers:
        return f"{' '.join(modifiers)} {base_part}"
    return base_part


def extract_context_variables(context: dict[str, Any]) -> dict[str, Any]:
    """Extract all template variables from the current conversation context."""
    pending = context.get("pending_confirmation") or {}
    veh = context.get("vehicle", {}) or {}
    mfg = veh.get("manufacturer")
    model = veh.get("model")
    year = veh.get("year")
    part = context.get("part")
    details = context.get("details", {}) or {}

    vehicle_str = build_vehicle_string(mfg, model, year)
    detailed_part = build_detailed_part_string(part, details)

    return {
        "candidate": pending.get("candidate", "") if isinstance(pending, dict) else "",
        "field": pending.get("field", "") if isinstance(pending, dict) else "",
        "manufacturer": mfg or "",
        "model": model or "",
        "year": str(year) if year is not None else "",
        "part": part or "",
        "detailed_part": detailed_part or part or "",
        "side": details.get("side", ""),
        "position": details.get("position", ""),
        "color": details.get("color", ""),
        "vehicle": vehicle_str,
    }


def determine_response_category(
    context: dict[str, Any],
    user_message: str | None = None,
    stage2_result: dict[str, Any] | None = None,
) -> str:
    """Determine the response category deterministically based on context and input."""
    # 0. Check action from Stage 2 result
    if stage2_result:
        action = stage2_result.get("action")
        if action == "out_of_scope":
            return "OUT_OF_SCOPE"

    norm_msg = normalize_text(user_message or "")

    # 1. Active pending confirmation in context
    pending = context.get("pending_confirmation")
    if pending and pending.get("candidate"):
        return "CONFIRM"

    # 2. Conversational Intent Triggers
    if norm_msg in GREETING_TRIGGERS:
        return "GREETING"
    if norm_msg in THANKS_TRIGGERS:
        return "THANKS"
    if norm_msg in GOODBYE_TRIGGERS:
        return "GOODBYE"

    veh = context.get("vehicle", {}) or {}
    mfg = veh.get("manufacturer")
    model = veh.get("model")
    year = veh.get("year")
    part = context.get("part")

    # 3. Complete request (Vehicle make + model + year + part)
    if mfg and model and year and part:
        return "FOUND"

    # 4. Have make + model + part, but missing year
    if mfg and model and part and not year:
        return "ASK_YEAR"

    # 5. Have make + model, missing part
    if mfg and model and not part:
        return "ASK_PART"

    # 6. Have make, missing model
    if mfg and not model:
        return "ASK_MODEL"

    # 7. Have model, missing make (Missing-Field logic)
    if not mfg and model:
        return "ASK_MAKE"

    # 8. Have part or year, missing vehicle make & model
    if not mfg and not model and (part or year):
        return "ASK_VEHICLE"

    # 9. Unfulfilled / empty context
    if not mfg and not model and not year and not part:
        return "NOT_FOUND"

    return "ASK_VEHICLE"


def fetch_templates(category: str, repository: CatalogRepository | None = None) -> list[dict[str, Any]]:
    """Fetch response templates for a category from repository."""
    repo = repository or get_repository()
    templates = repo.get_response_templates(category)
    if not templates:
        templates = repo.get_response_templates("NOT_FOUND")
    return templates or [{"id": "fallback", "category": category, "template_text": "How can I help with your vehicle parts search?"}]


def choose_template(templates: list[dict[str, Any]], seed: int | None = None) -> dict[str, Any]:
    """Select a template randomly or deterministically if a seed is provided."""
    if not templates:
        return {"id": "default", "template_text": ""}
    if seed is not None:
        rng = random.Random(seed)
        return rng.choice(templates)
    return random.choice(templates)


def fill_variables(template_text: str, variables: dict[str, Any]) -> str:
    """Interpolate placeholder variables and fix grammar artifacts."""
    rendered = template_text

    # Pre-clean "a {part}" if part is empty
    if not variables.get("part"):
        rendered = rendered.replace("a {part} for", "parts for")
        rendered = rendered.replace("a {part}", "parts")

    # If template contains {part} but does NOT contain explicit {side}/{position}/{color},
    # use detailed_part for {part} to reflect side/position/color details naturally
    has_explicit_details = any(ph in rendered for ph in ("{side}", "{position}", "{color}"))
    part_to_use = variables.get("part", "") if has_explicit_details else (variables.get("detailed_part") or variables.get("part", ""))

    substitutions = dict(variables)
    substitutions["part"] = part_to_use

    for key, val in substitutions.items():
        placeholder = f"{{{key}}}"
        rendered = rendered.replace(placeholder, str(val))

    # Clean up grammar artifacts
    rendered = re.sub(r"\b(a|an)\s+for\b", "parts for", rendered)
    rendered = re.sub(r"\b(a|an)\s+\.", ".", rendered)
    rendered = re.sub(r"\s+", " ", rendered)
    return rendered.strip()


def generate_response(
    context: dict[str, Any],
    user_message: str | None = None,
    stage2_result: dict[str, Any] | None = None,
    repository: CatalogRepository | None = None,
    seed: int | None = None,
) -> ResponseOutput:
    """Generate deterministic template-based response for the conversation context.

    Returns:
        {
          "category": "FOUND",
          "template_id": "tpl_found_1",
          "reply": "Got it. You're looking for a front bumper for your 2018 Honda Civic."
        }
    """
    repo = repository or get_repository()

    # 1. Determine response category
    category = determine_response_category(context, user_message=user_message, stage2_result=stage2_result)

    # 2. Extract context variables
    variables = extract_context_variables(context)

    # 3. Fetch matching templates
    templates = fetch_templates(category, repository=repo)

    # 4. Choose response template
    chosen_tpl = choose_template(templates, seed=seed)
    tpl_id = chosen_tpl.get("id", "default")
    tpl_text = chosen_tpl.get("template_text", "")

    # 5. Fill variables
    reply = fill_variables(tpl_text, variables)

    return {
        "category": category,
        "template_id": tpl_id,
        "reply": reply,
    }


# Backward compatibility alias
generate_reply = generate_response
