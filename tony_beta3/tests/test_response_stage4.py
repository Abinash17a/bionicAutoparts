"""Tests for Tony Beta 3 Stage 4 Response Engine covering all 10 specification requirements."""

import pytest
from tony_beta3.context import create_context, update_context
from tony_beta3.response import (
    determine_response_category,
    extract_context_variables,
    fetch_templates,
    fill_variables,
    generate_response,
)


def test_stage4_case_1_greeting():
    """Case 1: 'Hi' -> GREETING"""
    ctx = create_context()
    res = generate_response(ctx, user_message="Hi")
    assert res["category"] == "GREETING"
    assert len(res["reply"]) > 0


def test_stage4_case_2_missing_vehicle():
    """Case 2: 'I need a bumper' -> asks for vehicle (ASK_VEHICLE)"""
    ctx = update_context(None, "I need a bumper")
    res = generate_response(ctx, user_message="I need a bumper")
    assert res["category"] == "ASK_VEHICLE"
    assert "bumper" in res["reply"].lower() or "vehicle" in res["reply"].lower() or "make" in res["reply"].lower()


def test_stage4_case_3_missing_model():
    """Case 3: 'Honda 2018' -> asks for model (ASK_MODEL)"""
    ctx = update_context(None, "Honda 2018")
    res = generate_response(ctx, user_message="Honda 2018")
    assert res["category"] == "ASK_MODEL"
    assert "Honda" in res["reply"]


def test_stage4_case_4_missing_part():
    """Case 4: '2018 Honda Civic' -> asks for part (ASK_PART)"""
    ctx = update_context(None, "2018 Honda Civic")
    res = generate_response(ctx, user_message="2018 Honda Civic")
    assert res["category"] == "ASK_PART"
    assert "2018 Honda Civic" in res["reply"] or "Civic" in res["reply"]


def test_stage4_case_5_complete_request():
    """Case 5: '2018 Honda Civic front bumper' -> FOUND / PART_SEARCH"""
    ctx = update_context(None, "2018 Honda Civic front bumper")
    res = generate_response(ctx, user_message="2018 Honda Civic front bumper")
    assert res["category"] in ("FOUND", "PART_SEARCH")
    assert "2018 Honda Civic" in res["reply"]
    assert "front bumper" in res["reply"]


def test_stage4_case_6_pending_confirmation():
    """Case 6: pending candidate Honda -> CONFIRM"""
    ctx = {
        "vehicle": {"manufacturer": None, "model": "Civic", "year": None},
        "part": None,
        "details": {},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88},
    }
    res = generate_response(ctx)
    assert res["category"] == "CONFIRM"
    assert "Honda" in res["reply"]


def test_stage4_case_7_thanks():
    """Case 7: 'thanks' -> THANKS"""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper",
        "details": {},
        "pending_confirmation": None,
    }
    res = generate_response(ctx, user_message="thanks")
    assert res["category"] == "THANKS"
    assert len(res["reply"]) > 0


def test_stage4_case_8_goodbye():
    """Case 8: 'bye' -> GOODBYE"""
    ctx = create_context()
    res = generate_response(ctx, user_message="bye")
    assert res["category"] == "GOODBYE"
    assert len(res["reply"]) > 0


def test_stage4_case_9_details_variable():
    """Case 9: Details: Honda Civic + front bumper + left -> response uses side if template supports it"""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper",
        "details": {"side": "left", "color": "black"},
        "pending_confirmation": None,
    }
    vars_dict = extract_context_variables(ctx)
    assert vars_dict["side"] == "left"
    assert vars_dict["color"] == "black"

    # Template with {side} placeholder
    custom_tpl = "Looking for a {side} {part} for your {vehicle}."
    rendered = fill_variables(custom_tpl, vars_dict)
    assert rendered == "Looking for a left front bumper for your 2018 Honda Civic."


def test_stage4_case_10_randomness():
    """Case 10: Call the same response category repeatedly and verify multiple templates can be selected."""
    templates = fetch_templates("GREETING")
    assert len(templates) >= 2

    # Collect replies over 50 probabilistic runs
    seen_replies = set()
    for _ in range(50):
        res = generate_response(create_context(), user_message="Hi")
        seen_replies.add(res["reply"])

    # Verify that more than 1 distinct template was selected
    assert len(seen_replies) > 1
