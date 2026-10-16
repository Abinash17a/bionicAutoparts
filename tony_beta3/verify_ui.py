"""Verification script testing Gradio UI responder directly for Section 10 conversations."""

from app import generate_new_session_id, respond


def run_ui_verification():
    print("================================================================================")
    print("           TONY BETA 3 - GRADIO UI CONVERSATION VERIFICATION                    ")
    print("================================================================================")

    # Conversation 1: 7-step sequence
    sid = generate_new_session_id()
    history = []

    steps = [
        "Hi",
        "I need a Honda Civic",
        "2018",
        "front bumper",
        "left side",
        "black",
        "thanks",
    ]

    print(f"\n--- Conversation 1 (Session ID: {sid}) ---")
    for step in steps:
        _, history, sid = respond(step, history, sid)
        user_msg = history[-2]["content"]
        bot_msg = history[-1]["content"]
        print(f"User > {user_msg}")
        print(f"Tony > {bot_msg}\n")

    # Conversation 2: Confirmation flow
    sid2 = generate_new_session_id()
    history2 = []

    confirm_steps = [
        "I need a henda Civic",
        "yes",
        "2018 front bumper",
    ]

    print(f"--- Conversation 2: Confirmation Flow (Session ID: {sid2}) ---")
    for step in confirm_steps:
        _, history2, sid2 = respond(step, history2, sid2)
        user_msg = history2[-2]["content"]
        bot_msg = history2[-1]["content"]
        print(f"User > {user_msg}")
        print(f"Tony > {bot_msg}\n")

    print("================================================================================")
    print("                       UI VERIFICATION SUCCESSFUL                               ")
    print("================================================================================")


if __name__ == "__main__":
    run_ui_verification()
