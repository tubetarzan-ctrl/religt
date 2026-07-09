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

const DEFAULT_ANNOUNCEMENT = "📢 Next Karbala group departs 14 Aug 2026 — only 6 seats left";

/** Same cookie-free admin-client pattern as getActiveTheme — read-only, RLS
 * lets anyone read site_settings, so this doesn't force dynamic rendering. */
export async function getAnnouncementBarText(): Promise<string> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", "announcement_bar_text").maybeSingle();
    const value = data?.value as string | undefined;
    return value || DEFAULT_ANNOUNCEMENT;
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

/** Admin-uploaded overrides for the 6 homepage vertical tiles, keyed by
 * vertical slug. Falls back to the bundled stock photo in /public when a
 * vertical has no override yet, so tiles never render blank. */
export async function getVerticalTileImages(): Promise<Record<string, string>> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", "vertical_tile_images").maybeSingle();
    return (data?.value as Record<string, string> | undefined) ?? {};
  } catch {
    return {};
  }
}
