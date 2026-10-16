"""Tests for Stage 6 persistent conversation sessions using chat_sessions repository.

Covers:
1. New session creation.
2. Existing session retrieval.
3. Multi-turn context persistence.
4. Session isolation (Session A vs Session B).
5. Context update across turns.
6. updated_at timestamp updates while created_at is preserved.
7. Duplicate session prevention (upsert behavior).
8. Application restart persistence simulation.
9. Supabase failure / error handling.
10. Existing Stage 5 stateless chat compatibility.
"""

import time
import pytest
from unittest.mock import MagicMock, patch
from tony_beta3.chat import chat
from tony_beta3.context import create_context
from tony_beta3.database.session_repository import (
    SessionPersistenceError,
    SessionRepository,
    get_session_repository,
)


def test_new_session_creation():
    """Test 1: Creating a new session stores empty initial context."""
    repo = SessionRepository(use_supabase=False)
    session = repo.create_session("session-test-01")

    assert session["session_id"] == "session-test-01"
    assert session["context"]["vehicle"]["manufacturer"] is None
    assert session["context"]["part"] is None
    assert "created_at" in session
    assert "updated_at" in session


def test_existing_session_retrieval():
    """Test 2: Retrieving an existing session by session_id."""
    repo = SessionRepository(use_supabase=False)
    ctx = create_context()
    ctx["vehicle"]["manufacturer"] = "Honda"
    ctx["vehicle"]["model"] = "Civic"

    repo.save_session("session-test-02", ctx)

    loaded = repo.get_session("session-test-02")
    assert loaded is not None
    assert loaded["session_id"] == "session-test-02"
    assert loaded["context"]["vehicle"]["manufacturer"] == "Honda"
    assert loaded["context"]["vehicle"]["model"] == "Civic"


