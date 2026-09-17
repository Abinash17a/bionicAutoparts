# Deployment

Use Node.js 22.5 or newer. Install with `npm install` and start with `npm start`. Set `PORT`, `STORAGE_PROVIDER`, `SQLITE_PATH`, `CORS_ORIGINS`, and `AUTH_REQUIRED` in the host environment. Use `GET /health` for a lightweight liveness check.

Memory storage is suitable for a single ephemeral instance only. SQLite requires a persistent writable volume and is not a shared distributed session store. The later Supabase repository can replace this boundary without changing the HTTP contract.

Run `npm test`, `npm run evaluate`, and `npm run smoke-test` before deployment. Handle SIGTERM/SIGINT through the built-in graceful shutdown path.
