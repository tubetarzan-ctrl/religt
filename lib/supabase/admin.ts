import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — server-only, bypasses RLS. Never import into client components.
// Not parameterized with Database — see lib/supabase/client.ts for why.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
