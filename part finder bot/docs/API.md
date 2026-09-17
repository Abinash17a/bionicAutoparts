# API

`POST /chat` accepts `{session_id,message}` and returns reply, intent, public context, missing information, and `X-Request-ID`.

The stable response also includes `session_id`, `request_id`, `clarification_needed`, and `llm_used`. The public context contains `vehicle`, `request`, `location`, and `problem`; internal prompts and raw database objects are never returned.

`GET /health` reports status/provider/uptime. `POST /reset-session` accepts `{session_id}`. Invalid input is 400, authentication failures 401, rate limits 429, and unexpected failures 500.

`GET /session/:id` is a development endpoint returning safe public context. `X-Request-ID` is propagated or generated for every response.
