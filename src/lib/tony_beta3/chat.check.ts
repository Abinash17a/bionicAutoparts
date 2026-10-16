/**
 * Regression test suite for Tony Beta 3:
 * - Part 1: International phone support & validation
 * - Part 2: Required 7-field collection & completion guard
 * - Part 3: Duplicate protection
 * - Part 4: No false success when Supabase persistence is unavailable or fails
 *
 * Run: node node_modules/tsx/dist/cli.mjs src/lib/tony_beta3/chat.check.ts
 */
import assert from "node:assert/strict";
import { chat } from "./chat";
import {
  extractAndNormalizePhone,
  isValidPhone,
} from "./customer_detector";
import { CustomerRequestRepository } from "./database/customer_request_repository";
import { SessionRepository } from "./database/session_repository";

const sessionRepository = new SessionRepository(false);
const customerRequestRepository = new CustomerRequestRepository(false);
let n = 0;

async function convo(...messages: string[]) {
  const sessionId = `check-${++n}`;
  const out = [];
  for (const m of messages) {
    const r = await chat(m, { sessionId, sessionRepository, customerRequestRepository, seed: 0 });
    console.log(`  user: ${m}\n  tony: [${r.category}] ${r.reply}`);
    out.push(r);
  }
  return out;
}

(async () => {
  console.log("=== PART 11: TEST PHONE NUMBER FORMATS ===");

  // 1. Bare 10-digit & 11-digit numbers -> VALID
  assert.equal(extractAndNormalizePhone("9011657373")?.normalized, "9011657373");
  assert.equal(isValidPhone("9011657373"), true);

  assert.equal(extractAndNormalizePhone("9000000000")?.normalized, "9000000000");
  assert.equal(isValidPhone("9000000000"), true);

  assert.equal(extractAndNormalizePhone("1234567890")?.normalized, "1234567890");
  assert.equal(isValidPhone("1234567890"), true);

  assert.equal(extractAndNormalizePhone("6175551234")?.normalized, "6175551234");
  assert.equal(isValidPhone("6175551234"), true);

  // 11-digit bare numbers -> VALID
  assert.equal(extractAndNormalizePhone("12345678901")?.normalized, "12345678901");
  assert.equal(isValidPhone("12345678901"), true);

  assert.equal(extractAndNormalizePhone("90116573730")?.normalized, "90116573730");
  assert.equal(isValidPhone("90116573730"), true);

  assert.equal(extractAndNormalizePhone("16175551234")?.normalized, "16175551234");
  assert.equal(isValidPhone("16175551234"), true);

  // Formatted numbers
  assert.equal(extractAndNormalizePhone("617-555-1234")?.normalized, "6175551234");
  assert.equal(extractAndNormalizePhone("(617) 555-1234")?.normalized, "6175551234");
  assert.equal(extractAndNormalizePhone("1-617-555-1234")?.normalized, "16175551234");

  // 2. Country code + 10-digit & 11-digit national numbers -> VALID
  assert.equal(extractAndNormalizePhone("+91 9011657373")?.normalized, "9011657373");
  assert.equal(extractAndNormalizePhone("+91-9011657373")?.normalized, "9011657373");
  assert.equal(extractAndNormalizePhone("+91 90116 57373")?.normalized, "9011657373");
  assert.equal(extractAndNormalizePhone("+919011657373")?.normalized, "9011657373");

  assert.equal(extractAndNormalizePhone("+1 6175551234")?.normalized, "6175551234");
  assert.equal(extractAndNormalizePhone("+1 617 555 1234")?.normalized, "6175551234");
  assert.equal(extractAndNormalizePhone("+16175551234")?.normalized, "6175551234");

  assert.equal(extractAndNormalizePhone("+44 20 7946 0991")?.normalized, "2079460991");
  assert.equal(extractAndNormalizePhone("+91 90116573730")?.normalized, "90116573730");
  assert.equal(extractAndNormalizePhone("+1 16175551234")?.normalized, "16175551234");

  // 3. Numbers with <10 or >11 digits -> INVALID (null)
  assert.equal(extractAndNormalizePhone("123456789"), null); // 9-digit
  assert.equal(isValidPhone("123456789"), false);

  assert.equal(extractAndNormalizePhone("123456789012"), null); // 12-digit
  assert.equal(isValidPhone("123456789012"), false);

  assert.equal(extractAndNormalizePhone("12345678"), null); // 8-digit
  assert.equal(isValidPhone("12345678"), false);

  // 4. Country code + non-(10 or 11)-digit numbers -> INVALID
  assert.equal(extractAndNormalizePhone("+91 123456789"), null); // country code + 9 digits
  assert.equal(extractAndNormalizePhone("+1 123456789"), null); // country code + 9 digits
  assert.equal(extractAndNormalizePhone("+91 123456789012"), null); // country code + 12 digits
  assert.equal(extractAndNormalizePhone("+1 123456789012"), null); // country code + 12 digits

  // 5. Invalid text & years
  assert.equal(extractAndNormalizePhone("invalid alphabetic phone"), null);
  assert.equal(isValidPhone("invalid"), false);
  assert.equal(extractAndNormalizePhone("2018"), null);
  assert.equal(extractAndNormalizePhone("2018 Honda Civic front bumper"), null);

  // 6. Phone persists in customer context as normalized 10 digits
  const phoneTest = await convo("2018 Honda Civic front bumper", "Tony Test", "+91 9011657373");
  assert.equal(phoneTest[2].context.customer?.phone, "9011657373");

  // 7. Phone persists into customer_requests as normalized 10 digits
  const phoneTestComplete = await convo(
    "2018 Honda Civic front bumper",
    "Tony Test",
    "+91 9011657373",
    "411001"
  );
  assert.equal(phoneTestComplete[3].category, "REQUEST_COMPLETE");
  assert.equal(phoneTestComplete[3].context.customer?.phone, "9011657373");
  const records = customerRequestRepository.getAllLocalRecords();
  const lastRecord = records.at(-1);
  assert.equal(lastRecord?.phone, "9011657373");
  assert.equal(lastRecord?.manufacturer, "Honda");
  assert.equal(lastRecord?.model, "Civic");
  assert.equal(lastRecord?.year, 2018);
  assert.equal(lastRecord?.customer_name, "Tony Test");

  console.log("\n=== PART 12: END-TO-END COMPLETION TESTS ===");

  // Test A: 2018 Honda Civic front bumper -> Tony Test -> +91 9011657373 -> 411001
  console.log("\n--- Test A: Multi-turn with international number ---");
  const testA = await convo(
    "2018 Honda Civic front bumper",
    "Tony Test",
    "+91 9011657373",
    "411001"
  );
  assert.equal(testA[0].category, "ASK_NAME");
  assert.equal(testA[1].category, "ASK_PHONE");
  assert.equal(testA[2].category, "ASK_ZIP");
  assert.equal(testA[3].category, "REQUEST_COMPLETE");
  assert.deepEqual(testA[3].context.customer, {
    name: "Tony Test",
    phone: "9011657373",
    zip: "411001",
  });

  // Test B: Same flow with US formatted number +1 617 555 1234
  console.log("\n--- Test B: Multi-turn with +1 format ---");
  const testB = await convo(
    "2018 Honda Civic front bumper",
    "Tony Test",
    "+1 617 555 1234",
    "021100"
  );
  assert.equal(testB[0].category, "ASK_NAME");
  assert.equal(testB[1].category, "ASK_PHONE");
  assert.equal(testB[2].category, "ASK_ZIP");
  assert.equal(testB[3].category, "REQUEST_COMPLETE");
  assert.equal(testB[3].context.customer?.phone, "6175551234");
  assert.equal(testB[3].context.customer?.zip, "021100");

  // Test C: Provide all fields in one message
  console.log("\n--- Test C: All fields in single message ---");
  const testC = await convo("Tony Test, +91 9011657373, 411001, 2018 Honda Civic front bumper");
  assert.equal(testC[0].category, "REQUEST_COMPLETE");
  assert.deepEqual(testC[0].context.customer, {
    name: "Tony Test",
    phone: "9011657373",
    zip: "411001",
  });

  // Test D: Repeat message after completion -> duplicate protection
  console.log("\n--- Test D: Duplicate protection ---");
  const countBefore = customerRequestRepository.getAllLocalRecords().length;
  const testD = await convo(
    "Tony Test, +91 9011657373, 411001, 2018 Honda Civic front bumper",
    "Also make sure it fits ex trim"
  );
  assert.equal(testD[0].category, "REQUEST_COMPLETE");
  const countAfter = customerRequestRepository.getAllLocalRecords().length;
  assert.equal(countAfter, countBefore + 1, "Duplicate message in same session must not create extra row");

  console.log("\n=== PART 5 & 10: NO FALSE SUCCESS WHEN SUPABASE PERSISTENCE FAILS ===");
  const prodFailingRepo = new CustomerRequestRepository(true);
  const prodTest = await chat("Tony Test, +91 9011657373, 411001, 2018 Honda Civic front bumper", {
    sessionId: "prod-verify-fail",
    customerRequestRepository: prodFailingRepo,
    sessionRepository,
  });
  assert.notEqual(prodTest.category, "REQUEST_COMPLETE");
  assert.equal(prodTest.category, "ERROR");
  assert.match(prodTest.reply, /having trouble recording your request/i);
  assert.equal(prodTest.context.vehicle.model, "Civic");
  assert.equal(prodTest.context.customer?.name, "Tony Test");

  console.log("\n==================================================");
  console.log("ALL REGRESSION & END-TO-END TESTS PASSED SUCCESSFULLY");
  console.log("==================================================");
})().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
