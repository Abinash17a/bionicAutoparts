"""Session repository for Supabase chat_sessions table.

Manages persistent conversation states across multi-turn chat sessions.
Encapsulates all Supabase queries for the chat_sessions table:
- id: row identifier
- session_id: unique session key
- context_json: conversation context state (JSONB / JSON dict / text)
- created_at: ISO timestamp of session creation
- updated_at: ISO timestamp of last context update
"""

import json
import logging
from datetime import datetime, timezone
from typing import Any, TypedDict
from tony_beta3.database.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)


def _create_initial_context() -> dict[str, Any]:
    return {
        "vehicle": {
            "manufacturer": None,
            "model": None,
            "year": None,
        },
        "part": None,
        "details": {},
        "pending_confirmation": None,
    }


class SessionRecord(TypedDict):
    id: str | int | None
    session_id: str
    context: dict[str, Any]
    created_at: str
    updated_at: str


class SessionPersistenceError(Exception):
    """Raised when loading or saving a chat session fails."""
    pass


class SessionRepository:
    """Repository handling CRUD operations for chat_sessions table.

    Uses live Supabase client if configured, otherwise falls back to
    an isolated in-memory persistent store for offline/local environments.
    """

    def __init__(self, use_supabase: bool = True) -> None:
        self.use_supabase = use_supabase
        # In-memory storage dictionary: session_id -> SessionRecord
        self._local_store: dict[str, dict[str, Any]] = {}

    def _get_utc_now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def get_session(self, session_id: str) -> SessionRecord | None:
        """Load session record from Supabase chat_sessions table by session_id.

        Args:
            session_id: Unique session identifier string.

        Returns:
            SessionRecord dict containing parsed context, or None if not found.

        Raises:
            SessionPersistenceError: If Supabase query fails unexpectedly.
        """
        if not session_id or not isinstance(session_id, str) or not session_id.strip():
            raise ValueError("session_id must be a non-empty string.")

        clean_session_id = session_id.strip()
        client = get_supabase_client() if self.use_supabase else None

        if client is not None:
            try:
                res = (
                    client.table("chat_sessions")
                    .select("id, session_id, context_json, created_at, updated_at")
                    .eq("session_id", clean_session_id)
                    .limit(1)
                    .execute()
                )
                if res.data and len(res.data) > 0:
                    row = res.data[0]
                    ctx_raw = row.get("context_json")
                    if isinstance(ctx_raw, str):
                        ctx = json.loads(ctx_raw)
                    elif isinstance(ctx_raw, dict):
                        ctx = ctx_raw
                    else:
                        ctx = _create_initial_context()

                    return {
                        "id": row.get("id"),
                        "session_id": clean_session_id,
                        "context": ctx,
                        "created_at": row.get("created_at", self._get_utc_now()),
                        "updated_at": row.get("updated_at", self._get_utc_now()),
                    }
                return None
            except Exception as e:
                logger.error(f"Failed to load session '{clean_session_id}' from Supabase: {e}")
                raise SessionPersistenceError(f"Database error while loading session: {clean_session_id}") from e

        # Fallback to local store
        if clean_session_id in self._local_store:
            record = self._local_store[clean_session_id]
            # Deepcopy context to prevent in-place memory leaks across turns
            return {
                "id": record["id"],
                "session_id": clean_session_id,
                "context": json.loads(json.dumps(record["context"])),
                "created_at": record["created_at"],
                "updated_at": record["updated_at"],
            }
        return None

    def create_session(
        self, session_id: str, context: dict[str, Any] | None = None
    ) -> SessionRecord:
        """Create a new chat session record.

        Args:
            session_id: Unique session identifier string.
            context: Initial context dict (defaults to empty context).

        Returns:
            Created SessionRecord.

        Raises:
            SessionPersistenceError: If session creation fails.
        """
        if not session_id or not isinstance(session_id, str) or not session_id.strip():
            raise ValueError("session_id must be a non-empty string.")

        clean_session_id = session_id.strip()
        ctx = dict(context) if context else _create_initial_context()
        now_ts = self._get_utc_now()
        client = get_supabase_client() if self.use_supabase else None

        if client is not None:
            try:
                row_data = {
                    "session_id": clean_session_id,
                    "context_json": ctx,
                    "created_at": now_ts,
                    "updated_at": now_ts,
                }
                res = client.table("chat_sessions").insert(row_data).execute()
                new_id = res.data[0]["id"] if (res.data and "id" in res.data[0]) else clean_session_id
                return {
                    "id": new_id,
                    "session_id": clean_session_id,
                    "context": ctx,
                    "created_at": now_ts,
                    "updated_at": now_ts,
                }
            except Exception as e:
                logger.error(f"Failed to create session '{clean_session_id}' in Supabase: {e}")
                raise SessionPersistenceError(f"Database error while creating session: {clean_session_id}") from e

        # Local store
        self._local_store[clean_session_id] = {
            "id": f"local-{clean_session_id}",
            "session_id": clean_session_id,
            "context": json.loads(json.dumps(ctx)),
            "created_at": now_ts,
            "updated_at": now_ts,
        }
        return {
            "id": f"local-{clean_session_id}",
            "session_id": clean_session_id,
            "context": ctx,
            "created_at": now_ts,
            "updated_at": now_ts,
        }

    def save_session(
        self, session_id: str, context: dict[str, Any]
    ) -> SessionRecord:
        """Save/upsert session context to Supabase chat_sessions.

        If session exists: updates context_json and updated_at (preserves created_at).
        If session does not exist: inserts new session record.

        Args:
            session_id: Unique session identifier string.
            context: Updated context dictionary to persist.

        Returns:
            Updated SessionRecord.

        Raises:
            SessionPersistenceError: If save fails.
        """
        if not session_id or not isinstance(session_id, str) or not session_id.strip():
            raise ValueError("session_id must be a non-empty string.")

        clean_session_id = session_id.strip()
        ctx = dict(context)
        now_ts = self._get_utc_now()
        client = get_supabase_client() if self.use_supabase else None

        if client is not None:
            try:
                # Check if session exists to determine update vs insert
                existing = self.get_session(clean_session_id)
                if existing:
                    # Update existing record
                    res = (
                        client.table("chat_sessions")
                        .update({"context_json": ctx, "updated_at": now_ts})
                        .eq("session_id", clean_session_id)
                        .execute()
                    )
                    updated_row = res.data[0] if (res.data and len(res.data) > 0) else {}
                    return {
                        "id": updated_row.get("id", existing["id"]),
                        "session_id": clean_session_id,
                        "context": ctx,
                        "created_at": existing["created_at"],
                        "updated_at": now_ts,
                    }
                else:
                    # Insert new record
                    row_data = {
                        "session_id": clean_session_id,
                        "context_json": ctx,
                        "created_at": now_ts,
                        "updated_at": now_ts,
                    }
                    res = client.table("chat_sessions").insert(row_data).execute()
                    new_id = res.data[0]["id"] if (res.data and "id" in res.data[0]) else clean_session_id
                    return {
                        "id": new_id,
                        "session_id": clean_session_id,
                        "context": ctx,
                        "created_at": now_ts,
                        "updated_at": now_ts,
                    }
            except SessionPersistenceError:
                raise
            except Exception as e:
                logger.error(f"Failed to save session '{clean_session_id}' in Supabase: {e}")
                raise SessionPersistenceError(f"Database error while saving session: {clean_session_id}") from e

        # Local store upsert
        if clean_session_id in self._local_store:
            existing = self._local_store[clean_session_id]
            existing["context"] = json.loads(json.dumps(ctx))
            existing["updated_at"] = now_ts
            return {
                "id": existing["id"],
                "session_id": clean_session_id,
                "context": ctx,
                "created_at": existing["created_at"],
                "updated_at": now_ts,
            }
        else:
            new_record = {
                "id": f"local-{clean_session_id}",
                "session_id": clean_session_id,
                "context": json.loads(json.dumps(ctx)),
                "created_at": now_ts,
                "updated_at": now_ts,
            }
            self._local_store[clean_session_id] = new_record
            return {
                "id": new_record["id"],
                "session_id": clean_session_id,
                "context": ctx,
                "created_at": now_ts,
                "updated_at": now_ts,
            }

    def delete_session(self, session_id: str) -> bool:
        """Delete session by session_id.

        Args:
            session_id: Unique session identifier string.

        Returns:
            True if deleted, False if not found.
        """
        if not session_id or not isinstance(session_id, str):
            return False

        clean_session_id = session_id.strip()
        client = get_supabase_client() if self.use_supabase else None

        if client is not None:
            try:
                res = client.table("chat_sessions").delete().eq("session_id", clean_session_id).execute()
                return bool(res.data)
            except Exception as e:
                logger.error(f"Failed to delete session '{clean_session_id}' from Supabase: {e}")
                raise SessionPersistenceError(f"Database error while deleting session: {clean_session_id}") from e

        return self._local_store.pop(clean_session_id, None) is not None


_session_repository_instance: SessionRepository | None = None


def get_session_repository() -> SessionRepository:
    """Return singleton instance of SessionRepository."""
    global _session_repository_instance
    if _session_repository_instance is None:
        _session_repository_instance = SessionRepository()
    return _session_repository_instance
