"""Deterministic detection of auxiliary part details (side, position, color)."""

import re
from typing import TypedDict


class DetailsDetectionResult(TypedDict):
    value: dict[str, str]
    confidence: float


# Side keywords and mappings
SIDE_MAP: dict[str, str] = {
    "left": "left",
    "lh": "left",
    "left hand": "left",
    "left side": "left",
    "driver": "driver",
    "driver side": "driver",
    "drivers side": "driver",
    "right": "right",
    "rh": "right",
    "right hand": "right",
    "right side": "right",
    "passenger": "passenger",
    "passenger side": "passenger",
    "passengers side": "passenger",
}

# Position keywords and mappings
POSITION_MAP: dict[str, str] = {
    "front": "front",
    "rear": "rear",
    "back": "rear",
    "upper": "upper",
    "top": "upper",
    "lower": "lower",
    "bottom": "lower",
    "inner": "inner",
    "inside": "inner",
    "outer": "outer",
    "outside": "outer",
    "center": "center",
    "middle": "center",
}

# Common vehicle part colors
COLORS: set[str] = {
    "black",
    "white",
    "silver",
    "grey",
    "gray",
    "red",
    "blue",
    "green",
    "yellow",
    "gold",
    "brown",
    "orange",
    "maroon",
    "navy",
    "beige",
    "tan",
    "charcoal",
    "burgundy",
    "dark blue",
    "dark grey",
    "dark gray",
    "light blue",
}


def detect_details(text: str) -> DetailsDetectionResult:
    """Detect obvious part details (side, position, color) deterministically.

    Examples:
        "left front bumper" -> {"side": "left", "position": "front"}
        "black bumper" -> {"color": "black"}
        "rear right door" -> {"position": "rear", "side": "right"}
    """
    if not text:
        return {"value": {}, "confidence": 0.0}

    lowered = f" {text.lower()} "
    detected: dict[str, str] = {}

    # 1. Detect side
    # Check multi-word side phrases first
    for phrase, canonical in sorted(SIDE_MAP.items(), key=lambda x: len(x[0]), reverse=True):
        pattern = rf"\b{re.escape(phrase)}\b"
        if re.search(pattern, lowered):
            detected["side"] = canonical
            break

    # 2. Detect position
    for phrase, canonical in sorted(POSITION_MAP.items(), key=lambda x: len(x[0]), reverse=True):
        pattern = rf"\b{re.escape(phrase)}\b"
        if re.search(pattern, lowered):
            detected["position"] = canonical
            break

    # 3. Detect color
    for color in sorted(COLORS, key=lambda x: len(x), reverse=True):
        pattern = rf"\b{re.escape(color)}\b"
        if re.search(pattern, lowered):
            detected["color"] = color
            break

    if detected:
        return {"value": detected, "confidence": 1.0}

    return {"value": {}, "confidence": 0.0}
