"""Supabase client connection helper for Tony Beta 3."""

import logging
from typing import Any
from tony_beta3.database.config import SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL

logger = logging.getLogger(__name__)

_supabase_client: Any | None = None
_client_initialized: bool = False


def get_supabase_client() -> Any | None:
    """Initialize or return the cached Supabase client instance.

    Returns None if credentials are missing or client creation fails.
    """
    global _supabase_client, _client_initialized

    if _client_initialized:
        return _supabase_client

    key = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY

    if not SUPABASE_URL or not key or "your-project" in SUPABASE_URL:
        logger.info("Supabase credentials not configured. Using catalog repository with default authoritative data.")
        _client_initialized = True
        _supabase_client = None
        return None

    try:
        from supabase import Client, create_client
        _supabase_client = create_client(SUPABASE_URL, key)
        logger.info(f"Supabase client connected to {SUPABASE_URL}")
    except Exception as e:
        logger.warning(f"Could not connect to Supabase: {e}. Falling back to default catalog.")
        _supabase_client = None

    _client_initialized = True
    return _supabase_client
