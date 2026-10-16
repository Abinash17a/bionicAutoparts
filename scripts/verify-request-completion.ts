/**
 * Verification script for Tony Beta 3 Customer Request Completion & Persistence.
 * Checks all 7 required fields: Year, Make, Model, Part, Customer Name, Phone, ZIP.
 */

import { chat } from "../src/lib/tony_beta3/chat";
import { CustomerRequestRepository } from "../src/lib/tony_beta3/database/customer_request_repository";
import { SessionRepository } from "../src/lib/tony_beta3/database/session_repository";

async function runTests() {
  console.log("==================================================");
  console.log("TONY BETA 3: REQUEST COMPLETION VERIFICATION SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      failed++;
    }
  }

  // 1. Single-shot completed request (with all 7 fields)
  console.log("\n--- Test 1: Single-shot completed request ---");
  const testRepo1 = new CustomerRequestRepository(false);
  const sessionRepo1 = new SessionRepository(false);
  const res1 = await chat("Tony Test, +91 9011657373, 02110, 2018 Honda Civic front bumper", {
    sessionId: "test-sess-1",
    customerRequestRepository: testRepo1,
    sessionRepository: sessionRepo1,
  });

  assert(res1.category === "REQUEST_COMPLETE", `Category is REQUEST_COMPLETE (got ${res1.category})`);
  assert(res1.reply.length > 0, `Reply generated: "${res1.reply}"`);
  const records1 = testRepo1.getAllLocalRecords();
  assert(records1.length === 1, `Exactly 1 record created (got ${records1.length})`);
  if (records1.length > 0) {
    const r = records1[0];
    assert(r.manufacturer === "Honda", `Manufacturer is Honda (got ${r.manufacturer})`);
    assert(r.model === "Civic", `Model is Civic (got ${r.model})`);
    assert(r.year === 2018, `Year is 2018 (got ${r.year})`);
    assert(r.part.toLowerCase().includes("bumper"), `Part contains Bumper (got ${r.part})`);
    assert(r.customer_name === "Tony Test", `Customer name is Tony Test (got ${r.customer_name})`);
    assert(r.phone === "+919011657373", `Phone is +919011657373 (got ${r.phone})`);
    assert(r.status === "new", `Status is "new" (got ${r.status})`);
    assert(r.details_json?.position === "front", `details_json includes position=front`);
  }

  // 2. Optional details preserved in details_json
  console.log("\n--- Test 2: Optional details preservation ---");
  const testRepo2 = new CustomerRequestRepository(false);
  const sessionRepo2 = new SessionRepository(false);
  const res2 = await chat("Tony Test, 6175551234, 02110, 2018 Honda Civic left side front bumper black", {
    sessionId: "test-sess-2",
    customerRequestRepository: testRepo2,
    sessionRepository: sessionRepo2,
  });
  assert(res2.category === "REQUEST_COMPLETE", `Category is REQUEST_COMPLETE`);
  const records2 = testRepo2.getAllLocalRecords();
  assert(records2.length === 1, `1 record created`);
  if (records2.length > 0) {
    const r = records2[0];
    assert(r.details_json?.side === "left", `details_json has side=left (got ${r.details_json?.side})`);
    assert(r.details_json?.position === "front", `details_json has position=front (got ${r.details_json?.position})`);
    assert(r.details_json?.color === "black", `details_json has color=black (got ${r.details_json?.color})`);
  }

  // 3. Incomplete request (Missing year)
  console.log("\n--- Test 3: Incomplete request (Missing year) ---");
  const testRepo3 = new CustomerRequestRepository(false);
  const sessionRepo3 = new SessionRepository(false);
  const res3 = await chat("Honda Civic bumper", {
    sessionId: "test-sess-3",
    customerRequestRepository: testRepo3,
    sessionRepository: sessionRepo3,
  });
  assert(res3.category === "ASK_YEAR", `Category is ASK_YEAR (got ${res3.category})`);
  assert(testRepo3.getAllLocalRecords().length === 0, `No records created for incomplete request`);

  // 4. Incomplete request (Missing part)
  console.log("\n--- Test 4: Incomplete request (Missing part) ---");
  const testRepo4 = new CustomerRequestRepository(false);
  const sessionRepo4 = new SessionRepository(false);
  const res4 = await chat("2018 Honda Civic", {
    sessionId: "test-sess-4",
    customerRequestRepository: testRepo4,
    sessionRepository: sessionRepo4,
  });
  assert(res4.category === "ASK_PART", `Category is ASK_PART (got ${res4.category})`);
  assert(testRepo4.getAllLocalRecords().length === 0, `No records created for incomplete request`);

  // 5. Multi-turn completion
  console.log("\n--- Test 5: Multi-turn completion ---");
  const testRepo5 = new CustomerRequestRepository(false);
  const sessionRepo5 = new SessionRepository(false);
  await chat("Honda Civic bumper", {
    sessionId: "test-sess-5",
    customerRequestRepository: testRepo5,
    sessionRepository: sessionRepo5,
  });
  assert(testRepo5.getAllLocalRecords().length === 0, `Turn 1: No records created yet`);

  await chat("2018", {
    sessionId: "test-sess-5",
    customerRequestRepository: testRepo5,
    sessionRepository: sessionRepo5,
  });
  assert(testRepo5.getAllLocalRecords().length === 0, `Turn 2 (asked name): No records created yet`);

  await chat("Tony Test", {
    sessionId: "test-sess-5",
    customerRequestRepository: testRepo5,
    sessionRepository: sessionRepo5,
  });
  assert(testRepo5.getAllLocalRecords().length === 0, `Turn 3 (asked phone): No records created yet`);

  await chat("+91 9011657373", {
    sessionId: "test-sess-5",
    customerRequestRepository: testRepo5,
    sessionRepository: sessionRepo5,
  });
  assert(testRepo5.getAllLocalRecords().length === 0, `Turn 4 (asked zip): No records created yet`);

  const res5e = await chat("411001", {
    sessionId: "test-sess-5",
    customerRequestRepository: testRepo5,
    sessionRepository: sessionRepo5,
  });
  assert(res5e.category === "REQUEST_COMPLETE", `Turn 5: Category is REQUEST_COMPLETE (got ${res5e.category})`);
  assert(testRepo5.getAllLocalRecords().length === 1, `Turn 5: Exactly 1 record created upon full completion`);

  // 6. Failure Safety (DB save error)
  console.log("\n--- Test 6: Failure safety when saving fails ---");
  const failingRepo = new CustomerRequestRepository(false);
  // Force saveCustomerRequest to fail
  failingRepo.saveCustomerRequest = async () => ({
    success: false,
    error: "Simulated database connection error",
  });

  const sessionRepo6 = new SessionRepository(false);
  const res6 = await chat("Tony Test, 6175551234, 02110, 2018 Honda Civic front bumper", {
    sessionId: "test-sess-6",
    customerRequestRepository: failingRepo,
    sessionRepository: sessionRepo6,
  });

  assert(res6.category === "ERROR", `Category is ERROR on failure (got ${res6.category})`);
  assert(
    res6.reply === "Sorry, I'm having trouble recording your request right now. Please try again in a moment.",
    `Safe error message returned without claiming success`
  );
  assert(res6.context.vehicle.model === "Civic", `Context is preserved after save failure`);

  // 7. Duplicate lead protection
  console.log("\n--- Test 7: Duplicate lead protection ---");
  const testRepo7 = new CustomerRequestRepository(false);
  const sessionRepo7 = new SessionRepository(false);
  await chat("Tony Test, 6175551234, 02110, 2018 Honda Civic front bumper", {
    sessionId: "test-sess-7",
    customerRequestRepository: testRepo7,
    sessionRepository: sessionRepo7,
  });
  assert(testRepo7.getAllLocalRecords().length === 1, `Initial turn: 1 record created`);

  // Subsequent message in the same session
  await chat("Also make it black color", {
    sessionId: "test-sess-7",
    customerRequestRepository: testRepo7,
    sessionRepository: sessionRepo7,
  });
  assert(
    testRepo7.getAllLocalRecords().length === 1,
    `Subsequent turn in same session did NOT create duplicate row (count: ${testRepo7.getAllLocalRecords().length})`
  );

  // 8. Separate session creates separate row
  console.log("\n--- Test 8: Separate session creates separate row ---");
  await chat("Tony Test, 6175551234, 02110, 2020 Toyota Camry headlight", {
    sessionId: "test-sess-8",
    customerRequestRepository: testRepo7,
    sessionRepository: sessionRepo7,
  });
  assert(
    testRepo7.getAllLocalRecords().length === 2,
    `New session created distinct 2nd record (count: ${testRepo7.getAllLocalRecords().length})`
  );

  console.log("\n==================================================");
  console.log(`TOTAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
