"""Confidence-based confirmation and correction engine for Tony Beta 3 (Stage 2)."""

from typing import Any, TypedDict
from tony_beta3.detector import detect_entities
from tony_beta3.normalizer import normalize_text

HIGH_CONFIDENCE_THRESHOLD = 0.90
MEDIUM_CONFIDENCE_MIN = 0.75

AFFIRMATIVE_RESPONSES: set[str] = {
    "yes",
    "yeah",
    "yep",
    "yup",
    "correct",
    "that's right",
    "thats right",
    "right",
    "sure",
    "y",
    "true",
    "exactly",
    "confirm",
    "confirmed",
}

NEGATIVE_RESPONSES: set[str] = {
    "no",
    "nope",
    "nah",
    "wrong",
    "incorrect",
    "not really",
    "n",
    "negative",
    "cancel",
}

GREETING_WORDS: set[str] = {
    "hello",
    "hi",
    "hey",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "howdy",
    "thanks",
    "thank you",
    "thx",
    "ok",
    "okay",
    "cool",
    "great",
}



class PendingConfirmation(TypedDict, total=False):
    field: str
    candidate: str | int
    confidence: float


class ConfirmationState(TypedDict):
    confirmed_entities: dict[str, Any]
    pending_confirmation: PendingConfirmation | None


class ConfirmationResult(TypedDict):
    action: str  # "accept" | "confirm" | "request_input" | "none"
    field: str | None
    candidate: Any
    confidence: float
    state: dict[str, Any]


def create_initial_state() -> ConfirmationState:
    """Create a blank confirmation state."""
    return {
        "confirmed_entities": {
            "manufacturer": None,
            "model": None,
            "year": None,
            "part": None,
            "details": {},
        },
        "pending_confirmation": None,
    }


OUT_OF_SCOPE_KEYWORDS: set[str] = {
    "weather", "joke", "jokes", "president", "news", "recipe", "crypto", "bitcoin",
    "stock", "stocks", "football", "basketball", "soccer", "music", "song", "movie",
    "movies", "game", "games", "who are you", "what can you do", "where do you live",
    "how old are you", "meaning of life", "chatgpt", "openai", "claude", "gemini",
    "translate", "write a poem", "python code", "tell me a story", "food", "restaurant",
    "pizza", "coffee", "temperature", "forecast", "rain", "sunny",
}

OUT_OF_SCOPE_QUESTION_PREFIXES: list[str] = [
    "what is ", "whats ", "what's ", "how is ", "hows ", "how's ",
    "tell me ", "who is ", "who was ", "when was ", "where is ", "why is ",
]


def is_out_of_scope(normalized_text: str) -> bool:
    """Check if normalized message is an obvious non-automotive or out-of-scope query."""
    if not normalized_text:
        return False
    words = set(normalized_text.split())
    if words.intersection(OUT_OF_SCOPE_KEYWORDS):
        return True
    for kw in OUT_OF_SCOPE_KEYWORDS:
        if kw in normalized_text:
            return True
    for prefix in OUT_OF_SCOPE_QUESTION_PREFIXES:
        if normalized_text.startswith(prefix) and not any(
            w in normalized_text for w in ("part", "car", "vehicle", "price", "bumper", "brake", "engine", "door", "light", "honda", "toyota", "ford", "bmw")
        ):
            return True
    return False


def is_affirmative(normalized_text: str) -> bool:
    """Check if normalized message is an affirmative confirmation."""
    return normalized_text in AFFIRMATIVE_RESPONSES


def is_negative(normalized_text: str) -> bool:
    """Check if normalized message is a rejection."""
    return normalized_text in NEGATIVE_RESPONSES


