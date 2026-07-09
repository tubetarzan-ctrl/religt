"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { THEME_IDS } from "@/lib/themes";

export async function applyTheme(themeId: string) {
  if (!THEME_IDS.includes(themeId)) throw new Error("Unknown theme");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  await admin
    .from("site_settings")
    .upsert({ key: "active_theme", value: themeId, updated_by: user.id, updated_at: new Date().toISOString() });

  // Section 5.4, item 4: re-renders every page instantly under the new theme.
  revalidatePath("/", "layout");
}

export async function updateVerticalTileImage(slug: string, imageUrl: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const { data: existing } = await admin.from("site_settings").select("value").eq("key", "vertical_tile_images").maybeSingle();
  const current = (existing?.value as Record<string, string> | undefined) ?? {};
  const next = { ...current, [slug]: imageUrl };

  await admin
    .from("site_settings")
    .upsert({ key: "vertical_tile_images", value: next, updated_by: user.id, updated_at: new Date().toISOString() });

  revalidatePath("/", "layout");
}

export async function updateAnnouncementBar(text: string) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Announcement text can't be empty");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  await admin
    .from("site_settings")
    .upsert({ key: "announcement_bar_text", value: trimmed, updated_by: user.id, updated_at: new Date().toISOString() });

  revalidatePath("/", "layout");
}
