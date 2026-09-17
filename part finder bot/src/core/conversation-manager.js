import { config } from '../config/index.js';
import { extractMessage } from './extractor.js';
import { classifyIntent } from '../intent/classify.js';
import { updateState } from '../memory/update.js';
import { publicContext } from '../entities/schema.js';
import { buildReply } from './respond.js';
import { MemoryStore, SQLiteStore } from '../memory/store.js';
import { createLlmProvider } from '../llm/provider.js';
import { KnowledgeDatabase } from '../knowledge/database.js';
import { AutomotiveKnowledgeBase } from '../knowledge/interface.js';
import { normalizeWithKnowledge } from '../normalization/kb-normalizer.js';

export class ConversationManager {
  constructor({ store, provider = createLlmProvider(config.llmProvider), knowledgeBase } = {}) { this.store = store || (config.storageProvider === 'sqlite' ? new SQLiteStore(config.sqlitePath) : new MemoryStore({ ttlMs: config.sessionTtlMs, maxSessions: config.maxSessions })); this.provider = provider; this.knowledgeBase = knowledgeBase || new AutomotiveKnowledgeBase(new KnowledgeDatabase(':memory:')); this.locks = new Map(); }
  async handle(input) { const previous = this.locks.get(input.sessionId) || Promise.resolve(); let release; const current = new Promise(resolve => { release = resolve; }); const queued = previous.then(() => current); this.locks.set(input.sessionId, queued); try { await previous; return await this.process(input); } finally { release(); if (this.locks.get(input.sessionId) === queued) this.locks.delete(input.sessionId); } }
  async process({ sessionId, message }) {
    if (!sessionId || typeof sessionId !== 'string') throw new Error('session_id is required');
    if (typeof message !== 'string' || !message.trim()) throw new Error('message must be a non-empty string');
    if (message.length > config.maxMessageLength) throw new Error('message is too long');
    const state = this.store.getOrCreate(sessionId);
    const extraction = normalizeWithKnowledge(extractMessage(message), message, this.knowledgeBase);
    let llmUsed = false;
    if (this.provider.name === 'openai' && (!extraction.facts['part.canonical_part_name'] || extraction.facts['part.ambiguous'])) {
      try {
        const fallback = await this.provider.generate({ message, context: publicContext(state) });
        llmUsed = true;
        if (fallback.part_candidates?.[0]?.part && Number(fallback.part_candidates[0].confidence || 0) >= 0.7 && !extraction.facts['part.ambiguous']) extraction.facts['part.canonical_part_name'] = { value: fallback.part_candidates[0].part, source: 'llm', confidence: Number(fallback.part_candidates[0].confidence) };
      } catch (error) { state.history.push({ type: 'llm_fallback_failed', code: error.code || 'unknown', at: new Date().toISOString() }); }
    }
    updateState(state, extraction, message);
    const intent = classifyIntent(message, extraction.facts);
    state.intent = [...new Set([...state.intent, ...intent])];
    if (this.store.save) this.store.save(sessionId, state);
    return { reply: buildReply(state, extraction), intent, context: publicContext(state), missing_information: state.missing_information, llm_used: llmUsed };
  }
}
