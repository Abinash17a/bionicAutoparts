export class DisabledLlmProvider { constructor() { this.name = 'deterministic'; } async generate() { return null; } }
const validOutput = value => value && Array.isArray(value.vehicle_candidates) && Array.isArray(value.part_candidates) && Array.isArray(value.intent) && Array.isArray(value.conflicts) && typeof value.clarification_needed === 'boolean';
export class OpenAIProvider {
  constructor({ apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || 'gpt-4o-mini', baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1' } = {}) { this.name = 'openai'; this.apiKey = apiKey; this.model = model; this.baseUrl = baseUrl; }
  async generate({ message, context }) {
    if (!this.apiKey) throw Object.assign(new Error('LLM provider is not configured'), { code: 'PROVIDER_UNAVAILABLE' });
    const response = await fetch(`${this.baseUrl}/chat/completions`, { method: 'POST', headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify({ model: this.model, temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Return only JSON with vehicle_candidates, part_candidates, intent, side, position, problem, location, conflicts, clarification_needed, clarification_question. Never invent inventory or prices.' }, { role: 'user', content: JSON.stringify({ message, context }) }] }) });
    if (!response.ok) throw Object.assign(new Error(`LLM request failed: ${response.status}`), { code: 'PROVIDER_UNAVAILABLE' });
    const body = await response.json(); let parsed; try { parsed = JSON.parse(body.choices?.[0]?.message?.content || '{}'); } catch { throw Object.assign(new Error('LLM returned malformed JSON'), { code: 'INVALID_PROVIDER_OUTPUT' }); }
    if (!validOutput(parsed)) throw Object.assign(new Error('LLM output failed schema validation'), { code: 'INVALID_PROVIDER_OUTPUT' });
    return parsed;
  }
}
export function createLlmProvider(name = 'deterministic') { if (name === 'none' || name === 'deterministic') return new DisabledLlmProvider(); if (name === 'openai') return new OpenAIProvider(); throw new Error(`Unsupported LLM provider: ${name}`); }
