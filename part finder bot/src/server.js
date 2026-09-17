import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { config } from './config/index.js';
import { ConversationManager } from './core/conversation-manager.js';
import { logger } from './utils/logger.js';
import { publicContext } from './entities/schema.js';
const manager = new ConversationManager();
const started = Date.now();
const counters = new Map();
function json(res, status, body, requestId) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer', ...(requestId ? { 'x-request-id': requestId } : {}) }); res.end(body === undefined ? '' : JSON.stringify(body)); }
function errorBody(code, message, requestId) { return { error: { code, message, request_id: requestId } }; }
function allowed(req) { const key = req.socket.remoteAddress || 'local'; const now = Date.now(); const item = counters.get(key) || { at: now, count: 0 }; if (now - item.at > config.rateLimitWindowMs) { item.at = now; item.count = 0; } item.count++; counters.set(key, item); return item.count <= config.rateLimitPerMinute; }
function readBody(req) { return new Promise((resolve, reject) => { let body = ''; req.on('data', chunk => { body += chunk; if (body.length > config.maxMessageLength + 1000) reject(new Error('request body too large')); }); req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('invalid JSON')); } }); req.on('error', reject); }); }
export const server = http.createServer(async (req, res) => {
  const requestId = /^[A-Za-z0-9._-]{1,128}$/.test(req.headers['x-request-id'] || '') ? req.headers['x-request-id'] : randomUUID();
  res.setHeader('x-request-id', requestId);
  const startedAt = Date.now();
  const origin = req.headers.origin;
  if (origin && config.corsOrigins.includes(origin)) { res.setHeader('access-control-allow-origin', origin); res.setHeader('vary', 'Origin'); res.setHeader('access-control-allow-headers', 'content-type, x-request-id, authorization'); res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS'); }
  if (req.method === 'OPTIONS') return json(res, 204, undefined, requestId);
  if (!allowed(req)) return json(res, 429, errorBody('RATE_LIMITED', 'Too many requests.', requestId), requestId);
  try {
    if (config.authRequired && !req.headers.authorization) return json(res, 401, errorBody('UNAUTHENTICATED', 'Authentication required.', requestId), requestId);
    if (req.method === 'GET' && req.url === '/health') return json(res, 200, { status: 'ok', provider: manager.provider.name, uptime_seconds: Math.floor((Date.now() - started) / 1000) });
    if (req.method === 'GET' && req.url.startsWith('/session/')) { const sessionId = decodeURIComponent(req.url.slice('/session/'.length)); if (!/^[A-Za-z0-9._:-]{1,128}$/.test(sessionId)) return json(res, 400, errorBody('INVALID_SESSION_ID', 'Invalid session ID.', requestId), requestId); const state = manager.store.get?.(sessionId); if (!state) return json(res, 404, errorBody('SESSION_NOT_FOUND', 'Session not found.', requestId), requestId); return json(res, 200, { session_id: sessionId, request_id: requestId, state: publicContext(state) }, requestId); }
    if (req.method === 'POST' && req.url === '/chat') { if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return json(res, 400, errorBody('INVALID_CONTENT_TYPE', 'Content-Type must be application/json.', requestId), requestId); const body = await readBody(req); if (typeof body.session_id !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(body.session_id)) return json(res, 400, errorBody('INVALID_SESSION_ID', 'Invalid session ID.', requestId), requestId); const result = await manager.handle({ sessionId: body.session_id, message: body.message }); return json(res, 200, { ...result, session_id: body.session_id, request_id: requestId, clarification_needed: result.missing_information.length > 0 }, requestId); }
    if (req.method === 'POST' && req.url === '/reset-session') { const body = await readBody(req); if (typeof body.session_id !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(body.session_id)) return json(res, 400, errorBody('INVALID_SESSION_ID', 'Invalid session ID.', requestId), requestId); manager.store.reset(body.session_id); return json(res, 200, { reset: true, session_id: body.session_id, request_id: requestId }, requestId); }
    return json(res, 404, errorBody('NOT_FOUND', 'Resource not found.', requestId), requestId);
  } catch (error) { const clientError = /required|too long|invalid JSON|must be|body too large/i.test(error.message); const code = clientError ? 'INVALID_REQUEST' : error.code === 'PROVIDER_UNAVAILABLE' ? 'PROVIDER_UNAVAILABLE' : 'INTERNAL_ERROR'; const status = clientError ? 400 : error.code === 'PROVIDER_UNAVAILABLE' ? 503 : 500; logger.error('request_failed', { timestamp: new Date().toISOString(), request_id: requestId, endpoint: req.url, duration_ms: Date.now()-startedAt, provider: manager.provider.name, success: false, error_category: code }); return json(res, status, errorBody(code, clientError ? error.message : code === 'PROVIDER_UNAVAILABLE' ? 'Provider unavailable.' : 'Internal server error.', requestId), requestId); }
});
export async function shutdown(signal = 'shutdown') { logger.info('server_shutdown', { signal }); await new Promise(resolve => server.close(resolve)); manager.knowledgeBase?.database?.close?.(); if (manager.store.db) manager.store.db.close?.(); }
if (process.argv[1]?.endsWith('server.js')) { server.on('error', error => { if (error.code === 'EADDRINUSE') { console.error(`Port ${config.port} is already in use. Set PORT to another value, for example PORT=3001.`); process.exitCode = 1; } else throw error; }); server.listen(config.port, () => logger.info('server_started', { port: config.port, provider: manager.provider.name, storage: config.storageProvider })); process.once('SIGTERM', () => shutdown('SIGTERM').then(() => process.exit(0))); process.once('SIGINT', () => shutdown('SIGINT').then(() => process.exit(0))); }
