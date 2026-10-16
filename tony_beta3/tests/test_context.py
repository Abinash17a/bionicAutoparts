"""Unit and integration tests for Tony Beta 3 Stage 3 (Conversation Context & State Manager)."""

import pytest
from tony_beta3.context import create_context, update_context


def test_stage3_case_1_greeting_on_empty_context():
    """Case 1: 'Hi' on empty context -> empty context remains empty."""
    ctx = create_context()
    updated = update_context(ctx, "Hi")
    assert updated["vehicle"]["manufacturer"] is None
    assert updated["vehicle"]["model"] is None
    assert updated["vehicle"]["year"] is None
    assert updated["part"] is None
    assert updated["details"] == {}
    assert updated["pending_confirmation"] is None


def test_stage3_case_2_full_vehicle_part():
    """Case 2: 'I need a Honda Civic bumper' -> manufacturer Honda, model Civic, part bumper."""
    ctx = create_context()
    updated = update_context(ctx, "I need a Honda Civic bumper")
    assert updated["vehicle"]["manufacturer"] == "Honda"
    assert updated["vehicle"]["model"] == "Civic"
    assert updated["vehicle"]["year"] is None
    assert updated["part"] == "bumper"
    assert updated["details"] == {}


def test_stage3_case_3_partial_year():
    """Case 3: '2018' -> year 2018 while retaining previous values."""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": None},
        "part": "bumper",
        "details": {},
        "pending_confirmation": None,
    }
    updated = update_context(ctx, "2018")
    assert updated["vehicle"]["manufacturer"] == "Honda"
    assert updated["vehicle"]["model"] == "Civic"
    assert updated["vehicle"]["year"] == 2018
    assert updated["part"] == "bumper"


def test_stage3_case_4_part_replacement():
    """Case 4: 'front bumper' -> part becomes front bumper."""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "bumper",
        "details": {},
        "pending_confirmation": None,
    }
    updated = update_context(ctx, "front bumper")
    assert updated["vehicle"]["manufacturer"] == "Honda"
    assert updated["vehicle"]["model"] == "Civic"
    assert updated["vehicle"]["year"] == 2018
    assert updated["part"] == "front bumper"


def test_stage3_case_5_details_side():
    """Case 5: 'left side' -> details.side = left."""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper",
        "details": {},
        "pending_confirmation": None,
    }
    updated = update_context(ctx, "left side")
    assert updated["details"]["side"] == "left"
    assert updated["part"] == "front bumper"
    assert updated["vehicle"]["manufacturer"] == "Honda"


def test_stage3_case_6_details_color_merging():
    """Case 6: 'black' -> details.color = black while retaining side."""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper",
        "details": {"side": "left"},
        "pending_confirmation": None,
    }
    updated = update_context(ctx, "black")
    assert updated["details"]["color"] == "black"
    assert updated["details"]["side"] == "left"
    assert updated["part"] == "front bumper"


def test_stage3_case_7_correction_manufacturer():
    """Case 7: 'Actually Toyota' -> manufacturer becomes Toyota while clearing incompatible model Civic and retaining year/part/details."""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper",
        "details": {"side": "left", "color": "black"},
        "pending_confirmation": None,
    }
    updated = update_context(ctx, "Actually Toyota")
    assert updated["vehicle"]["manufacturer"] == "Toyota"
    assert updated["vehicle"]["model"] is None
    assert updated["vehicle"]["year"] == 2018
    assert updated["part"] == "front bumper"
    assert updated["details"] == {"side": "left", "color": "black"}


def test_stage3_case_8_greeting_after_information():
    """Case 8: Greeting after information: 'Hi' -> context unchanged."""
    ctx = {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "bumper",
        "details": {},
        "pending_confirmation": None,
    }
    updated = update_context(ctx, "Hi")
    assert updated["vehicle"] == {"manufacturer": "Honda", "model": "Civic", "year": 2018}
    assert updated["part"] == "bumper"
    assert updated["details"] == {}


def test_stage3_case_9_confirmation_flow_yes():
    """Case 9: Confirmation: 'henda' -> pending Honda, 'yes' -> Honda stored."""
    ctx = create_context()
    # Step 1: User says 'henda'
    step1 = update_context(ctx, "henda")
    assert step1["pending_confirmation"] is not None
    assert step1["pending_confirmation"]["field"] == "manufacturer"
    assert step1["pending_confirmation"]["candidate"] == "Honda"
    assert step1["vehicle"]["manufacturer"] is None

    # Step 2: User says 'yes'
    step2 = update_context(step1, "yes")
    assert step2["vehicle"]["manufacturer"] == "Honda"
    assert step2["pending_confirmation"] is None


def test_stage3_case_10_confirmation_flow_no():
    """Case 10: Confirmation rejection: 'henda' -> pending Honda, 'no' -> Honda NOT stored."""
    ctx = create_context()
    # Step 1: User says 'henda'
    step1 = update_context(ctx, "henda")
    assert step1["pending_confirmation"] is not None

    # Step 2: User says 'no'
    step2 = update_context(step1, "no")
    assert step2["vehicle"]["manufacturer"] is None
    assert step2["pending_confirmation"] is None


def test_stage3_case_11_null_extraction_does_not_erase():
    """Case 11: Null extraction: existing information must not be erased."""
    ctx = {
        "vehicle": {"manufacturer": "Toyota", "model": "Corolla", "year": 2020},
        "part": "headlight",
        "details": {"side": "passenger"},
        "pending_confirmation": None,
    }
    # Unrelated or unfulfilled query
    updated = update_context(ctx, "thanks very much")
    assert updated["vehicle"] == {"manufacturer": "Toyota", "model": "Corolla", "year": 2020}
    assert updated["part"] == "headlight"
    assert updated["details"] == {"side": "passenger"}


def test_stage3_case_12_cumulative_sequential_messages():
    """Case 12: Multiple sequential messages must produce one cumulative context."""
    ctx = create_context()

    # Message 1: "Honda Civic"
    ctx = update_context(ctx, "Honda Civic")
    assert ctx["vehicle"]["manufacturer"] == "Honda"
    assert ctx["vehicle"]["model"] == "Civic"

    # Message 2: "2018"
    ctx = update_context(ctx, "2018")
    assert ctx["vehicle"]["year"] == 2018

    # Message 3: "bumper"
    ctx = update_context(ctx, "bumper")
    assert ctx["part"] == "bumper"

    # Message 4: "front bumper"
    ctx = update_context(ctx, "front bumper")
    assert ctx["part"] == "front bumper"

    # Message 5: "black"
    ctx = update_context(ctx, "black")
    assert ctx["details"]["color"] == "black"

    # Message 6: "left side"
    ctx = update_context(ctx, "left side")
    assert ctx["details"]["side"] == "left"
    assert ctx["details"]["color"] == "black"

    # Message 7: "hello"
    ctx = update_context(ctx, "hello")

    # Final Cumulative State Verification
    assert ctx["vehicle"] == {
        "manufacturer": "Honda",
        "model": "Civic",
        "year": 2018,
    }
    assert ctx["part"] == "front bumper"
    assert ctx["details"] == {
        "color": "black",
        "side": "left",
        "position": "front",
    }

    assert ctx["pending_confirmation"] is None
