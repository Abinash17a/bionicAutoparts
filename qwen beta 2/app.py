import os
import json
import gradio as gr
from pydantic import BaseModel, Field
try:
    import torch
except ImportError:
    torch = None
from extractor import extract_info, is_model_loaded, load_model, MODEL_NAME

SESSION_CACHE = {}

class ChatRequest(BaseModel):
    message: str = Field(..., description="Customer inquiry or message", example="Hi, looking for front brake pads for a 2018 Toyota Camry")
    session_id: str | None = Field(default=None, description="Optional session ID")
    session_state: dict | None = Field(default=None, description="Optional session state dictionary")

class ResetRequest(BaseModel):
    session_id: str = Field(..., description="Session ID to reset")

def merge_session_state(existing: dict, new_data: dict) -> dict:
    if not existing:
        existing = {
            "customer": {"name": None, "phone": None, "email": None, "zip": None},
            "vehicle": {"year": None, "make": None, "model": None},
            "part": None,
            "details": {},
            "intent": "parts_request",
            "missing_fields": ["part", "year", "make", "model"],
            "status": "in_progress"
        }

    merged = dict(existing)
    
    # Merge customer info
    existing_cust = merged.get("customer") or {}
    new_cust = new_data.get("customer") or {}
    merged["customer"] = {
        "name": new_cust.get("name") or existing_cust.get("name"),
        "phone": new_cust.get("phone") or existing_cust.get("phone"),
        "email": new_cust.get("email") or existing_cust.get("email"),
        "zip": new_cust.get("zip") or existing_cust.get("zip")
    }

    # Merge vehicle info
    existing_veh = merged.get("vehicle") or {}
    new_veh = new_data.get("vehicle") or {}
    
    # Enforce taxonomy: never classify model as make
    make_val = new_veh.get("make") or existing_veh.get("make")
    model_val = new_veh.get("model") or existing_veh.get("model")

    merged["vehicle"] = {
        "year": new_veh.get("year") or existing_veh.get("year"),
        "make": make_val,
        "model": model_val
    }

    # Merge part
    merged["part"] = new_data.get("part") or merged.get("part")

    # Merge details
    existing_det = merged.get("details") or {}
    new_det = new_data.get("details") or {}
    if isinstance(existing_det, dict) and isinstance(new_det, dict):
        merged["details"] = {**existing_det, **new_det}

    # Intent
    if new_data.get("intent") and new_data.get("intent") != "unknown":
        merged["intent"] = new_data.get("intent")

    # Compute missing fields
    missing = []
    if not merged["part"]:
        missing.append("part")
    if not merged["vehicle"]["year"]:
        missing.append("year")
    if not merged["vehicle"]["make"]:
        missing.append("make")
    if not merged["vehicle"]["model"]:
        missing.append("model")

    merged["missing_fields"] = missing
    merged["status"] = "complete" if len(missing) == 0 else "in_progress"
    return merged

def format_reply(data: dict, user_message: str) -> str:
    if data and data.get("reply") and isinstance(data.get("reply"), str) and len(data.get("reply").strip()) > 5:
        return data["reply"].strip()

    if not data:
        return f"I received your message: '{user_message}'. Could you please share what vehicle part you are looking for?"

    customer_name = data.get("customer", {}).get("name") if isinstance(data.get("customer"), dict) else None
    greeting = f"Hi {customer_name}! " if customer_name else ""

    missing = data.get("missing_fields", [])
    part = data.get("part")
    vehicle = data.get("vehicle", {}) or {}
    year = vehicle.get("year")
    make = vehicle.get("make")
    model_name = vehicle.get("model")

    vehicle_parts = [str(year) if year else None, make, model_name]
    vehicle_str = " ".join([p for p in vehicle_parts if p]).strip()

    if not missing or len(missing) == 0:
        return f"{greeting}Thank you! We have logged your request for a {vehicle_str} {part}. Our team will check availability and pricing and reach out to you shortly."

    # Ask for next relevant missing field progressively
    next_missing = missing[0]
    if next_missing == "part":
        return f"{greeting}Welcome to Bionic Auto Parts! What specific part are you looking to source for your vehicle?"
    elif next_missing == "year":
        if part:
            return f"{greeting}What year is your vehicle for the {part}?"
        return f"{greeting}Could you please tell me the model year of your vehicle?"
    elif next_missing == "make":
        if year:
            return f"{greeting}Got it! What is the make (manufacturer like Toyota, Ford, Honda) of your {year} vehicle?"
        return f"{greeting}What is the make (manufacturer) of your vehicle?"
    elif next_missing == "model":
        if year and make:
            return f"{greeting}What model (e.g. Camry, Civic, F-150) is your {year} {make}?"
        elif make:
            return f"{greeting}What model is your {make}?"
        return f"{greeting}What is the vehicle model?"

    return f"{greeting}Could you please share your vehicle details so our team can check availability and pricing?"

