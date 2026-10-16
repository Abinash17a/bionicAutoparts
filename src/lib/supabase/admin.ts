// src/lib/supabase/admin.ts
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

  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (isInvalid(serviceRoleKey)) {
    serviceRoleKey = process.env.SUPABASE_ANON_KEY;
  }
  if (isInvalid(serviceRoleKey)) {
    serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  if (isInvalid(supabaseUrl) || isInvalid(serviceRoleKey)) {
    return null;
  }

  return createSupabaseClient(supabaseUrl!, serviceRoleKey!, {
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
      throw new Error("Supabase admin client is not configured or missing valid credentials.");
    }
    const val = Reflect.get(client, prop, receiver);
    return typeof val === "function" ? val.bind(client) : val;
  },
});

export default supabaseAdmin;
