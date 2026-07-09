import { createBrowserClient } from "@supabase/ssr";

// Not parameterized with Database: the installed postgrest-js version type-parses
// select() strings against a Relationships schema our hand-written types/database.ts
// doesn't carry. Regenerate real types once a live Supabase project exists
// (see the header comment in types/database.ts) and re-parameterize then.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
