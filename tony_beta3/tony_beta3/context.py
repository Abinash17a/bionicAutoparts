"""Conversation context and state manager for Tony Beta 3 (Stage 3).

Stores confirmed automotive information and details cumulatively across messages.
"""

from typing import Any, TypedDict
from tony_beta3.confirmation import evaluate_confirmation
from tony_beta3.database.repository import get_repository


class VehicleContext(TypedDict):
    manufacturer: str | None
    model: str | None
    year: int | None


class ConversationContext(TypedDict):
    vehicle: VehicleContext
    part: str | None
    details: dict[str, str]
    pending_confirmation: dict[str, Any] | None


def create_context() -> ConversationContext:
    """Create a clean, empty conversation context structure."""
    return {
        "vehicle": {
            "manufacturer": None,
            "model": None,
            "year": None,
        },
        "part": None,
        "details": {},
        "pending_confirmation": None,
    }


def update_context(
    current_context: dict[str, Any] | None,
    user_message: str | None = None,
    stage2_result: dict[str, Any] | None = None,
) -> ConversationContext:
    """Update conversation context with new confirmed entities or confirmation results.

    Behavior:
    - Preserves unmentioned existing information.
    - Replaces old entity values when a new confirmed value is detected.
    - Validates manufacturer and model compatibility; clears model if incompatible.
    - If user provides invalid/unrecognized entity tokens, does not reuse stale vehicle context.
    - Merges detail dictionary keys individually (side, position, color).
    - Integrates Stage 2 confirmation / rejection ('yes' / 'no').
    - Ignores greetings, conversational noise, and out-of-scope questions without erasing context.
    - Never fabricates missing entities (null detections do not overwrite existing values).

    Returns:
        The updated ConversationContext dictionary.
    """
    # Initialize or copy existing context
    context: ConversationContext = {
        "vehicle": {
            "manufacturer": None,
            "model": None,
            "year": None,
        },
        "part": None,
        "details": {},
        "pending_confirmation": None,
    }

    if current_context:
        veh = current_context.get("vehicle", {})
        if isinstance(veh, dict):
            context["vehicle"]["manufacturer"] = veh.get("manufacturer")
            context["vehicle"]["model"] = veh.get("model")
            context["vehicle"]["year"] = veh.get("year")

        context["part"] = current_context.get("part")
        if isinstance(current_context.get("details"), dict):
            context["details"] = dict(current_context["details"])

        if current_context.get("pending_confirmation") and isinstance(current_context["pending_confirmation"], dict):
            context["pending_confirmation"] = dict(current_context["pending_confirmation"])

    # If stage2_result is not pre-computed, run Stage 2 evaluator
    if stage2_result is None and user_message is not None:
        internal_state = {
            "confirmed_entities": {
                "manufacturer": context["vehicle"]["manufacturer"],
                "model": context["vehicle"]["model"],
                "year": context["vehicle"]["year"],
                "part": context["part"],
                "details": dict(context["details"]),
            },
            "pending_confirmation": context["pending_confirmation"],
        }
        stage2_result = evaluate_confirmation(user_message, current_state=internal_state)

    if not stage2_result:
        return context

    action = stage2_result.get("action")
    field = stage2_result.get("field")
    candidate = stage2_result.get("candidate")
    result_state = stage2_result.get("state", {})
    confirmed_in_result = result_state.get("confirmed_entities", {})
    unrecognized_tokens = result_state.get("unrecognized_tokens") or stage2_result.get("unrecognized_tokens", [])

    # 1. Action: "none" (Greeting/noise) or "out_of_scope" -> Preserve context unchanged
    if action in ("none", "out_of_scope"):
        return context

    # 2. Action: "accept" (Confirmed via 'yes' or High-Confidence match)
    if action == "accept":
        # Handle explicit single-field confirmation from previous pending
        if field and candidate is not None:
            if field == "manufacturer":
                context["vehicle"]["manufacturer"] = str(candidate)
            elif field == "model":
                context["vehicle"]["model"] = str(candidate)
            elif field == "year":
                context["vehicle"]["year"] = int(candidate)
            elif field == "part":
                context["part"] = str(candidate)

        # Merge confirmed entities from Stage 2 state
        if confirmed_in_result.get("manufacturer") is not None:
            context["vehicle"]["manufacturer"] = confirmed_in_result["manufacturer"]
        if confirmed_in_result.get("model") is not None:
            context["vehicle"]["model"] = confirmed_in_result["model"]
        if confirmed_in_result.get("year") is not None:
            context["vehicle"]["year"] = confirmed_in_result["year"]
        if confirmed_in_result.get("part") is not None:
            context["part"] = confirmed_in_result["part"]
        if isinstance(confirmed_in_result.get("details"), dict):
            context["details"].update(confirmed_in_result["details"])

        # If incoming message contains unrecognized entity tokens where a vehicle make/model would be,
        # clear stale vehicle make & model so they are not silently reused
        if unrecognized_tokens and confirmed_in_result.get("manufacturer") is None and confirmed_in_result.get("model") is None:
            context["vehicle"]["manufacturer"] = None
            context["vehicle"]["model"] = None

        # Validate manufacturer and model compatibility
        repo = get_repository()
        current_mfg = context["vehicle"]["manufacturer"]
        current_mod = context["vehicle"]["model"]
        if current_mfg and current_mod:
            if not repo.is_model_compatible(current_mfg, current_mod):
                context["vehicle"]["model"] = None

        context["pending_confirmation"] = result_state.get("pending_confirmation")
        return context

    # 3. Action: "confirm" (Candidate requires confirmation)
    if action == "confirm":
        # Merge any accompanying high-confidence entities from the same message
        if confirmed_in_result.get("manufacturer") is not None:
            context["vehicle"]["manufacturer"] = confirmed_in_result["manufacturer"]
        if confirmed_in_result.get("model") is not None:
            context["vehicle"]["model"] = confirmed_in_result["model"]
        if confirmed_in_result.get("year") is not None:
            context["vehicle"]["year"] = confirmed_in_result["year"]
        if confirmed_in_result.get("part") is not None:
            context["part"] = confirmed_in_result["part"]
        if isinstance(confirmed_in_result.get("details"), dict):
            context["details"].update(confirmed_in_result["details"])

        # Validate manufacturer and model compatibility
        repo = get_repository()
        current_mfg = context["vehicle"]["manufacturer"]
        current_mod = context["vehicle"]["model"]
        if current_mfg and current_mod:
            if not repo.is_model_compatible(current_mfg, current_mod):
                context["vehicle"]["model"] = None

        context["pending_confirmation"] = result_state.get("pending_confirmation")
        return context

    # 4. Action: "request_input" (User rejected via 'no' or generic unfulfilled query)
    if action == "request_input":
        # If user rejected a pending field, clear pending_confirmation and do not store rejected value
        context["pending_confirmation"] = None
        return context

    return context
