"""Minimal FastAPI endpoint for Tony Beta 3 chatbot API with persistent sessions."""

import logging
from typing import Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from tony_beta3.chat import chat as chat_orchestrator
from tony_beta3.confirmation import evaluate_confirmation
from tony_beta3.context import create_context, update_context
from tony_beta3.database.session_repository import SessionPersistenceError, get_session_repository
from tony_beta3.detector import detect_entities
from tony_beta3.response import generate_response

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Tony Beta 3 - Auto-Parts Chatbot API",
    description="Deterministic automotive entity detection, confirmation, context, response generation, and persistent sessions",
    version="0.6.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DetectionRequest(BaseModel):
    message: str = Field(..., description="Raw user message text", json_schema_extra={"example": "I need a front bumper for a 2018 Honda Civic"})


class ConfirmationRequest(BaseModel):
    message: str = Field(..., description="User message text or reply (e.g. 'yes', 'no', 'I need a henda Civic')")
    state: dict[str, Any] | None = Field(default=None, description="Current confirmation state containing pending_confirmation and confirmed_entities")


class ContextRequest(BaseModel):
    message: str = Field(..., description="User message text", json_schema_extra={"example": "2018"})
    context: dict[str, Any] | None = Field(default=None, description="Existing conversation context dictionary")


class ChatRequest(BaseModel):
    session_id: str | None = Field(default=None, description="Unique conversation session identifier for Supabase persistence", json_schema_extra={"example": "abc123"})
    message: str = Field(..., description="User message text", json_schema_extra={"example": "I need a 2018 Honda Civic front bumper"})
    context: dict[str, Any] | None = Field(default=None, description="Optional explicit conversation context dictionary (for stateless callers)")
    session_state: dict[str, Any] | None = Field(default=None, description="Legacy alias for context from web clients")


class ResetRequest(BaseModel):
    session_id: str = Field(..., description="Session ID to reset")


class DetectionResponse(BaseModel):
    original_text: str
    normalized_text: str
    entities: dict[str, Any]
    confidence: dict[str, float]


class ConfirmationResponse(BaseModel):
    action: str
    field: str | None = None
    candidate: Any = None
    confidence: float = 0.0
    state: dict[str, Any]


class VehicleContextModel(BaseModel):
    manufacturer: str | None = None
    model: str | None = None
    year: int | None = None


class ContextResponse(BaseModel):
    vehicle: VehicleContextModel
    part: str | None = None
    details: dict[str, str] = Field(default_factory=dict)
    pending_confirmation: dict[str, Any] | None = None


class ChatResponse(BaseModel):
    status: str = "success"
    session_id: str | None = None
    reply: str
    context: ContextResponse
    extracted_data: dict[str, Any] | None = None
    action: str
    category: str


class SessionRecordResponse(BaseModel):
    session_id: str
    context: ContextResponse
    created_at: str
    updated_at: str


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "tony_beta3"}


@app.post("/detect", response_model=DetectionResponse)
def detect(req: DetectionRequest):
    """Detect automotive entities from user message (Stage 1)."""
    try:
        result = detect_entities(req.message)
        return result
    except Exception as e:
        logger.error(f"Detection endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Entity detection failed.")


@app.post("/extract")
def extract(req: DetectionRequest):
    """Alias for /detect for legacy web clients."""
    return detect(req)


@app.post("/confirm", response_model=ConfirmationResponse)
def confirm(req: ConfirmationRequest):
    """Evaluate confidence decisions, confirmations, and rejections (Stage 2)."""
    try:
        result = evaluate_confirmation(req.message, current_state=req.state)
        return result
    except Exception as e:
        logger.error(f"Confirmation endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Confirmation evaluation failed.")


@app.post("/context", response_model=ContextResponse)
def handle_context(req: ContextRequest):
    """Update conversation context across messages (Stage 3)."""
    try:
        updated = update_context(req.context, user_message=req.message)
        return updated
    except Exception as e:
        logger.error(f"Context update endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Context update failed.")


@app.post("/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    """End-to-end multi-turn chat pipeline with Supabase session persistence (Stages 5 & 6)."""
    if req.session_id is not None and not req.session_id.strip():
        raise HTTPException(status_code=400, detail="session_id cannot be an empty string.")

    try:
        incoming_context = req.context if req.context is not None else req.session_state
        chat_output = chat_orchestrator(
            req.message,
            context=incoming_context,
            session_id=req.session_id.strip() if req.session_id else None,
        )
        
        ctx = chat_output.get("context", {})
        veh = ctx.get("vehicle", {}) if isinstance(ctx, dict) else {}
        extracted_data = {
            "vehicle": {
                "make": veh.get("manufacturer"),
                "manufacturer": veh.get("manufacturer"),
                "model": veh.get("model"),
                "year": veh.get("year"),
            },
            "part": ctx.get("part") if isinstance(ctx, dict) else None,
            "details": ctx.get("details", {}) if isinstance(ctx, dict) else {},
            "pending_confirmation": ctx.get("pending_confirmation") if isinstance(ctx, dict) else None,
        }

        return {
            "status": "success",
            "session_id": chat_output.get("session_id"),
            "reply": chat_output.get("reply", ""),
            "context": ctx,
            "extracted_data": extracted_data,
            "action": chat_output.get("action", "none"),
            "category": chat_output.get("category", "NOT_FOUND"),
        }
    except SessionPersistenceError as e:
        logger.error(f"Session persistence error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Session storage is temporarily unavailable.",
        )
    except Exception as e:
        logger.error(f"Chat processing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat message.")


@app.post("/reset-session")
def reset_session(req: ResetRequest):
    """Reset / clear stored session context for web clients."""
    clean_id = req.session_id.strip() if req.session_id else ""
    if not clean_id:
        raise HTTPException(status_code=400, detail="Invalid session_id.")

    session_repo = get_session_repository()
    try:
        deleted = session_repo.delete_session(clean_id)
        return {"reset": True, "session_id": clean_id, "deleted": deleted}
    except SessionPersistenceError as e:
        logger.error(f"Failed to reset session {clean_id}: {e}")
        raise HTTPException(status_code=503, detail="Session storage is unavailable.")


@app.get("/sessions/{session_id}", response_model=SessionRecordResponse)
def get_session(session_id: str):
    """Fetch stored conversation session by session_id."""
    clean_id = session_id.strip()
    if not clean_id:
        raise HTTPException(status_code=400, detail="Invalid session_id.")

    session_repo = get_session_repository()
    try:
        record = session_repo.get_session(clean_id)
        if record is None:
            raise HTTPException(status_code=404, detail=f"Session '{clean_id}' not found.")
        return record
    except SessionPersistenceError as e:
        logger.error(f"Failed to fetch session {clean_id}: {e}")
        raise HTTPException(status_code=503, detail="Session storage is unavailable.")


@app.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    """Delete conversation session by session_id."""
    clean_id = session_id.strip()
    if not clean_id:
        raise HTTPException(status_code=400, detail="Invalid session_id.")

    session_repo = get_session_repository()
    try:
        deleted = session_repo.delete_session(clean_id)
        return {"session_id": clean_id, "deleted": deleted}
    except SessionPersistenceError as e:
        logger.error(f"Failed to delete session {clean_id}: {e}")
        raise HTTPException(status_code=503, detail="Session storage is unavailable.")