def evaluate_confirmation(
    message: str | None,
    current_state: dict[str, Any] | None = None,
    detection_result: dict[str, Any] | None = None,
) -> ConfirmationResult:
    """Evaluate confirmation decisions based on entity detection and confidence thresholds.

    Confidence rules:
        - HIGH (>= 0.90): Accept automatically without confirmation.
        - MEDIUM (0.75 - 0.89): Require confirmation (action="confirm").
        - LOW (< 0.75): Do not accept automatically (action="request_input" if unfulfilled).

    Handles:
        1. Affirmative user responses ('yes', 'correct') -> accepts pending candidate.
        2. Negative user responses ('no', 'wrong') -> rejects pending candidate and requests input.
        3. Fresh messages -> extracts entities via Stage 1 detector and generates confirmation decisions.
    """
    raw_message = "" if message is None else str(message)
    normalized = normalize_text(raw_message)

    # Initialize or copy existing state
    state: ConfirmationState = {
        "confirmed_entities": {
            "manufacturer": None,
            "model": None,
            "year": None,
            "part": None,
            "details": {},
        },
        "pending_confirmation": None,
    }

    if current_state:
        if "confirmed_entities" in current_state and isinstance(current_state["confirmed_entities"], dict):
            state["confirmed_entities"] = dict(current_state["confirmed_entities"])
        if "pending_confirmation" in current_state and isinstance(current_state["pending_confirmation"], dict):
            state["pending_confirmation"] = dict(current_state["pending_confirmation"])

    pending = state.get("pending_confirmation")

    # 1. Handle active pending confirmation
    if pending and pending.get("field") and pending.get("candidate") is not None:
        pending_field = str(pending["field"])
        pending_candidate = pending["candidate"]
        pending_confidence = float(pending.get("confidence", 0.0))

        # Check for affirmative confirmation (yes / yeah / yep / correct / that's right)
        if is_affirmative(normalized):
            state["confirmed_entities"][pending_field] = pending_candidate
            state["pending_confirmation"] = None
            return {
                "action": "accept",
                "field": pending_field,
                "candidate": pending_candidate,
                "confidence": pending_confidence,
                "state": state,
            }

        # Check for exact negative rejection (no / nope / wrong) without an accompanying new entity
        if is_negative(normalized):
            state["confirmed_entities"][pending_field] = None
            state["pending_confirmation"] = None
            return {
                "action": "request_input",
                "field": pending_field,
                "candidate": None,
                "confidence": 0.0,
                "state": state,
            }

        # If user provided a correction or new input, clear pending and proceed to entity extraction
        state["pending_confirmation"] = None

    # 2. Run Stage 1 entity detector if not pre-computed
    detection = detection_result or detect_entities(raw_message)

    entities = detection.get("entities", {})
    confidence = detection.get("confidence", {})
    unrecognized_tokens = entities.get("unrecognized_tokens", [])

    mfg = entities.get("manufacturer")
    mfg_conf = confidence.get("manufacturer", 0.0)

    model = entities.get("model")
    model_conf = confidence.get("model", 0.0)

    year = entities.get("year")
    year_conf = confidence.get("year", 0.0)

    part = entities.get("part")
    part_conf = confidence.get("part", 0.0)

    details = entities.get("details", {})
    details_conf = confidence.get("details", 0.0)

    has_any_entity = any([mfg, model, year, part, details])

    if unrecognized_tokens:
        state["unrecognized_tokens"] = unrecognized_tokens
        if mfg is None and model is None:
            state["confirmed_entities"]["manufacturer"] = None
            state["confirmed_entities"]["model"] = None

    # 3. Handle pure greetings / non-automotive input / out of scope queries
    if not has_any_entity:
        if normalized in GREETING_WORDS:
            return {
                "action": "none",
                "field": None,
                "candidate": None,
                "confidence": 0.0,
                "state": state,
            }

        if is_out_of_scope(normalized):
            return {
                "action": "out_of_scope",
                "field": None,
                "candidate": None,
                "confidence": 0.0,
                "state": state,
            }

        # Generic requests without recognized entities (e.g. "I need something", "I need some weird car thing")
        return {
            "action": "request_input",
            "field": None,
            "candidate": None,
            "confidence": 0.0,
            "state": state,
        }

    # 4. Process high confidence entities (automatically accept >= 0.90)
    if mfg and mfg_conf >= HIGH_CONFIDENCE_THRESHOLD:
        state["confirmed_entities"]["manufacturer"] = mfg
    if model and model_conf >= HIGH_CONFIDENCE_THRESHOLD:
        state["confirmed_entities"]["model"] = model
    if year and year_conf >= HIGH_CONFIDENCE_THRESHOLD:
        state["confirmed_entities"]["year"] = year
    if part and part_conf >= HIGH_CONFIDENCE_THRESHOLD:
        state["confirmed_entities"]["part"] = part
    if details and details_conf >= HIGH_CONFIDENCE_THRESHOLD:
        state["confirmed_entities"]["details"] = details

    # 5. Check for medium confidence entities (0.75 - 0.89) requiring confirmation
    # Priority order for confirmation: manufacturer -> model -> part -> year
    candidates_to_confirm: list[tuple[str, Any, float]] = []

    if mfg and MEDIUM_CONFIDENCE_MIN <= mfg_conf < HIGH_CONFIDENCE_THRESHOLD:
        candidates_to_confirm.append(("manufacturer", mfg, mfg_conf))
    if model and MEDIUM_CONFIDENCE_MIN <= model_conf < HIGH_CONFIDENCE_THRESHOLD:
        candidates_to_confirm.append(("model", model, model_conf))
    if part and MEDIUM_CONFIDENCE_MIN <= part_conf < HIGH_CONFIDENCE_THRESHOLD:
        candidates_to_confirm.append(("part", part, part_conf))
    if year and MEDIUM_CONFIDENCE_MIN <= year_conf < HIGH_CONFIDENCE_THRESHOLD:
        candidates_to_confirm.append(("year", year, year_conf))

    if candidates_to_confirm:
        field, candidate, conf = candidates_to_confirm[0]
        state["pending_confirmation"] = {
            "field": field,
            "candidate": candidate,
            "confidence": conf,
        }
        return {
            "action": "confirm",
            "field": field,
            "candidate": candidate,
            "confidence": conf,
            "state": state,
        }

    # 6. All detected entities are High Confidence
    return {
        "action": "accept",
        "field": None,
        "candidate": None,
        "confidence": 1.0,
        "state": state,
    }
