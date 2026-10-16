"""Unit and integration tests for Tony Beta 3 Stage 2 (Confirmation & Correction Engine)."""

import pytest
from tony_beta3.confirmation import evaluate_confirmation


def test_stage2_case_1_all_high_confidence():
    """Case 1: 'I need a Honda Civic bumper' -> All high-confidence values accepted."""
    res = evaluate_confirmation("I need a Honda Civic bumper")
    assert res["action"] == "accept"
    assert res["state"]["confirmed_entities"]["manufacturer"] == "Honda"
    assert res["state"]["confirmed_entities"]["model"] == "Civic"
    assert res["state"]["confirmed_entities"]["part"] == "bumper"
    assert res["state"]["pending_confirmation"] is None


def test_stage2_case_2_fuzzy_manufacturer_needs_confirmation():
    """Case 2: 'I need a henda Civic' -> Honda requires confirmation."""
    res = evaluate_confirmation("I need a henda Civic")
    assert res["action"] == "confirm"
    assert res["field"] == "manufacturer"
    assert res["candidate"] == "Honda"
    assert 0.75 <= res["confidence"] < 0.90
    assert res["state"]["confirmed_entities"]["model"] == "Civic"
    assert res["state"]["pending_confirmation"]["field"] == "manufacturer"
    assert res["state"]["pending_confirmation"]["candidate"] == "Honda"


def test_stage2_case_3_user_confirms_yes():
    """Case 3: User confirms 'yes' -> Honda accepted."""
    # Step 1: Initial query triggering pending confirmation
    res1 = evaluate_confirmation("I need a henda Civic")
    state_after_step1 = res1["state"]

    # Step 2: User says 'yes'
    res2 = evaluate_confirmation("yes", current_state=state_after_step1)
    assert res2["action"] == "accept"
    assert res2["field"] == "manufacturer"
    assert res2["candidate"] == "Honda"
    assert res2["state"]["confirmed_entities"]["manufacturer"] == "Honda"
    assert res2["state"]["confirmed_entities"]["model"] == "Civic"
    assert res2["state"]["pending_confirmation"] is None


def test_stage2_case_4_user_rejects_no():
    """Case 4: User rejects 'no' -> Honda rejected and manufacturer input requested."""
    # Step 1: Initial query triggering pending confirmation
    res1 = evaluate_confirmation("I need a henda Civic")
    state_after_step1 = res1["state"]

    # Step 2: User says 'no'
    res2 = evaluate_confirmation("no", current_state=state_after_step1)
    assert res2["action"] == "request_input"
    assert res2["field"] == "manufacturer"
    assert res2["candidate"] is None
    assert res2["confidence"] == 0.0
    assert res2["state"]["confirmed_entities"]["manufacturer"] is None
    assert res2["state"]["pending_confirmation"] is None


def test_stage2_case_5_fuzzy_model():
    """Case 5: 'I need a civik' -> Civic confirmation."""
    res = evaluate_confirmation("I need a civik")
    assert res["action"] == "confirm"
    assert res["field"] == "model"
    assert res["candidate"] == "Civic"
    assert 0.75 <= res["confidence"] < 0.90


def test_stage2_case_6_fuzzy_part():
    """Case 6: 'I need a front bumber' -> front bumper candidate."""
    res = evaluate_confirmation("I need a front bumber")
    assert res["action"] in ("confirm", "accept")
    if res["action"] == "confirm":
        assert res["field"] == "part"
        assert res["candidate"] == "front bumper"
    else:
        assert res["state"]["confirmed_entities"]["part"] == "front bumper"


def test_stage2_case_7_generic_request():
    """Case 7: 'I need something' -> no fabricated entity, request input."""
    res = evaluate_confirmation("I need something")
    assert res["action"] == "request_input"
    assert res["candidate"] is None
    assert res["state"]["confirmed_entities"]["manufacturer"] is None
    assert res["state"]["confirmed_entities"]["model"] is None
    assert res["state"]["confirmed_entities"]["part"] is None


def test_stage2_case_8_unrelated_hello():
    """Case 8: 'hello' -> no entity confirmation."""
    res = evaluate_confirmation("hello")
    assert res["action"] == "none"
    assert res["candidate"] is None
    assert res["field"] is None
    assert res["state"]["pending_confirmation"] is None


def test_stage2_case_9_rejected_candidate_never_confirmed():
    """Case 9: Ensure a rejected candidate never becomes confirmed accidentally."""
    # Simulate pending Honda
    state = {
        "confirmed_entities": {"manufacturer": None, "model": "Civic", "year": None, "part": None, "details": {}},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88},
    }
    # Reject with 'nope'
    res = evaluate_confirmation("nope", current_state=state)
    assert res["state"]["confirmed_entities"]["manufacturer"] is None
    assert res["state"]["pending_confirmation"] is None
    assert res["action"] == "request_input"
    assert res["field"] == "manufacturer"
    assert res["candidate"] is None


def test_stage2_case_10_high_confidence_never_asks_confirmation():
    """Case 10: Ensure high-confidence exact matches never unnecessarily ask for confirmation."""
    queries = [
        "I need a Toyota Camry",
        "2018 Honda Civic front bumper",
        "I need a BMW 3 Series",
        "Ford F-150 alternator",
    ]
    for q in queries:
        res = evaluate_confirmation(q)
        assert res["action"] == "accept"
        assert res["state"]["pending_confirmation"] is None
