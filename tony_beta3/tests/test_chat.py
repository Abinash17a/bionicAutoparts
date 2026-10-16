"""Tests for final chatbot orchestration layer (Stage 5).

Covers:
- 10-message multi-turn realistic conversation
- Single-turn direct part request
- Fuzzy detection -> Confirmation -> Acceptance
- Fuzzy detection -> Confirmation -> Rejection
- Corrections flow (e.g. 'Actually Toyota')
- Variable replacement in responses
- Context state consistency
"""

import pytest
from tony_beta3.chat import chat
from tony_beta3.context import create_context


def test_single_turn_complete_request():
    """Single-turn request should detect, store in context, and return FOUND/PART_SEARCH."""
    result = chat("I need a 2018 Honda Civic front bumper")

    assert result["action"] == "accept"
    assert result["category"] in ("FOUND", "PART_SEARCH")
    assert result["context"]["vehicle"]["manufacturer"] == "Honda"
    assert result["context"]["vehicle"]["model"] == "Civic"
    assert result["context"]["vehicle"]["year"] == 2018
    assert result["context"]["part"] == "front bumper"
    assert result["context"]["pending_confirmation"] is None
    assert "Honda" in result["reply"] or "Civic" in result["reply"] or "front bumper" in result["reply"]


def test_10_message_multi_turn_flow():
    """Verify the exact 10-message multi-turn conversation from the Stage 5 spec:
    1. 'Hi' -> GREETING
    2. 'I need a honda' -> ASK_MODEL (Honda stored)
    3. 'Actually henda' -> CONFIRM (pending Honda)
    4. 'yes' -> ASK_MODEL (Honda confirmed)
    5. '2018 civic' -> ASK_PART (2018 Honda Civic stored)
    6. 'front bumper' -> FOUND (front bumper stored)
    7. 'left side' -> FOUND (side: left merged)
    8. 'black' -> FOUND (color: black merged)
    9. 'thanks' -> THANKS (context preserved)
    10. 'bye' -> GOODBYE (context preserved)
    """
    ctx = None

    # Turn 1: "Hi"
    r1 = chat("Hi", context=ctx)
    assert r1["category"] == "GREETING"
    assert r1["context"]["vehicle"]["manufacturer"] is None
    ctx = r1["context"]

    # Turn 2: "I need a honda"
    r2 = chat("I need a honda", context=ctx)
    assert r2["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r2["context"]["vehicle"]["model"] is None
    assert r2["category"] == "ASK_MODEL"
    ctx = r2["context"]

    # Turn 3: "Actually henda" (fuzzy match Honda requiring confirmation)
    r3 = chat("Actually henda", context=ctx)
    assert r3["action"] == "confirm"
    assert r3["category"] == "CONFIRM"
    assert r3["context"]["pending_confirmation"] is not None
    assert r3["context"]["pending_confirmation"]["field"] == "manufacturer"
    assert r3["context"]["pending_confirmation"]["candidate"] == "Honda"
    ctx = r3["context"]

    # Turn 4: "yes" (user accepts pending confirmation)
    r4 = chat("yes", context=ctx)
    assert r4["action"] == "accept"
    assert r4["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r4["context"]["pending_confirmation"] is None
    assert r4["category"] == "ASK_MODEL"
    ctx = r4["context"]

    # Turn 5: "2018 civic"
    r5 = chat("2018 civic", context=ctx)
    assert r5["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r5["context"]["vehicle"]["model"] == "Civic"
    assert r5["context"]["vehicle"]["year"] == 2018
    assert r5["category"] == "ASK_PART"
    ctx = r5["context"]

    # Turn 6: "front bumper"
    r6 = chat("front bumper", context=ctx)
    assert r6["context"]["part"] == "front bumper"
    assert r6["category"] in ("FOUND", "PART_SEARCH")
    ctx = r6["context"]

    # Turn 7: "left side"
    r7 = chat("left side", context=ctx)
    assert r7["context"]["details"].get("side") == "left"
    assert r7["context"]["part"] == "front bumper"
    assert r7["context"]["vehicle"]["model"] == "Civic"
    assert r7["category"] in ("FOUND", "PART_SEARCH")
    ctx = r7["context"]

    # Turn 8: "black"
    r8 = chat("black", context=ctx)
    assert r8["context"]["details"].get("color") == "black"
    assert r8["context"]["details"].get("side") == "left"
    assert r8["context"]["part"] == "front bumper"
    assert r8["category"] in ("FOUND", "PART_SEARCH")
    ctx = r8["context"]

    # Turn 9: "thanks"
    r9 = chat("thanks", context=ctx)
    assert r9["category"] == "THANKS"
    assert r9["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r9["context"]["vehicle"]["model"] == "Civic"
    assert r9["context"]["part"] == "front bumper"
    ctx = r9["context"]

    # Turn 10: "bye"
    r10 = chat("bye", context=ctx)
    assert r10["category"] == "GOODBYE"
    assert r10["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r10["context"]["vehicle"]["model"] == "Civic"
    assert r10["context"]["part"] == "front bumper"


def test_rejection_flow():
    """User rejects a pending confirmation."""
    ctx = create_context()
    # Step 1: trigger confirmation
    r1 = chat("I need a henda", context=ctx)
    assert r1["action"] == "confirm"
    assert r1["context"]["pending_confirmation"] is not None

    # Step 2: reject
    r2 = chat("no", context=r1["context"])
    assert r2["action"] in ("request_input", "reject")
    assert r2["context"]["pending_confirmation"] is None
    assert r2["context"]["vehicle"]["manufacturer"] is None


def test_correction_flow():
    """User changes confirmed value to a new one."""
    ctx = create_context()
    r1 = chat("2018 Honda Civic bumper", context=ctx)
    assert r1["context"]["vehicle"]["manufacturer"] == "Honda"

    r2 = chat("Actually Toyota", context=r1["context"])
    assert r2["context"]["vehicle"]["manufacturer"] == "Toyota"
    assert r2["context"]["vehicle"]["model"] is None
    assert r2["context"]["vehicle"]["year"] == 2018
    assert r2["context"]["part"] == "bumper"
    assert r2["category"] == "ASK_MODEL"


def test_empty_or_whitespace_message():
    """Empty or whitespace message shouldn't crash."""
    res = chat("")
    assert res["reply"] != ""
    assert res["action"] in ("none", "reject", "accept", "request_input")

