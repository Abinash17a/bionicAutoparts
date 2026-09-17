import { emptyState } from '../entities/schema.js';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
export class MemoryStore {
  constructor({ ttlMs = 24 * 60 * 60 * 1000, maxSessions = 10000 } = {}) { this.sessions = new Map(); this.ttlMs = ttlMs; this.maxSessions = maxSessions; }
  cleanup() { const now=Date.now(); for (const [id, item] of this.sessions) if (now-item.touched > this.ttlMs) this.sessions.delete(id); }
  getOrCreate(id) { this.cleanup(); let item=this.sessions.get(id); if (!item) { if (this.sessions.size >= this.maxSessions) this.sessions.delete(this.sessions.keys().next().value); item={state:emptyState(),touched:Date.now()}; this.sessions.set(id,item); } item.touched=Date.now(); return item.state; }
  get(id) { const item=this.sessions.get(id); return item?.state || null; }
  reset(id) { this.sessions.delete(id); }
  size() { this.cleanup(); return this.sessions.size; }
}

export class SQLiteStore {
  constructor(filename = 'data/sessions.sqlite') { if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true }); this.db = new DatabaseSync(filename); this.db.exec('CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, state TEXT NOT NULL, touched INTEGER NOT NULL)'); }
  getOrCreate(id) { const row=this.db.prepare('SELECT state FROM sessions WHERE id=?').get(id); const state=row?JSON.parse(row.state):emptyState(); this.db.prepare('INSERT OR REPLACE INTO sessions(id,state,touched) VALUES(?,?,?)').run(id,JSON.stringify(state),Date.now()); return state; }
  get(id) { const row=this.db.prepare('SELECT state FROM sessions WHERE id=?').get(id); return row ? JSON.parse(row.state) : null; }
  save(id,state) { this.db.prepare('INSERT OR REPLACE INTO sessions(id,state,touched) VALUES(?,?,?)').run(id,JSON.stringify(state),Date.now()); }
  reset(id) { this.db.prepare('DELETE FROM sessions WHERE id=?').run(id); }
}
