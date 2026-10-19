/**
 * Regression checks for contact-form phone / postal handling.
 * Run: node node_modules/tsx/dist/cli.mjs src/lib/tony_beta3/contact.check.ts
 */
import assert from "node:assert/strict";
import { chat } from "./chat";
import { formatContactMessage, normalizePhone, normalizePostal } from "./contact_rules";
import { CustomerRequestRepository } from "./database/customer_request_repository";
import { SessionRepository } from "./database/session_repository";

const phone = (iso: string, v: string) => normalizePhone(iso, v);
const ok = (r: { ok: boolean; value?: string }) => (r.ok ? r.value : null);

// Phone: country code + national -> one E.164 number, no duplicate prefix
assert.equal(ok(phone("US", "617 555 1234") as any), "+16175551234");
assert.equal(ok(phone("US", "+1 617-555-1234") as any), "+16175551234");
assert.equal(ok(phone("US", "16175551234") as any), "+16175551234");
assert.equal(ok(phone("IN", "+91 90116 57373") as any), "+919011657373");
assert.equal(ok(phone("IN", "919011657373") as any), "+919011657373");
assert.equal(ok(phone("IN", "09011657373") as any), "+919011657373"); // trunk 0 dropped
assert.equal(ok(phone("GB", "+44 (0) 7911 123456") as any), "+447911123456");
assert.equal(ok(phone("IT", "06 1234 5678") as any), "+390612345678"); // Italy keeps leading 0
// 10- and 11-digit rules follow the country, not a global rule
assert.equal(ok(phone("DE", "0151 1234 5678") as any), "+4915112345678"); // 11-digit national
assert.equal(ok(phone("BR", "11 91234-5678") as any), "+5511912345678"); // 11-digit national
assert.equal(ok(phone("FR", "06 12 34 56 78") as any), "+33612345678"); // 9-digit national
assert.equal(phone("IN", "12345").ok, false);
assert.equal(phone("US", "123 456 7890").ok, false); // NANP area code can't start with 1
assert.equal(phone("US", "+91 9011657373").ok, false); // wrong country code with clear guidance
assert.match((phone("US", "+91 9011657373") as any).error, /starts with \+91 \(India\)/);
assert.match((phone("US", "919011657373") as any).error, /looks like an? India/i);
assert.match((phone("US", "12345") as any).error, /valid United States phone/);
assert.equal((phone("US", "") as any).error, "Please enter your phone number.");
assert.equal((phone("US", "   ") as any).error, "Please enter your phone number.");
assert.equal((phone("US", "---") as any).error, "Please enter your phone number.");

// Test changing country dropdown after entering number
const enteredNumber = "9011657373";
assert.equal(phone("US", enteredNumber).ok, false); // fails under US rules
assert.equal(ok(phone("IN", enteredNumber) as any), "+919011657373"); // passes when switched to India

// Postal: strings, leading zeros kept, per-country rules
assert.equal(ok(normalizePostal("US", "90210") as any), "90210");
assert.equal(ok(normalizePostal("US", "02110") as any), "02110");
assert.equal(ok(normalizePostal("US", "90210-1234") as any), "90210-1234");
assert.equal(ok(normalizePostal("IN", "411001") as any), "411001");
assert.equal(ok(normalizePostal("GB", "sw1a1aa") as any), "SW1A 1AA");
assert.equal(normalizePostal("US", "9021").ok, false);
assert.equal(normalizePostal("US", "411001").ok, false);
assert.equal(normalizePostal("IN", "90210").ok, false);
assert.match((normalizePostal("IN", "123") as any).error, /valid India postal code/);

// Form message goes through the existing chat -> request-completion path and keeps context
(async () => {
  const sessionRepository = new SessionRepository(false);
  const customerRequestRepository = new CustomerRequestRepository(false);
  const o = { sessionId: "contact-check", sessionRepository, customerRequestRepository, seed: 0 };
  await chat("2018 Honda Civic front bumper", o);
  const before = await chat("My name is Tony Test", o);
  const msg = formatContactMessage("US", "+16175551234", "02110");
  assert.equal(msg, "+1 6175551234, ZIP: 02110 [US]");
  const done = await chat(msg, o);
  assert.equal(done.category, "REQUEST_COMPLETE");
  assert.equal(done.context.customer?.phone, "+16175551234");
  assert.equal(done.context.customer?.zip, "02110");
  assert.equal(done.context.customer?.name, before.context.customer?.name);
  assert.deepEqual(done.context.vehicle, before.context.vehicle);
  assert.equal(done.context.part, before.context.part);

  console.log("contact.check: all assertions passed");
})();
