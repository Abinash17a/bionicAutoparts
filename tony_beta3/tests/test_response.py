"""Unit and integration tests for Tony Beta 3 Stage 4 (Template Response Generator)."""

import pytest
from tony_beta3.context import create_context, update_context
from tony_beta3.response import (
    choose_template,
    determine_response_category,
    extract_context_variables,
    fetch_templates,
    fill_variables,
    generate_response,
)


def test_determine_category_greeting():
    ctx = create_context()
    cat = determine_response_category(ctx, user_message="hello")
    assert cat == "GREETING"


def test_determine_category_confirm_candidate():
    ctx = {
        "vehicle": {"manufacturer": None, "model": "Civic", "year": None},
        "part": None,
        "details": {},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88},
    }
    cat = determine_response_category(ctx)
    vars_dict = extract_context_variables(ctx)
    assert cat == "CONFIRM"
    assert vars_dict["candidate"] == "Honda"


def test_determine_category_ask_part():
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": None,
        "details": {},
        "pending_confirmation": None,
    }
    cat = determine_response_category(ctx)
    vars_dict = extract_context_variables(ctx)
    assert cat == "ASK_PART"
    assert vars_dict["vehicle"] == "2018 Honda Civic"


def test_determine_category_ask_year():
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": None},
        "part": "bumper",
        "details": {},
        "pending_confirmation": None,
    }
    cat = determine_response_category(ctx)
    vars_dict = extract_context_variables(ctx)
    assert cat == "ASK_YEAR"
    assert vars_dict["manufacturer"] == "Honda"
    assert vars_dict["model"] == "Civic"


def test_determine_category_complete_request():
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper",
        "details": {"side": "left"},
        "pending_confirmation": None,
    }
    cat = determine_response_category(ctx)
    vars_dict = extract_context_variables(ctx)
    assert cat in ("FOUND", "PART_SEARCH")
    assert vars_dict["vehicle"] == "2018 Honda Civic"
    assert vars_dict["part"] == "front bumper"


def test_fill_variables():
    template = "What year is your {manufacturer} {model}?"
    vars_dict = {"manufacturer": "Honda", "model": "Civic"}
    result = fill_variables(template, vars_dict)
    assert result == "What year is your Honda Civic?"


def test_fill_variables_confirmation():
    template = "Did you mean {candidate}?"
    vars_dict = {"candidate": "Honda"}
    result = fill_variables(template, vars_dict)
    assert result == "Did you mean Honda?"


def test_full_pipeline_generate_response():
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper",
        "details": {},
        "pending_confirmation": None,
    }
    res = generate_response(ctx, seed=42)
    assert res["category"] in ("FOUND", "PART_SEARCH")
    assert "2018 Honda Civic" in res["reply"]
    assert "front bumper" in res["reply"]
    assert "template_id" in res
