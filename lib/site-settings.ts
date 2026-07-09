import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_THEME, THEME_IDS } from "@/lib/themes";

/** Server-side read of the active public-site theme — used in the root layout so
 * <body data-theme="..."> renders correctly on the very first paint, no flash.
 * Deliberately uses the cookie-free admin client (site_settings is public,
 * RLS-readable data anyway) so this lookup doesn't invoke cookies() and force
 * every route in the app dynamic — see Section 4, cost item 8 (ISR). */
export async function getActiveTheme(): Promise<string> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", "active_theme").maybeSingle();
    const value = data?.value as string | undefined;
    return value && THEME_IDS.includes(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}
