// src/lib/supabase/admin.ts
// SERVER-ONLY privileged client. Never import from browser code.
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

export function createAdminClient(): SupabaseClient | null {
  const isInvalid = (val?: string) =>
    !val ||
    val.includes('placeholder') ||
    val.includes('your-project') ||
    val.includes('3m3m3') ||
    val === '[SENSITIVE]';

  let supabaseUrl = process.env.SUPABASE_URL;
  if (isInvalid(supabaseUrl)) {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  // Privileged key only: new secret key, else legacy service_role.
  // Deliberately NO fallback to publishable/anon keys.
  let secretKey = process.env.SUPABASE_SECRET_KEY;
  if (isInvalid(secretKey)) {
    secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  if (isInvalid(supabaseUrl) || isInvalid(secretKey)) {
    return null;
  }

  return createSupabaseClient(supabaseUrl!, secretKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = createAdminClient();
    if (!client) {
      throw new Error(
        "Supabase admin client is not configured: set SUPABASE_URL and SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)."
      );
    }
    const val = Reflect.get(client, prop, receiver);
    return typeof val === "function" ? val.bind(client) : val;
  },
});

export default supabaseAdmin;
