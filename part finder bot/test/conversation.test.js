import test from 'node:test';
import assert from 'node:assert/strict';
import { ConversationManager } from '../src/core/conversation-manager.js';
test('extracts vehicle and part', async () => { const r = await new ConversationManager().handle({sessionId:'a',message:'I need a 2012 Honda Civic driver side mirror'}); assert.equal(r.context.vehicle.make,'Honda'); assert.equal(r.context.part.canonical_part_name,'exterior mirror'); assert.match(r.reply,/availability/); });
test('asks body style', async () => { const r = await new ConversationManager().handle({sessionId:'b',message:'2018 Honda Civic hood'}); assert.match(r.reply,/body style/); });
