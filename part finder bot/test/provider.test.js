import test from 'node:test';
import assert from 'node:assert/strict';
import { OpenAIProvider, DisabledLlmProvider } from '../src/llm/provider.js';
test('deterministic provider never requires an API key', async()=>{const provider=new DisabledLlmProvider();assert.equal(await provider.generate({message:'hello',context:{}}),null);});
test('OpenAI provider fails safely when unconfigured', async()=>{const provider=new OpenAIProvider({apiKey:''});await assert.rejects(()=>provider.generate({message:'hello',context:{}}),error=>error.code==='PROVIDER_UNAVAILABLE');});
