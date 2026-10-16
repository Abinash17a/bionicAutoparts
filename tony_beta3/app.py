"""Gradio Web UI for Tony Beta 3 Auto-Parts Chatbot.

Deployable directly as a Hugging Face Gradio Space.
Connects browser chat sessions to the deterministic Stage 5/6 chat orchestration pipeline.
"""

import logging
import os
import uuid
import gradio as gr
from tony_beta3.chat import chat
from tony_beta3.database.session_repository import get_session_repository

logger = logging.getLogger(__name__)

# ZeroGPU compatibility for Hugging Face Spaces
try:
    import spaces

    @spaces.GPU
    def _zero_gpu_init():
        return True

    _zero_gpu_init()
except Exception:
    pass


def generate_new_session_id() -> str:
    """Generate a unique session identifier for a new conversation."""
    return f"session-{uuid.uuid4().hex[:12]}"


def restore_session(session_id: str | None) -> tuple[list[dict[str, str]], str]:
    """Restore conversation session on browser page refresh."""
    if not session_id or not isinstance(session_id, str) or not session_id.strip():
        return [], generate_new_session_id()

    sid = session_id.strip()
    session_repo = get_session_repository()
    try:
        record = session_repo.get_session(sid)
        if record is not None:
            ctx = record.get("context", {})
            veh = ctx.get("vehicle", {})
            mfg = veh.get("manufacturer")
            model = veh.get("model")
            year = veh.get("year")
            part = ctx.get("part")
            if mfg or model or year or part:
                v_str = f"{year or ''} {mfg or ''} {model or ''}".strip()
                summary = f"Welcome back! Your current search is active for: {v_str} {part or ''}".strip() + "."
                return [{"role": "assistant", "content": summary}], sid
            return [], sid
    except Exception as e:
        logger.warning(f"Failed to restore session {sid}: {e}")

    return [], sid


def respond(
    message: str,
    chat_history: list[dict[str, str]] | None = None,
    session_id: str | None = None,
) -> tuple[str, list[dict[str, str]], str]:
    """Process user message through Tony Beta 3 deterministic chat pipeline.

    Args:
        message: Raw input text entered by the user.
        chat_history: Existing conversation turns in Gradio messages format.
        session_id: Current unique session identifier.

    Returns:
        tuple: (cleared_input, updated_chat_history, session_id)
    """
    clean_msg = (message or "").strip()
    history = list(chat_history) if chat_history else []
    sid = (
        session_id.strip()
        if (session_id and isinstance(session_id, str) and session_id.strip())
        else generate_new_session_id()
    )

    if not clean_msg:
        return "", history, sid

    # Append user turn to history
    history.append({"role": "user", "content": clean_msg})

    try:
        # Call Stage 5/6 deterministic chat orchestrator
        chat_output = chat(clean_msg, session_id=sid)
        bot_reply = chat_output.get("reply", "")
        if not bot_reply:
            bot_reply = "I couldn't find an answer for that. Please tell me the year, make, model, or part you need."
    except Exception as e:
        logger.error(f"Error processing chat in session {sid}: {e}")
        bot_reply = "Sorry, something went wrong. Please try again."

    # Append bot reply to history
    history.append({"role": "assistant", "content": bot_reply})
    return "", history, sid


def create_new_chat() -> tuple[list[dict[str, str]], str, str]:
    """Reset chat history, generate a fresh session_id, and clear input."""
    new_sid = generate_new_session_id()
    return [], new_sid, ""


CUSTOM_CSS = """
.container {
    max-width: 820px;
    margin: 0 auto;
}
.header-box {
    text-align: center;
    margin-bottom: 12px;
}
.header-box h1 {
    font-size: 1.85rem;
    font-weight: 700;
    margin-bottom: 4px;
    color: #1e293b;
}
.header-box p {
    font-size: 1.0rem;
    color: #64748b;
    margin: 0;
}
"""


def build_app() -> gr.Blocks:
    """Construct and configure the Gradio UI Blocks application."""
    theme = gr.themes.Soft(
        primary_hue="blue",
        secondary_hue="slate",
        font=[gr.themes.GoogleFont("Inter"), "system-ui", "sans-serif"],
    )

    with gr.Blocks(title="Tony — Auto Parts Assistant", theme=theme, css=CUSTOM_CSS) as demo:
        # Browser-persisted session state across page refreshes
        session_id_state = gr.BrowserState(default_value="", storage_key="tony_chat_session_id")

        with gr.Column(elem_classes=["container"]):
            with gr.Column(elem_classes=["header-box"]):
                gr.Markdown(
                    """
                    # Tony — Auto Parts Assistant
                    Find the right vehicle part quickly.
                    """
                )

            chatbot = gr.Chatbot(
                label="Conversation",
                type="messages",
                height=520,
                allow_tags=False,
                avatar_images=(None, "https://cdn-icons-png.flaticon.com/512/3201/3201521.png"),
            )

            with gr.Row():
                msg_input = gr.Textbox(
                    placeholder="e.g. I need a front bumper for a 2018 Honda Civic...",
                    show_label=False,
                    scale=8,
                    autofocus=True,
                    container=False,
                )
                send_btn = gr.Button("Send", variant="primary", scale=2)

            with gr.Row():
                clear_btn = gr.Button("New Chat", variant="secondary", size="sm")

            # Example starter prompts
            gr.Examples(
                examples=[
                    "I need a 2018 Honda Civic front bumper",
                    "I need a henda Civic",
                    "Hi",
                ],
                inputs=msg_input,
                label="Quick Examples",
            )

        # Wire interaction events
        # 0. On load: restore session
        demo.load(
            fn=restore_session,
            inputs=[session_id_state],
            outputs=[chatbot, session_id_state],
            api_name=False,
        )

        # 1. Send button click with documented public API name
        send_btn.click(
            fn=respond,
            inputs=[msg_input, chatbot, session_id_state],
            outputs=[msg_input, chatbot, session_id_state],
            api_name="chat",
        )

        # 2. Enter key submit
        msg_input.submit(
            fn=respond,
            inputs=[msg_input, chatbot, session_id_state],
            outputs=[msg_input, chatbot, session_id_state],
            api_name=False,
        )

        # 3. New Chat button click
        clear_btn.click(
            fn=create_new_chat,
            inputs=[],
            outputs=[chatbot, session_id_state, msg_input],
            api_name=False,
        )

    return demo


demo = build_app()

# Expose the FastAPI app for ASGI runners (uvicorn app:app)
from tony_beta3.api import app as fastapi_app
app = fastapi_app

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    # If explicitly requested with --gradio flag, launch Gradio; otherwise launch FastAPI server for web interface
    import sys
    if "--gradio" in sys.argv:
        demo.launch(server_name=host, server_port=int(os.getenv("PORT", "7860")))
    else:
        print(f"Starting Tony Beta 3 Auto-Parts Chatbot API on {host}:{port}...")
        uvicorn.run(app, host=host, port=port)


