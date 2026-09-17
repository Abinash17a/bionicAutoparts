// src/lib/supabase/admin.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

if (typeof window !== 'undefined') {
  throw new Error('Supabase admin client cannot be imported or executed in client-side bundles.');
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-service-key';

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = createAdminClient();
export default supabaseAdmin;
