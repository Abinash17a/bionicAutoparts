"""Text normalization layer for Tony Beta 3 entity detection."""

import re
import unicodedata


def normalize_text(text: str | None) -> str:
    """Normalize input text for entity matching.

    - Converts text to lowercase.
    - Strips leading and trailing whitespace.
    - Replaces multiple whitespace with a single space.
    - Replaces irrelevant punctuation with spaces or removes it safely.
    - Preserves alphanumeric tokens and word boundaries for accurate fuzzy matching.

    Example:
        "  I need a HENDA   Civic bumper!!! " -> "i need a henda civic bumper"
    """
    if not text:
        return ""

    # Normalize unicode (decompose combined characters)
    normalized = unicodedata.normalize("NFKD", str(text))

    # Convert to lowercase
    normalized = normalized.lower()

    # Replace punctuation and special characters with spaces
    # Keep alphanumeric characters and basic whitespace
    # Replace chars like ! ? , . ; : " ' ` ~ @ # $ % ^ & * ( ) _ + = [ ] { } | \ / < >
    normalized = re.sub(r"[^\w\s-]", " ", normalized)

    # Replace hyphens surrounded by spaces or isolated hyphens with a space
    normalized = re.sub(r"\s+-\s+", " ", normalized)
    normalized = re.sub(r"^-+\s*|\s*-+$", " ", normalized)

    # Collapse repeated whitespace (tabs, newlines, multiple spaces) to a single space
    normalized = re.sub(r"\s+", " ", normalized)

    # Strip leading/trailing spaces
    return normalized.strip()
