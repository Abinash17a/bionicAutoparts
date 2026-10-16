import { chat, createContext } from "../src/lib/tony_beta3";
import { getSessionRepository } from "../src/lib/tony_beta3/database/session_repository";

interface TestResult {
  num: number;
  testName: string;
  input: string;
  reply: string;
  action: string;
  category: string;
  context: any;
  latencyMs: number;
  passed: boolean;
  notes?: string;
}

async function runAll14Tests() {
  console.log("===============================================================");
  console.log("Running Tony Beta 3 TypeScript Port Verification (14 Scenarios)");
  console.log("===============================================================\n");

  const results: TestResult[] = [];
  const sessionRepo = getSessionRepository();

  // Test 1: "Hi"
  let t0 = performance.now();
  let r1 = await chat("Hi", { seed: 42 });
  let lat1 = performance.now() - t0;
  results.push({
    num: 1,
    testName: "Greeting",
    input: "Hi",
    reply: r1.reply,
    action: r1.action,
    category: r1.category,
    context: r1.context,
    latencyMs: lat1,
    passed: r1.category === "GREETING",
  });

  // Test 2: "I need a Honda Civic"
  t0 = performance.now();
  let r2 = await chat("I need a Honda Civic", { seed: 42 });
  let lat2 = performance.now() - t0;
  results.push({
    num: 2,
    testName: "Make + Model",
    input: "I need a Honda Civic",
    reply: r2.reply,
    action: r2.action,
    category: r2.category,
    context: r2.context,
    latencyMs: lat2,
    passed:
      r2.context.vehicle.manufacturer === "Honda" &&
      r2.context.vehicle.model === "Civic" &&
      r2.category === "ASK_PART",
  });

  // Test 3: "2018" with existing Honda Civic context
  let ctx3 = JSON.parse(JSON.stringify(r2.context));
  t0 = performance.now();
  let r3 = await chat("2018", { context: ctx3, seed: 42 });
  let lat3 = performance.now() - t0;
  results.push({
    num: 3,
    testName: "Year addition",
    input: "2018",
    reply: r3.reply,
    action: r3.action,
    category: r3.category,
    context: r3.context,
    latencyMs: lat3,
    passed:
      r3.context.vehicle.manufacturer === "Honda" &&
      r3.context.vehicle.model === "Civic" &&
      r3.context.vehicle.year === 2018,
  });

  // Test 4: "front bumper" with existing 2018 Honda Civic context
  let ctx4 = JSON.parse(JSON.stringify(r3.context));
  t0 = performance.now();
  let r4 = await chat("front bumper", { context: ctx4, seed: 42 });
  let lat4 = performance.now() - t0;
  results.push({
    num: 4,
    testName: "Part addition -> Complete Request",
    input: "front bumper",
    reply: r4.reply,
    action: r4.action,
    category: r4.category,
    context: r4.context,
    latencyMs: lat4,
    passed:
      r4.context.part === "front bumper" &&
      r4.category === "FOUND",
  });

  // Test 5: "left side" with existing full context
  let ctx5 = JSON.parse(JSON.stringify(r4.context));
  t0 = performance.now();
  let r5 = await chat("left side", { context: ctx5, seed: 42 });
  let lat5 = performance.now() - t0;
  results.push({
    num: 5,
    testName: "Detail (side)",
    input: "left side",
    reply: r5.reply,
    action: r5.action,
    category: r5.category,
    context: r5.context,
    latencyMs: lat5,
    passed:
      r5.context.details.side === "left" &&
      r5.category === "FOUND",
  });

  // Test 6: "black" with existing context
  let ctx6 = JSON.parse(JSON.stringify(r5.context));
  t0 = performance.now();
  let r6 = await chat("black", { context: ctx6, seed: 42 });
  let lat6 = performance.now() - t0;
  results.push({
    num: 6,
    testName: "Detail (color)",
    input: "black",
    reply: r6.reply,
    action: r6.action,
    category: r6.category,
    context: r6.context,
    latencyMs: lat6,
    passed:
      r6.context.details.color === "black" &&
      r6.context.details.side === "left",
  });

  // Test 7: "actually Toyota" (Incompatible make correction -> clears Civic model)
  let ctx7 = JSON.parse(JSON.stringify(r6.context));
  t0 = performance.now();
  let r7 = await chat("actually Toyota", { context: ctx7, seed: 42 });
  let lat7 = performance.now() - t0;
  results.push({
    num: 7,
    testName: "Manufacturer correction & model compatibility reset",
    input: "actually Toyota",
    reply: r7.reply,
    action: r7.action,
    category: r7.category,
    context: r7.context,
    latencyMs: lat7,
    passed:
      r7.context.vehicle.manufacturer === "Toyota" &&
      r7.context.vehicle.model === null &&
      r7.category === "ASK_MODEL",
  });

  // Test 8: "henda Civic" (Fuzzy match -> requires confirmation)
  t0 = performance.now();
  let r8 = await chat("henda Civic", { seed: 42 });
  let lat8 = performance.now() - t0;
  results.push({
    num: 8,
    testName: "Fuzzy match confirmation",
    input: "henda Civic",
    reply: r8.reply,
    action: r8.action,
    category: r8.category,
    context: r8.context,
    latencyMs: lat8,
    passed:
      r8.action === "confirm" &&
      r8.context.pending_confirmation?.field === "manufacturer" &&
      r8.context.pending_confirmation?.candidate === "Honda" &&
      r8.category === "CONFIRM",
  });

  // Test 9: "no, Mercedes" (Rejection of pending + new manufacturer)
  let ctx9 = JSON.parse(JSON.stringify(r8.context));
  t0 = performance.now();
  let r9 = await chat("no, Mercedes", { context: ctx9, seed: 42 });
  let lat9 = performance.now() - t0;
  results.push({
    num: 9,
    testName: "Rejection + alternative manufacturer",
    input: "no, Mercedes",
    reply: r9.reply,
    action: r9.action,
    category: r9.category,
    context: r9.context,
    latencyMs: lat9,
    passed:
      r9.context.vehicle.manufacturer === "Mercedes-Benz" &&
      r9.context.pending_confirmation === null,
  });

  // Test 10: "2018 spaceship bumper" (Unrecognized entity tokens -> stale vehicle context protection)
  let ctx10 = {
    vehicle: { manufacturer: "Honda", model: "Civic", year: 2018 },
    part: "bumper",
    details: {},
    pending_confirmation: null,
  };
  t0 = performance.now();
  let r10 = await chat("2018 spaceship bumper", { context: ctx10, seed: 42 });
  let lat10 = performance.now() - t0;
  results.push({
    num: 10,
    testName: "Unrecognized entity tokens / stale context protection",
    input: "2018 spaceship bumper",
    reply: r10.reply,
    action: r10.action,
    category: r10.category,
    context: r10.context,
    latencyMs: lat10,
    passed:
      r10.context.vehicle.manufacturer === null &&
      r10.context.vehicle.model === null &&
      r10.category === "ASK_VEHICLE",
  });

  // Test 11: "What's the weather?" (Out of scope)
  t0 = performance.now();
  let r11 = await chat("What's the weather?", { seed: 42 });
  let lat11 = performance.now() - t0;
  results.push({
    num: 11,
    testName: "Out of scope query",
    input: "What's the weather?",
    reply: r11.reply,
    action: r11.action,
    category: r11.category,
    context: r11.context,
    latencyMs: lat11,
    passed:
      r11.action === "out_of_scope" &&
      r11.category === "OUT_OF_SCOPE",
  });

  // Test 12: "I need a 2018 Honda Civic front bumper" (Complete single-shot)
  t0 = performance.now();
  let r12 = await chat("I need a 2018 Honda Civic front bumper", { seed: 42 });
  let lat12 = performance.now() - t0;
  results.push({
    num: 12,
    testName: "Single-shot complete query",
    input: "I need a 2018 Honda Civic front bumper",
    reply: r12.reply,
    action: r12.action,
    category: r12.category,
    context: r12.context,
    latencyMs: lat12,
    passed:
      r12.context.vehicle.manufacturer === "Honda" &&
      r12.context.vehicle.model === "Civic" &&
      r12.context.vehicle.year === 2018 &&
      r12.context.part === "front bumper" &&
      r12.category === "FOUND",
  });

  // Test 13: Multi-turn session reuse: "I need a Honda Civic bumper" -> reload session -> "left side"
  const sess13 = "session-test-13-" + Date.now();
  t0 = performance.now();
  let r13a = await chat("I need a Honda Civic bumper", { sessionId: sess13, seed: 42 });
  // simulate reload by querying session repository
  let r13b = await chat("left side", { sessionId: sess13, seed: 42 });
  let lat13 = performance.now() - t0;
  results.push({
    num: 13,
    testName: "Session persistence across reloads",
    input: "Turn 1: 'I need a Honda Civic bumper' -> Turn 2: 'left side'",
    reply: r13b.reply,
    action: r13b.action,
    category: r13b.category,
    context: r13b.context,
    latencyMs: lat13 / 2,
    passed:
      r13b.context.vehicle.manufacturer === "Honda" &&
      r13b.context.vehicle.model === "Civic" &&
      r13b.context.part === "bumper" &&
      r13b.context.details.side === "left",
  });

  // Test 14: Two independent sessions with different vehicles
  const sessA = "session-A-" + Date.now();
  const sessB = "session-B-" + Date.now();
  t0 = performance.now();
  let r14A = await chat("I need a 2015 Ford F-150 alternator", { sessionId: sessA, seed: 42 });
  let r14B = await chat("I need a 2020 Toyota Camry headlight", { sessionId: sessB, seed: 42 });
  let lat14 = performance.now() - t0;
  results.push({
    num: 14,
    testName: "Two separate sessions isolation",
    input: "Session A (Ford F-150) vs Session B (Toyota Camry)",
    reply: `A: ${r14A.reply} | B: ${r14B.reply}`,
    action: `${r14A.action}/${r14B.action}`,
    category: `${r14A.category}/${r14B.category}`,
    context: { sessionA: r14A.context, sessionB: r14B.context },
    latencyMs: lat14 / 2,
    passed:
      r14A.context.vehicle.manufacturer === "Ford" &&
      r14A.context.vehicle.model === "F-150" &&
      r14A.context.part === "alternator" &&
      r14B.context.vehicle.manufacturer === "Toyota" &&
      r14B.context.vehicle.model === "Camry" &&
      r14B.context.part === "headlight",
  });

  // Display summary
  let totalLatency = 0;
  for (const r of results) {
    totalLatency += r.latencyMs;
    console.log(`[Test ${r.num}] ${r.testName}: ${r.passed ? "PASS" : "FAIL"} (${r.latencyMs.toFixed(3)} ms)`);
    console.log(`  Input:    "${r.input}"`);
    console.log(`  Category: ${r.category} | Action: ${r.action}`);
    console.log(`  Reply:    "${r.reply}"`);
    console.log(`  Context:  ${JSON.stringify(r.context)}`);
    console.log("---------------------------------------------------------------");
  }

  const avgLatency = totalLatency / results.length;
  const allPassed = results.every((r) => r.passed);
  console.log(`\nOVERALL STATUS: ${allPassed ? "14/14 TESTS PASSED" : "TESTS FAILED"}`);
  console.log(`AVERAGE /api/chat EXECUTION LATENCY: ${avgLatency.toFixed(3)} ms`);
}

runAll14Tests().catch(console.error);