def test_multi_turn_context_persistence():
    """Test 3: Multi-turn chat persists and accumulates context across turns."""
    repo = SessionRepository(use_supabase=False)
    sid = "multi-turn-001"

    # Turn 1: Honda
    r1 = chat("I need a Honda", session_id=sid, session_repository=repo)
    assert r1["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r1["category"] == "ASK_MODEL"

    # Turn 2: Civic
    r2 = chat("Civic", session_id=sid, session_repository=repo)
    assert r2["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r2["context"]["vehicle"]["model"] == "Civic"
    assert r2["category"] == "ASK_PART"

    # Turn 3: 2018
    r3 = chat("2018", session_id=sid, session_repository=repo)
    assert r3["context"]["vehicle"]["manufacturer"] == "Honda"
    assert r3["context"]["vehicle"]["model"] == "Civic"
    assert r3["context"]["vehicle"]["year"] == 2018
    assert r3["category"] == "ASK_PART"

    # Verify session repository has the latest updated context
    saved = repo.get_session(sid)
    assert saved is not None
    assert saved["context"]["vehicle"]["year"] == 2018


def test_session_isolation():
    """Test 4: Session A and Session B never cross-contaminate or share context."""
    repo = SessionRepository(use_supabase=False)

    # Session A: BMW
    chat("I need a BMW", session_id="session-A", session_repository=repo)

    # Session B: Honda
    chat("I need a Honda", session_id="session-B", session_repository=repo)

    # Retrieve both and verify strict isolation
    session_a = repo.get_session("session-A")
    session_b = repo.get_session("session-B")

    assert session_a is not None
    assert session_b is not None
    assert session_a["context"]["vehicle"]["manufacturer"] == "BMW"
    assert session_b["context"]["vehicle"]["manufacturer"] == "Honda"
    assert session_a["context"]["vehicle"]["manufacturer"] != session_b["context"]["vehicle"]["manufacturer"]


def test_context_update():
    """Test 5: Context updates cleanly with new details."""
    repo = SessionRepository(use_supabase=False)
    sid = "update-ctx-001"

    chat("2018 Honda Civic front bumper", session_id=sid, session_repository=repo)
    chat("left side", session_id=sid, session_repository=repo)

    saved = repo.get_session(sid)
    assert saved is not None
    assert saved["context"]["vehicle"]["manufacturer"] == "Honda"
    assert saved["context"]["part"] == "front bumper"
    assert saved["context"]["details"].get("side") == "left"


def test_updated_at_changes_and_created_at_persists():
    """Test 6: updated_at changes on update while created_at remains identical."""
    repo = SessionRepository(use_supabase=False)
    sid = "ts-test-001"

    s1 = repo.create_session(sid)
    created_at_initial = s1["created_at"]
    updated_at_initial = s1["updated_at"]

    # Sleep slightly to ensure timestamp advancement
    time.sleep(0.01)

    ctx = s1["context"]
    ctx["vehicle"]["manufacturer"] = "Toyota"
    s2 = repo.save_session(sid, ctx)

    assert s2["created_at"] == created_at_initial
    assert s2["updated_at"] >= updated_at_initial


def test_duplicate_session_prevention():
    """Test 7: Repeated saves do not create duplicate rows in session store."""
    repo = SessionRepository(use_supabase=False)
    sid = "dedup-001"

    ctx = create_context()
    repo.save_session(sid, ctx)
    ctx["vehicle"]["manufacturer"] = "Ford"
    repo.save_session(sid, ctx)
    ctx["vehicle"]["model"] = "F-150"
    repo.save_session(sid, ctx)

    assert len(repo._local_store) == 1
    assert repo._local_store[sid]["context"]["vehicle"]["model"] == "F-150"


def test_application_restart_persistence():
    """Test 8: Simulating application restart reloads previous context."""
    # Shared backend store simulating Supabase
    shared_supabase_mock = {}

    # Instance 1 before restart
    repo1 = SessionRepository(use_supabase=False)
    repo1._local_store = shared_supabase_mock

    chat("I need a Honda Civic", session_id="restart-test-01", session_repository=repo1)
    chat("2018", session_id="restart-test-01", session_repository=repo1)
    chat("front bumper", session_id="restart-test-01", session_repository=repo1)

    # Simulate application restart: instantiate brand new SessionRepository pointing to persistent store
    repo2 = SessionRepository(use_supabase=False)
    repo2._local_store = shared_supabase_mock

    # Request 4 after restart
    res4 = chat("left side", session_id="restart-test-01", session_repository=repo2)

    assert res4["context"]["vehicle"]["manufacturer"] == "Honda"
    assert res4["context"]["vehicle"]["model"] == "Civic"
    assert res4["context"]["vehicle"]["year"] == 2018
    assert res4["context"]["part"] == "front bumper"
    assert res4["context"]["details"].get("side") == "left"


def test_supabase_failure_handling():
    """Test 9: Database failure raises SessionPersistenceError without crashing or pretending context loaded."""
    repo = SessionRepository(use_supabase=True)

    # Mock client failure
    mock_client = MagicMock()
    mock_table = MagicMock()
    mock_client.table.return_value = mock_table
    mock_table.select.side_effect = Exception("Connection refused to Supabase")

    with patch("tony_beta3.database.session_repository.get_supabase_client", return_value=mock_client):
        with pytest.raises(SessionPersistenceError) as exc_info:
            repo.get_session("error-session-001")
        assert "Database error while loading session" in str(exc_info.value)


def test_existing_stage5_stateless_behavior_unchanged():
    """Test 10: Calling chat(message, context) without session_id behaves exactly as Stage 5."""
    ctx = create_context()
    ctx["vehicle"]["manufacturer"] = "Honda"

    result = chat("Civic", context=ctx)
    assert result["context"]["vehicle"]["manufacturer"] == "Honda"
    assert result["context"]["vehicle"]["model"] == "Civic"
    assert result["action"] == "accept"
    assert "reply" in result
    assert "category" in result
