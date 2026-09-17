# Testing

Run `npm test`, `npm run evaluate`, and `npm run smoke-test`. The evaluation set contains 100 realistic messages, and smoke tests exercise semantic expectations through the actual HTTP server with 25 scenarios. The knowledge test removes a SQLite alias and verifies behavior changes. Configure `PORT`, `STORAGE_PROVIDER`, `SQLITE_PATH`, `SESSION_TTL_MS`, `MAX_SESSIONS`, `RATE_LIMIT_PER_MINUTE`, `RATE_LIMIT_WINDOW_MS`, `AUTH_REQUIRED`, and `CORS_ORIGINS` through the environment.
