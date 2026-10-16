"""Tony Beta 3 Auto-Parts Chatbot Core.

Stage 1: Entity Detection Module
Stage 2: Confirmation & Correction Engine
Stage 3: Conversation Context & State Manager
Stage 4: Template-Driven Response Generator
Stage 5: Final Chatbot Orchestration Layer
"""

from tony_beta3.chat import chat
from tony_beta3.confirmation import evaluate_confirmation
from tony_beta3.context import create_context, update_context
from tony_beta3.detector import detect_entities
from tony_beta3.response import determine_response_category, fill_variables, generate_reply, generate_response

__all__ = [
    "detect_entities",
    "evaluate_confirmation",
    "create_context",
    "update_context",
    "determine_response_category",
    "fill_variables",
    "generate_reply",
    "generate_response",
    "chat",
]
__version__ = "0.5.0"
