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
