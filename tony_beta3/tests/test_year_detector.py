"""Unit tests for deterministic year detection."""

from tony_beta3.year_detector import detect_year


def test_detect_valid_years():
    assert detect_year("2018 Honda Civic bumper") == {"value": 2018, "confidence": 1.0}
    assert detect_year("1995 toyota camry") == {"value": 1995, "confidence": 1.0}
    assert detect_year("2026 ford f150") == {"value": 2026, "confidence": 1.0}
    assert detect_year("1990 mazda miata") == {"value": 1990, "confidence": 1.0}


def test_reject_invalid_years():
    # Future / out-of-range years
    assert detect_year("2038 Honda Civic bumper") == {"value": None, "confidence": 0.0}
    assert detect_year("1980 chevrolet impala") == {"value": None, "confidence": 0.0}
    assert detect_year("2050 tesla model 3") == {"value": None, "confidence": 0.0}


def test_no_year_in_message():
    assert detect_year("I need a front bumper") == {"value": None, "confidence": 0.0}
    assert detect_year("hello") == {"value": None, "confidence": 0.0}
    assert detect_year("") == {"value": None, "confidence": 0.0}
