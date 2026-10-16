"""Final chatbot orchestration layer for Tony Beta 3 (Stages 5 & 6).

Connects:
USER MESSAGE + [SESSION_ID]
    ↓
Stage 6: Load session from Supabase (if session_id provided)
    ↓
Stage 1: detect_entities()
    ↓
Stage 2: evaluate_confirmation()
    ↓
Stage 3: update_context()
    ↓
Stage 4: generate_response()
    ↓
Stage 6: Save updated session to Supabase (if session_id provided)
    ↓
FINAL RESPONSE
"""

from typing import Any, TypedDict
from tony_beta3.confirmation import evaluate_confirmation
from tony_beta3.context import ConversationContext, create_context, update_context
from tony_beta3.database.repository import CatalogRepository, get_repository
from tony_beta3.database.session_repository import SessionRepository, get_session_repository
from tony_beta3.response import generate_response


class ChatOutput(TypedDict, total=False):
    session_id: str | None
    reply: str
    context: ConversationContext
    action: str
    category: str


def chat(
    message: str | None,
    context: dict[str, Any] | None = None,
    session_id: str | None = None,
    repository: CatalogRepository | None = None,
    session_repository: SessionRepository | None = None,
    seed: int | None = None,
) -> ChatOutput:
    """End-to-end chat orchestration pipeline with optional session persistence.

    Args:
        message: Raw user message string.
        context: Existing conversation context (or None for initial turn).
        session_id: Optional session identifier for persistent multi-turn storage.
        repository: Optional CatalogRepository instance.
        session_repository: Optional SessionRepository instance.
        seed: Optional random seed for deterministic template selection in tests.

    Returns:
        {
          "session_id": "abc123",  # Present if session_id passed
          "reply": "Got it. You're looking for a front bumper for your 2018 Honda Civic.",
          "context": {
            "vehicle": {
              "manufacturer": "Honda",
              "model": "Civic",
              "year": 2018
            },
            "part": "front bumper",
            "details": {},
            "pending_confirmation": null
          },
          "action": "accept",
          "category": "FOUND"
        }
    """
    repo = repository or get_repository()
    raw_msg = "" if message is None else str(message)

    # 1. Resolve Session Context (Stage 6) if session_id is provided
    session_repo: SessionRepository | None = None
    if session_id:
        session_repo = session_repository or get_session_repository()
        session_record = session_repo.get_session(session_id)
        if session_record is not None:
            current_ctx = session_record["context"]
        else:
            current_ctx = dict(context) if context else create_context()
    else:
        current_ctx = dict(context) if context else create_context()

    # 2. Stage 2: Evaluate Confirmation / Rejection / New Detection
    internal_state = {
        "confirmed_entities": {
            "manufacturer": current_ctx.get("vehicle", {}).get("manufacturer"),
            "model": current_ctx.get("vehicle", {}).get("model"),
            "year": current_ctx.get("vehicle", {}).get("year"),
            "part": current_ctx.get("part"),
            "details": dict(current_ctx.get("details", {})),
        },
        "pending_confirmation": current_ctx.get("pending_confirmation"),
    }

    stage2_result = evaluate_confirmation(raw_msg, current_state=internal_state)
    action = stage2_result.get("action", "none")

    # 3. Stage 3: Update Conversation Context
    updated_ctx = update_context(current_ctx, stage2_result=stage2_result)

    # 4. Stage 4: Generate Deterministic Response from Supabase Templates
    response_obj = generate_response(
        context=updated_ctx,
        user_message=raw_msg,
        stage2_result=stage2_result,
        repository=repo,
        seed=seed,
    )

    category = response_obj.get("category", "NOT_FOUND")
    reply = response_obj.get("reply", "")

    # 5. Persist Updated Context to Supabase (Stage 6)
    if session_id and session_repo is not None:
        session_repo.save_session(session_id, updated_ctx)

    result: ChatOutput = {
        "reply": reply,
        "context": updated_ctx,
        "action": action,
        "category": category,
    }

    if session_id is not None:
        result["session_id"] = session_id

    return result
