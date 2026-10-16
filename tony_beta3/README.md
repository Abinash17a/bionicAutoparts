---
title: Tony Auto Parts Assistant
emoji: 🚗
colorFrom: blue
colorTo: gray
sdk: gradio
sdk_version: 5.50.0
app_file: app.py
pinned: false
license: mit
---

# Tony Beta 3 - Auto-Parts Chatbot Core

Deterministic automotive entity detection, confidence-based confirmation, cumulative conversation context manager, Supabase template-driven response generation engine, unified multi-turn chat orchestrator, persistent conversation sessions, and Gradio Web UI.

## Architecture

```
USER MESSAGE + [SESSION_ID]
    ↓
STAGE 6: LOAD SESSION (tony_beta3/database/session_repository.py)
└── Supabase `chat_sessions` table (context_json, created_at, updated_at)
    ↓
STAGE 1: NORMALIZE & DETECT (tony_beta3/detector.py)
├── Deterministic Year Detector (1990 - 2026 validation)
├── Details Detector (side, position, color)
└── Supabase Data Repository (tony_beta3/database/repository.py)
    ├── manufacturers (Exact & fast Levenshtein matching)
    ├── models (Scoped to manufacturer_id when detected; global fallback)
    └── parts & part_synonyms (Canonical part resolution)
    ↓
STAGE 2: CONFIRMATION & CORRECTION (tony_beta3/confirmation.py)
├── HIGH (>= 0.90): Auto-accept
├── MEDIUM (0.75 - 0.89): Require confirmation (action="confirm")
├── LOW (< 0.75): Reject / request input
├── Affirmative reply ('yes', 'correct') -> Accepts candidate
└── Negative reply ('no', 'wrong') -> Rejects candidate
    ↓
STAGE 3: CONTEXT & STATE MANAGER (tony_beta3/context.py)
├── Non-destructive additive merging
├── Field correction without erasing unrelated data
├── Multi-key details merging (side, position, color)
└── Context preservation on greetings & noise
    ↓
STAGE 4: DETERMINISTIC RESPONSE ENGINE (tony_beta3/response.py)
├── Determine response category (GREETING, CONFIRM, ASK_MODEL, ASK_YEAR, ASK_PART, FOUND, etc.)
├── Fetch matching templates from Supabase response_templates
├── Choose random template (or seeded for determinism)
└── Fill context variables ({vehicle}, {year}, {manufacturer}, {model}, {part}, {side}, {position}, {color})
    ↓
STAGE 5: FINAL CHAT ORCHESTRATION (tony_beta3/chat.py)
└── Unified `chat(message, context, session_id)` pipeline
    ↓
STAGE 6: SAVE SESSION (tony_beta3/database/session_repository.py)
└── Persist updated context to Supabase `chat_sessions` (upsert + updated_at timestamp)
    ↓
FINAL RESPONSE:
{
  "session_id": "abc123",
  "reply": "...",
  "context": {...},
  "action": "...",
  "category": "..."
}
```

## Running Locally

### 1. Run Complete Test Suite (88 Tests)
```bash
python -m pytest -v
```

### 2. Launch Gradio Web UI / Hugging Face Space
```bash
python app.py
```
Or with custom host and port:
```bash
HOST=0.0.0.0 PORT=7860 python app.py
```

### 3. Single Message Execution Modes
```bash
# Stage 6 Persistent Chat Pipeline
python -m tony_beta3.main "I need a 2018 Honda Civic front bumper" --session my-session-123

# Stage 5 Unified Chat Pipeline (Stateless)
python -m tony_beta3.main "I need a 2018 Honda Civic front bumper"

# Stage 2 Confirmation Evaluation
python -m tony_beta3.main --confirm "I need a henda Civic"

# Stage 3 Context Update
python -m tony_beta3.main --context "2018"

# Stage 4 Template Reply Generation
python -m tony_beta3.main --reply "I need a 2018 Honda Civic front bumper"
```

### 4. Interactive REPL Chatbot
```bash
python -m tony_beta3.main --session interactive-01
```

### 5. Run Benchmarks & Verifications
```bash
python benchmark.py         # Stage 1 Detector Latency (~3.7 ms)
python benchmark_stage2.py  # Stage 2 Confirmation Latency (~1.7 ms)
python benchmark_stage3.py  # Stage 3 Context Update Latency (~0.9 ms)
python benchmark_stage4.py  # Stage 4 Response Latency (~0.04 ms)
python benchmark_stage5.py  # Stage 5 End-to-End Chat Latency (~0.78 ms)
python benchmark_stage6.py  # Stage 6 Persistent Sessions Latency (~3.9 ms)
python verify_ui.py         # Gradio UI Multi-Turn & Confirmation Flow Verification
```

### 6. Start FastAPI Server
```bash
python -m tony_beta3.main --server --port 8000
```
- `POST /detect` -> Stage 1 Entity Extraction
- `POST /confirm` -> Stage 2 Confirmation Decision
- `POST /context` -> Stage 3 Conversation State Update
- `POST /chat` -> Stage 6 End-to-End Multi-Turn Chat (with persistent `session_id`)
- `GET /sessions/{session_id}` -> Retrieve Session Context
- `DELETE /sessions/{session_id}` -> Delete Session



