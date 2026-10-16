"""Deterministic year detection module for vehicle queries."""

import re
from typing import TypedDict


class YearDetectionResult(TypedDict):
    value: int | None
    confidence: float


MIN_VALID_YEAR = 1990
MAX_VALID_YEAR = 2026


def detect_year(text: str) -> YearDetectionResult:
    """Detect a valid vehicle model year deterministically from text.

    Supported valid vehicle year range: 1990 to 2026.
    Rejects out-of-range years such as 2038 or 1980.

    Returns:
        YearDetectionResult containing:
            value: int year (e.g. 2018) or None
            confidence: 1.0 if valid year detected, else 0.0
    """
    if not text:
        return {"value": None, "confidence": 0.0}

    # Search for standalone 4-digit years
    # Matches 4 digits bounded by word boundaries
    matches = re.findall(r"\b(\d{4})\b", text)

    for match in matches:
        year = int(match)
        if MIN_VALID_YEAR <= year <= MAX_VALID_YEAR:
            return {"value": year, "confidence": 1.0}

    return {"value": None, "confidence": 0.0}
