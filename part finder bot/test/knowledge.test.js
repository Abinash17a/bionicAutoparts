import test from 'node:test';
import assert from 'node:assert/strict';
import { KnowledgeDatabase } from '../src/knowledge/database.js';
import { AutomotiveKnowledgeBase } from '../src/knowledge/interface.js';
import { ConversationManager } from '../src/core/conversation-manager.js';
test('database alias drives door glass normalization', async () => {
  const database = new KnowledgeDatabase(':memory:');
  const manager = new ConversationManager({ knowledgeBase: new AutomotiveKnowledgeBase(database) });
  const result = await manager.handle({ sessionId: 'kb', message: 'I need door glass for my 2012 Honda Civic' });
  assert.equal(result.context.part.canonical_part_name, 'door glass');
  database.db.prepare('DELETE FROM part_aliases WHERE alias=?').run('door glass');
  const second = await new ConversationManager({ knowledgeBase: new AutomotiveKnowledgeBase(database) }).handle({ sessionId: 'kb2', message: 'I need door glass for my 2012 Honda Civic' });
  assert.notEqual(second.context.part.canonical_part_name, 'door glass');
});
