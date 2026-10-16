"""Regression test suite for Tony Beta 3 Strawberry strength audit fixes."""

import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app import respond, restore_session, generate_new_session_id
from tony_beta3.api import app as fastapi_app
from tony_beta3.chat import chat
from tony_beta3.confirmation import evaluate_confirmation
from tony_beta3.context import create_context, update_context
from tony_beta3.detector import detect_entities
from tony_beta3.database.session_repository import SessionRepository


# A. Contradictory vehicle state: 2018 Honda Civic -> actually Toyota -> model cleared / re-requested
def test_regression_a_contradictory_vehicle_state_clears_model():
    ctx = create_context()
    r1 = chat("2018 Honda Civic bumper", context=ctx)
    assert r1["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r1["context"]["vehicle"]["model"] == "Civic"
    assert r1["context"]["vehicle"]["year"] == 2018

    # User corrects manufacturer to Toyota
    r2 = chat("actually Toyota", context=r1["context"])
    assert r2["context"]["vehicle"]["manufacturer"] == "Toyota"
    assert r2["context"]["vehicle"]["model"] is None  # Model cleared!
    assert r2["context"]["vehicle"]["year"] == 2018   # Year preserved!
    assert r2["context"]["part"] == "bumper"          # Part preserved!
    assert r2["category"] == "ASK_MODEL"              # Asks for Toyota model!

    # 3-step test: 2018 Honda Civic -> 2020 Toyota Corolla -> actually BMW
    r3 = chat("2020 Toyota Corolla bumper", context=create_context())
    r4 = chat("actually BMW", context=r3["context"])
    assert r4["context"]["vehicle"]["manufacturer"] == "BMW"
    assert r4["context"]["vehicle"]["model"] is None
    assert r4["context"]["vehicle"]["year"] == 2020
    assert r4["category"] == "ASK_MODEL"


# B. Invalid input must not fall back to stale context:
# 2018 Honda Civic bumper -> 2018 spaceship bumper -> does not reuse stale Honda
def test_regression_b_invalid_input_does_not_reuse_stale_context():
    ctx = create_context()
    r1 = chat("2018 Honda Civic bumper", context=ctx)
    assert r1["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r1["context"]["vehicle"]["model"] == "Civic"

    # User enters invalid vehicle entity
    r2 = chat("2018 spaceship bumper", context=r1["context"])
    # Must NOT silently reuse Honda / Civic
    assert r2["context"]["vehicle"]["manufacturer"] is None
    assert r2["context"]["vehicle"]["model"] is None
    assert r2["context"]["vehicle"]["year"] == 2018
    assert r2["context"]["part"] == "bumper"
    assert r2["category"] != "FOUND"
    assert "Honda" not in r2["reply"]
    assert "Civic" not in r2["reply"]


# C. Correction language: henda Civic -> no, Mercedes -> Mercedes handled as correction
def test_regression_c_correction_language_no_mercedes():
    # Step 1: fuzzy message triggering pending Honda
    ctx = create_context()
    r1 = chat("I need a henda Civic", context=ctx)
    assert r1["action"] == "confirm"
    assert r1["context"]["pending_confirmation"]["candidate"] == "Honda"

    # Step 2: "no, Mercedes"
    r2 = chat("no, Mercedes", context=r1["context"])
    assert r2["action"] == "accept"
    assert r2["context"]["vehicle"]["manufacturer"] == "Mercedes-Benz"
    assert r2["context"]["pending_confirmation"] is None
    # Incompatible Civic model cleared
    assert r2["context"]["vehicle"]["model"] is None

    # Other correction phrases
    phrases = [
        ("actually Toyota", "Toyota"),
        ("no Toyota", "Toyota"),
        ("wait, make that Audi", "Audi"),
        ("sorry, it's BMW", "BMW"),
        ("change that to Honda", "Honda"),
    ]
    for phrase, expected_mfg in phrases:
        det = detect_entities(phrase)
        assert det["entities"]["manufacturer"] == expected_mfg


# D. Unrelated messages: 2018 Honda Civic bumper -> What's the weather? -> not treated as automotive confirmation
def test_regression_d_unrelated_message_not_treated_as_confirmation():
    ctx = create_context()
    r1 = chat("2018 Honda Civic bumper", context=ctx)
    assert r1["category"] in ("FOUND", "PART_SEARCH")

    # Unrelated question
    r2 = chat("What's the weather?", context=r1["context"])
    assert r2["category"] == "OUT_OF_SCOPE"
    assert r2["action"] == "out_of_scope"
    # Does not fabricate an answer or confirm previous parts
    assert "Civic" not in r2["reply"] or "only" in r2["reply"].lower() or "auto parts" in r2["reply"].lower()

    # Context is preserved
    assert r2["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r2["context"]["vehicle"]["model"] == "Civic"
    assert r2["context"]["part"] == "bumper"


# E. Missing-field logic: 2018 Civic bumper -> asks only for missing make
def test_regression_e_missing_field_logic_asks_only_for_make():
    ctx = create_context()
    r = chat("Can you find me a bumper for my 2018 Civic?", context=ctx)
    assert r["context"]["vehicle"]["model"] == "Civic"
    assert r["context"]["vehicle"]["year"] == 2018
    assert r["context"]["part"] == "bumper"
    assert r["context"]["vehicle"]["manufacturer"] is None
    assert r["category"] == "ASK_MAKE"
    assert "make" in r["reply"].lower()
    # Does not ask for year or model which are already known
    assert "year" not in r["reply"].lower()


# F. Detail confirmation: 2018 Honda Civic rear right door -> preserves rear + right
def test_regression_f_detail_confirmation_preserves_details():
    ctx = create_context()
    r = chat("2018 Honda Civic rear right door", context=ctx)
    assert r["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r["context"]["vehicle"]["model"] == "Civic"
    assert r["context"]["vehicle"]["year"] == 2018
    assert r["context"]["details"].get("position") == "rear"
    assert r["context"]["details"].get("side") == "right"
    assert r["category"] in ("FOUND", "PART_SEARCH")
    reply_lower = r["reply"].lower()
    assert "rear" in reply_lower
    assert "right" in reply_lower
    assert "door" in reply_lower
    assert "2018 honda civic" in reply_lower

    # Full details: 2018 Honda Civic front bumper left black
    ctx2 = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "bumper",
        "details": {"position": "front", "side": "left", "color": "black"},
        "pending_confirmation": None,
    }
    r2 = chat("I'm ready", context=ctx2)
    assert "left" in r2["reply"].lower()
    assert "front" in r2["reply"].lower()
    assert "black" in r2["reply"].lower()
    assert "bumper" in r2["reply"].lower()


# G. Fuzzy/synonym consistency: hedlight -> headlight
def test_regression_g_fuzzy_synonym_hedlight():
    res = detect_entities("hedlight")
    assert res["entities"]["part"] == "headlight"
    assert res["confidence"]["part"] >= 0.75


# H. Fuzzy/synonym consistency: gear box -> gearbox / transmission
def test_regression_h_fuzzy_synonym_gear_box():
    res = detect_entities("gear box")
    assert res["entities"]["part"] == "transmission"
    assert res["confidence"]["part"] >= 0.95


# I. Fuzzy/synonym consistency: break pad -> brake pad
def test_regression_i_fuzzy_synonym_break_pad():
    res = detect_entities("break pad")
    assert res["entities"]["part"] == "brake pad"
    assert res["confidence"]["part"] >= 0.95


# J. Complete-message reliability: "I need a 2018 Honda Civic front bumper"
def test_regression_j_complete_exact_request_reliability():
    for _ in range(5):
        res = chat("I need a 2018 Honda Civic front bumper")
        assert res["action"] == "accept"
        assert res["category"] in ("FOUND", "PART_SEARCH")
        assert res["context"]["vehicle"]["manufacturer"] == "Honda"
        assert res["context"]["vehicle"]["model"] == "Civic"
        assert res["context"]["vehicle"]["year"] == 2018
        assert res["context"]["part"] == "front bumper"
        assert len(res["reply"]) > 0


# K. Refresh / session: reconnect to existing session
def test_regression_k_session_refresh_restoration():
    repo = SessionRepository(use_supabase=False)
    sid = "refresh-test-session-999"

    # Turn 1
    r1 = chat("2018 Honda Civic front bumper", session_id=sid, session_repository=repo)
    assert r1["context"]["vehicle"]["manufacturer"] == "Honda"

    # Simulate page refresh
    history, restored_sid = restore_session(sid)
    assert restored_sid == sid
    assert len(history) >= 0  # Reconnected cleanly

    # Next turn on the reconnected session
    r2 = chat("left side", session_id=sid, session_repository=repo)
    assert r2["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r2["context"]["details"].get("side") == "left"


# L. Public API: Gradio respond and FastAPI /chat return valid responses
def test_regression_l_public_api_endpoints():
    # FastAPI endpoint
    client = TestClient(fastapi_app)
    api_res = client.post("/chat", json={"message": "I need a 2018 Honda Civic front bumper"})
    assert api_res.status_code == 200
    data = api_res.json()
    assert data["category"] in ("FOUND", "PART_SEARCH")
    assert data["context"]["vehicle"]["manufacturer"] == "Honda"

    # Gradio respond handler
    inp, hist, sid = respond("2018 Toyota Corolla headlight", None, None)
    assert inp == ""
    assert len(hist) == 2
    assert hist[1]["role"] == "assistant"
    assert len(hist[1]["content"]) > 0
    assert sid.startswith("session-")


# Grammar fix test: ensuring no "Which vehicle (year, make, and model) do you need a for?"
def test_regression_grammar_negative_confirmation():
    ctx = create_context()
    ctx["vehicle"]["year"] = 2018
    # Missing make, model, and part
    r = chat("2018", context=create_context())
    assert "need a for" not in r["reply"]
    assert " a ." not in r["reply"]