def gradio_chat_fn(user_message):
    if not user_message or not user_message.strip():
        return "", "{}"
    res = extract_info(user_message)
    data = res.get("data", {}) if res.get("status") == "success" else {}
    reply = format_reply(data, user_message)
    return reply, json.dumps(data if data else res, indent=2)

# Build Gradio Interface
with gr.Blocks(title="Auto Parts AI Bot", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🚗 Auto Parts AI Extraction Bot & API")
    gr.Markdown("Extracts structured vehicle specifications and part requirements using **Qwen2.5-1.5B-Instruct**.")

    with gr.Row():
        with gr.Column(scale=1):
            msg_input = gr.Textbox(
                label="Customer Message",
                placeholder="e.g. Hi, looking for front brake pads for a 2018 Toyota Camry",
                lines=3
            )
            gr.Examples(
                examples=[
                    ["Hi, looking for front brake pads for a 2018 Toyota Camry"],
                    ["Do you have an alternator for a 2015 Ford F-150?"],
                    ["Do you guys ship to California?"],
                    ["Need a black rear bumper for a Honda Civic 2020"],
                    ["What are your store hours on Sundays?"]
                ],
                inputs=msg_input
            )
            submit_btn = gr.Button("Extract & Respond", variant="primary")

        with gr.Column(scale=1):
            reply_output = gr.Textbox(label="Bot Conversational Response", lines=3)
            json_output = gr.Code(label="Extracted Structured JSON", language="json")

    submit_btn.click(
        fn=gradio_chat_fn,
        inputs=[msg_input],
        outputs=[reply_output, json_output]
    )

    gr.Markdown("""
    ---
    ### 📡 REST API Endpoints:
    - **`POST /chat`**: Send `{"message": "..."}` to receive structured extraction + reply.
    - **`POST /extract`**: Send `{"message": "..."}` to receive raw JSON data.
    - **`GET /health`**: Health check & device status.
    - **`GET /docs`**: Interactive Swagger OpenAPI docs.
    """)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app instance
app = FastAPI(title="Auto Parts AI Bot", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_endpoint():
    return {
        "status": "healthy",
        "model_name": MODEL_NAME,
        "cuda_available": bool(torch and torch.cuda.is_available()),
        "model_loaded": is_model_loaded()
    }

@app.post("/extract")
def extract_endpoint(req: ChatRequest):
    return extract_info(req.message)

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    s_id = req.session_id
    existing_state = req.session_state or (SESSION_CACHE.get(s_id) if s_id else None)

    res = extract_info(req.message, session_context=existing_state)
    data = res.get("data", {}) if res.get("status") == "success" else {}

    merged_data = merge_session_state(existing_state, data)
    if s_id:
        SESSION_CACHE[s_id] = merged_data

    reply = format_reply(data if (data and data.get("reply")) else merged_data, req.message)
    merged_data["reply"] = reply

    return {
        "status": res.get("status"),
        "inference_time_seconds": res.get("inference_time_seconds"),
        "session_id": s_id,
        "extracted_data": merged_data,
        "reply": reply
    }

@app.post("/reset-session")
def reset_session_endpoint(req: ResetRequest):
    if req.session_id and req.session_id in SESSION_CACHE:
        del SESSION_CACHE[req.session_id]
    return {"reset": True, "session_id": req.session_id}

# Mount Gradio interface onto FastAPI app root
app = gr.mount_gradio_app(app, demo, path="/")

def run_api(host: str = "0.0.0.0", port: int = 7860):
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    run_api(host="0.0.0.0", port=7860)
