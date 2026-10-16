"""Comprehensive test suite for Tony Beta 3 entity detection.

Validates the exact 10 specification test cases and output schema compliance.
"""

import pytest
from tony_beta3.detector import detect_entities


def test_schema_keys_always_present():
    """Verify that all required keys are always present even on empty or unmatched messages."""
    result = detect_entities("")
    assert "original_text" in result
    assert "normalized_text" in result
    assert "entities" in result
    assert "confidence" in result

    entities = result["entities"]
    assert "manufacturer" in entities
    assert "model" in entities
    assert "year" in entities
    assert "part" in entities
    assert "details" in entities

    confidence = result["confidence"]
    assert "manufacturer" in confidence
    assert "model" in confidence
    assert "year" in confidence
    assert "part" in confidence
    assert "details" in confidence


# --- 10 REQUIRED TEST CASES ---


def test_case_1_standard_query():
    """Case 1: 'I need a Honda Civic bumper'"""
    res = detect_entities("I need a Honda Civic bumper")
    assert res["entities"]["manufacturer"] == "Honda"
    assert res["confidence"]["manufacturer"] >= 0.95

    assert res["entities"]["model"] == "Civic"
    assert res["confidence"]["model"] >= 0.95

    assert res["entities"]["part"] == "bumper"
    assert res["confidence"]["part"] >= 0.95


def test_case_2_fuzzy_manufacturer_and_model():
    """Case 2: 'I need a henda civik'"""
    res = detect_entities("I need a henda civik")
    assert res["entities"]["manufacturer"] == "Honda"
    assert 0.75 <= res["confidence"]["manufacturer"] <= 0.95

    assert res["entities"]["model"] == "Civic"
    assert 0.75 <= res["confidence"]["model"] <= 0.95


def test_case_3_full_query_with_year():
    """Case 3: 'I need a front bumper for a 2018 Honda Civic'"""
    res = detect_entities("I need a front bumper for a 2018 Honda Civic")
    assert res["entities"]["manufacturer"] == "Honda"
    assert res["entities"]["model"] == "Civic"
    assert res["entities"]["year"] == 2018
    assert res["confidence"]["year"] == 1.0
    assert res["entities"]["part"] == "front bumper"
    assert res["confidence"]["part"] >= 0.95


def test_case_4_details_and_part():
    """Case 4: 'I need the left black front bumper'"""
    res = detect_entities("I need the left black front bumper")
    assert res["entities"]["part"] == "front bumper"
    assert res["entities"]["details"].get("side") == "left"
    assert res["entities"]["details"].get("color") == "black"
    assert res["entities"]["details"].get("position") == "front"
    assert res["confidence"]["details"] == 1.0


def test_case_5_part_synonym():
    """Case 5: 'I need a Toyota Corolla head lamp'"""
    res = detect_entities("I need a Toyota Corolla head lamp")
    assert res["entities"]["manufacturer"] == "Toyota"
    assert res["entities"]["model"] == "Corolla"
    assert res["entities"]["part"] == "headlight"
    assert res["confidence"]["part"] >= 0.95


def test_case_6_generic_car_query_no_hallucinations():
    """Case 6: 'I need something for my car'"""
    res = detect_entities("I need something for my car")
    assert res["entities"]["manufacturer"] is None
    assert res["confidence"]["manufacturer"] == 0.0

    assert res["entities"]["model"] is None
    assert res["confidence"]["model"] == 0.0

    assert res["entities"]["part"] is None
    assert res["confidence"]["part"] == 0.0


def test_case_7_invalid_future_year_rejected():
    """Case 7: 'I need a 2038 Honda Civic bumper'"""
    res = detect_entities("I need a 2038 Honda Civic bumper")
    assert res["entities"]["manufacturer"] == "Honda"
    assert res["entities"]["model"] == "Civic"
    assert res["entities"]["year"] is None
    assert res["confidence"]["year"] == 0.0
    assert res["entities"]["part"] == "bumper"


def test_case_8_manufacturer_only():
    """Case 8: 'I need a BMW'"""
    res = detect_entities("I need a BMW")
    assert res["entities"]["manufacturer"] == "BMW"
    assert res["confidence"]["manufacturer"] == 1.0
    assert res["entities"]["model"] is None
    assert res["confidence"]["model"] == 0.0
    assert res["entities"]["part"] is None
    assert res["confidence"]["part"] == 0.0


def test_case_9_fuzzy_model_and_part():
    """Case 9: 'civik front bumber'"""
    res = detect_entities("civik front bumber")
    assert res["entities"]["model"] == "Civic"
    assert res["confidence"]["model"] >= 0.75

    assert res["entities"]["part"] == "front bumper"
    assert res["confidence"]["part"] >= 0.75


def test_case_10_unrelated_message():
    """Case 10: 'hello'"""
    res = detect_entities("hello")
    assert res["entities"]["manufacturer"] is None
    assert res["confidence"]["manufacturer"] == 0.0

    assert res["entities"]["model"] is None
    assert res["confidence"]["model"] == 0.0

    assert res["entities"]["year"] is None
    assert res["confidence"]["year"] == 0.0

    assert res["entities"]["part"] is None
    assert res["confidence"]["part"] == 0.0

    assert res["entities"]["details"] == {}
    assert res["confidence"]["details"] == 0.0
