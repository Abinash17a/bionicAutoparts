const number = (name, fallback, minimum) => { const value = Number(process.env[name] ?? fallback); if (!Number.isFinite(value) || value < minimum) throw new Error(`${name} must be a number >= ${minimum}`); return value; };
const llmProvider = process.env.LLM_PROVIDER || 'deterministic';
const storageProvider = process.env.STORAGE_PROVIDER || 'memory';
if (!['deterministic', 'none', 'openai'].includes(llmProvider)) throw new Error(`Unsupported LLM_PROVIDER: ${llmProvider}`);
if (!['memory', 'sqlite'].includes(storageProvider)) throw new Error(`Unsupported STORAGE_PROVIDER: ${storageProvider}`);
if (llmProvider === 'openai' && !process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required when LLM_PROVIDER=openai');
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(value => value.trim()).filter(Boolean);
for (const origin of corsOrigins) { try { new URL(origin); } catch { throw new Error(`Invalid CORS origin: ${origin}`); } }
export const config = Object.freeze({ port: number('PORT', 3000, 1), llmProvider, maxMessageLength: number('MAX_MESSAGE_LENGTH', 4000, 1), rateLimitPerMinute: number('RATE_LIMIT_PER_MINUTE', 60, 1), rateLimitWindowMs: number('RATE_LIMIT_WINDOW_MS', 60000, 1), storageProvider, sessionTtlMs: number('SESSION_TTL_MS', 86400000, 1), maxSessions: number('MAX_SESSIONS', 10000, 1), sqlitePath: process.env.SQLITE_PATH || 'data/sessions.sqlite', authRequired: process.env.AUTH_REQUIRED === 'true', corsOrigins });
