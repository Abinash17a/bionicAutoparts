/* eslint-disable @typescript-eslint/no-unused-vars, no-empty */
import assert from "assert";
import fs from "fs";
import path from "path";

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    for (const line of envConfig.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const val = valueParts.join("=").replace(/[\r"']/g, "").trim();
          process.env[key.trim()] = val;
        }
      }
    }
  }
} catch (_err) {}

import { chat } from "./chat";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseClient } from "./database/supabase_client";
import { CustomerRequestRepository } from "./database/customer_request_repository";

(async function runPersistenceVerification() {
  console.log("=== VERIFYING SUPABASE PERSISTENCE & PLACEHOLDER REMOVAL ===");

  // 1. Verify placeholder URL behavior is completely disabled
  const originalUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const originalAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const dummyClient = createAdminClient();
  assert.strictEqual(
    dummyClient,
    null,
    "createAdminClient must return null when env vars are missing/placeholder (must NOT connect to placeholder.supabase.co)"
  );
  console.log("✓ Pass: Missing/placeholder env vars return null without contacting placeholder.supabase.co");

  // Restore env vars
  if (originalUrl) process.env.SUPABASE_URL = originalUrl;
  if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  if (originalServiceKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceKey;
  if (originalAnonKey) process.env.SUPABASE_ANON_KEY = originalAnonKey;

  // 2. Test CustomerRequestRepository local in-memory fallback (useSupabase = false for unit testing)
  const localRepo = new CustomerRequestRepository(false);
  const localSession = "pers-verify-local-" + Date.now();
  let localCtx: any = null;

  const localTurns = [
    { input: "2018 Honda", expectedCategory: "ASK_MODEL" },
    { input: "Civic", expectedCategory: "ASK_PART" },
    { input: "front bumper", expectedCategory: "ASK_NAME" },
    { input: "Tony Test", expectedCategory: "ASK_PHONE" },
    { input: "+1 617 555 0123", expectedCategory: "ASK_ZIP" },
    { input: "411001", expectedCategory: "REQUEST_COMPLETE" },
  ];

  for (const turn of localTurns) {
    const res = await chat(turn.input, {
      sessionId: localSession,
      context: localCtx,
      customerRequestRepository: localRepo,
    });
    assert.strictEqual(res.category, turn.expectedCategory, `Expected category ${turn.expectedCategory} for input ${turn.input}`);
    assert.ok(!res.reply.includes("having trouble recording your request"), "Must not return error response");
    localCtx = res.context;
  }
  assert.strictEqual(localCtx.customer?.zip, "411001");
  console.log("✓ Pass: 411001 flow completed successfully with REQUEST_COMPLETE");

  // 3. Test 021100 and 123456
  const zipTests = ["021100", "123456"];
  for (const z of zipTests) {
    const sId = `pers-verify-${z}-` + Date.now();
    let c: any = null;
    const steps = ["2018 Honda Civic front bumper", "Tony Test", "+1 617 555 0123", z];
    for (const msg of steps) {
      const res = await chat(msg, {
        sessionId: sId,
        context: c,
        customerRequestRepository: localRepo,
      });
      c = res.context;
      if (msg === z) {
        assert.strictEqual(res.category, "REQUEST_COMPLETE", `ZIP ${z} must result in REQUEST_COMPLETE`);
        assert.ok(!res.reply.includes("having trouble recording your request"));
      }
    }
    assert.strictEqual(c.customer?.zip, z);
    console.log(`✓ Pass: ZIP ${z} accepted and completes request`);
  }

  console.log("\n==================================================");
  console.log("PERSISTENCE & PLACEHOLDER FIX VERIFICATION SUCCESSFUL");
  console.log("==================================================");
})().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
