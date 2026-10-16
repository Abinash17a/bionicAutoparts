"""Tests for Gradio UI handler functions in app.py."""

from unittest.mock import patch
from app import create_new_chat, generate_new_session_id, respond


def test_generate_new_session_id():
    s1 = generate_new_session_id()
    s2 = generate_new_session_id()
    assert s1.startswith("session-")
    assert s2.startswith("session-")
    assert s1 != s2


def test_ui_respond_flow():
    sid = generate_new_session_id()
    history = []

    # Turn 1: "Hi"
    inp, history, sid = respond("Hi", history, sid)
    assert inp == ""
    assert len(history) == 2
    assert history[0] == {"role": "user", "content": "Hi"}
    assert history[1]["role"] == "assistant"
    assert len(history[1]["content"]) > 0

    # Turn 2: "I need a Honda Civic"
    inp, history, sid = respond("I need a Honda Civic", history, sid)
    assert len(history) == 4
    assert history[2] == {"role": "user", "content": "I need a Honda Civic"}
    assert "Honda" in history[3]["content"] or "Civic" in history[3]["content"] or "part" in history[3]["content"]

    # Turn 3: "2018"
    inp, history, sid = respond("2018", history, sid)
    assert len(history) == 6

    # Turn 4: "front bumper"
    inp, history, sid = respond("front bumper", history, sid)
    assert len(history) == 8

    # Turn 5: "left side"
    inp, history, sid = respond("left side", history, sid)
    assert len(history) == 10

    # Turn 6: "black"
    inp, history, sid = respond("black", history, sid)
    assert len(history) == 12

    # Turn 7: "thanks"
    inp, history, sid = respond("thanks", history, sid)
    assert len(history) == 14
    assert history[13]["role"] == "assistant"


def test_ui_confirmation_flow():
    sid = generate_new_session_id()
    history = []

    # Fuzzy match requiring confirmation
    inp, history, sid = respond("I need a henda Civic", history, sid)
    assert len(history) == 2
    assert "Honda" in history[1]["content"]

    # User confirms 'yes'
    inp, history, sid = respond("yes", history, sid)
    assert len(history) == 4
    assert history[3]["role"] == "assistant"


def test_ui_new_chat_button():
    cleared_history, new_sid, cleared_input = create_new_chat()
    assert cleared_history == []
    assert new_sid.startswith("session-")
    assert cleared_input == ""


def test_ui_error_handling_graceful():
    sid = "error-sid"
    history = []

    with patch("app.chat", side_effect=Exception("Database crashed")):
        inp, history, sid = respond("Hello", history, sid)
        assert len(history) == 2
        assert history[1]["content"] == "Sorry, something went wrong. Please try again."
