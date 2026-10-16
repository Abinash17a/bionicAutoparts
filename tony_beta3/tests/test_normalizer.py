"""Unit tests for text normalization."""

from tony_beta3.normalizer import normalize_text


def test_normalize_basic():
    assert normalize_text("  I need a HENDA   Civic bumper!!! ") == "i need a henda civic bumper"


def test_normalize_empty_and_none():
    assert normalize_text("") == ""
    assert normalize_text(None) == ""


def test_normalize_punctuation():
    assert normalize_text("Hello, world! How's it going? #1") == "hello world how s it going 1"


def test_normalize_repeated_spaces():
    assert normalize_text("toyota     corolla      front    bumper") == "toyota corolla front bumper"
