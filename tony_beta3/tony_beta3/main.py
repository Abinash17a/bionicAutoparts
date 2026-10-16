"""Entry point for Tony Beta 3 CLI and HTTP server."""

import argparse
import json
import sys
import time
import uvicorn
from tony_beta3.chat import chat
from tony_beta3.confirmation import evaluate_confirmation
from tony_beta3.context import create_context, update_context
from tony_beta3.detector import detect_entities
from tony_beta3.response import generate_reply


def main():
    parser = argparse.ArgumentParser(description="Tony Beta 3 Auto-Parts Chatbot Core")
    parser.add_argument("message", nargs="?", type=str, help="User message to analyze")
    parser.add_argument("--session", type=str, default=None, help="Session ID for persistent conversation")
    parser.add_argument("--confirm", action="store_true", help="Run Stage 2 confirmation evaluation")
    parser.add_argument("--context", action="store_true", help="Run Stage 3 conversation context update")
    parser.add_argument("--reply", action="store_true", help="Run Stage 4 template response generation")
    parser.add_argument("--server", action="store_true", help="Start the FastAPI HTTP server")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Server host")
    parser.add_argument("--port", type=int, default=8000, help="Server port")

    args = parser.parse_args()

    if args.server:
        print(f"Starting Tony Beta 3 API server on {args.host}:{args.port}...")
        uvicorn.run("tony_beta3.api:app", host=args.host, port=args.port, reload=False)
        return

    if args.message:
        start_time = time.perf_counter()
        if args.reply:
            ctx = update_context(None, user_message=args.message)
            result = generate_reply(ctx)
        elif args.context:
            result = update_context(None, user_message=args.message)
        elif args.confirm:
            result = evaluate_confirmation(args.message)
        else:
            result = chat(args.message, session_id=args.session)
        latency_ms = (time.perf_counter() - start_time) * 1000
        print(json.dumps(result, indent=2))
        print(f"\nExecution latency: {latency_ms:.3f} ms", file=sys.stderr)
    else:
        # Interactive end-to-end Chat REPL
        session_id = args.session or "cli-session-01"
        print(f"Tony Beta 3 - Auto-Parts Chatbot REPL [Session: {session_id}]")
        print("Type 'exit' to quit, 'reset' to clear context.")
        print("=" * 75)
        while True:
            try:
                msg = input("\nUser > ")
                if msg.strip().lower() in ("exit", "quit"):
                    break
                if msg.strip().lower() == "reset":
                    from tony_beta3.database.session_repository import get_session_repository
                    get_session_repository().delete_session(session_id)
                    print(f"Session '{session_id}' context reset to initial empty state.")
                    continue

                start_time = time.perf_counter()
                chat_res = chat(msg, session_id=session_id)
                latency_ms = (time.perf_counter() - start_time) * 1000

                print(f"Bot  > {chat_res['reply']}")
                print(f"[Action: {chat_res['action']} | Category: {chat_res['category']} | Latency: {latency_ms:.3f} ms]")
            except (KeyboardInterrupt, EOFError):
                break


if __name__ == "__main__":
    main()
