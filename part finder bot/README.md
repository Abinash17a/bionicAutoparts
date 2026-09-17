# Used Auto Parts Conversation Engine

Lightweight Node.js 22.5+ API for automotive part conversations. It extracts and normalizes vehicle/part language against a local SQLite knowledge base, tracks structured context, asks targeted clarifications, and never invents inventory, pricing, compatibility, shipping, or VIN results.

Install with `npm install`; run `npm start`, `npm test`, `npm run evaluate`, or `npm run smoke-test`. API details are in `docs/API.md`; deployment and security notes are in `docs/DEPLOYMENT.md` and `docs/SECURITY.md`. Memory defaults to bounded TTL in-process storage; set `STORAGE_PROVIDER=sqlite` for local persistence. Set `PORT=3001` when another service owns port 3000. `AUTH_REQUIRED=true` enables the intentionally minimal authentication hook. `LLM_PROVIDER=deterministic` or `none` requires no API key and makes no LLM calls; `LLM_PROVIDER=openai` requires `OPENAI_API_KEY`.
