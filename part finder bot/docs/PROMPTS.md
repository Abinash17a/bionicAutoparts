# Provider policy

The deterministic provider is the default and requires no API key. Any future provider must return validated structured JSON, mark uncertain facts as inferred with confidence, and never invent inventory, price, compatibility, or shipping data.

The OpenAI provider is called only for unresolved part cases, uses JSON mode, validates required fields, and records `llm_used` in the response.
