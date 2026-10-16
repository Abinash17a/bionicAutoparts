/**
 * Supabase client connection helper for Tony Beta 3.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export function getSupabaseClient(): SupabaseClient | null {
  return createAdminClient();
}
