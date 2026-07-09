import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireCronAuth } from "@/lib/cron-auth";
import { allLandingSlugs } from "@/lib/content/verticals";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Section 12, item 1: tour_events.status can't be a Postgres generated column
// (current_date isn't IMMUTABLE — see the trigger in 0001_core_tables.sql), so this
// cron does the daily past/upcoming sweep for events that age past their end_date
// with no write happening, then busts the ISR cache so the Upcoming/Past sections
// on each landing page pick up the change without waiting for the next natural
// revalidate window.
export async function GET(request: NextRequest) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: flipped } = await admin
    .from("tour_events")
    .update({ status: "past" })
    .eq("status", "upcoming")
    .lt("end_date", today)
    .select("id");

  revalidatePath("/");
  for (const slug of allLandingSlugs) {
    revalidatePath(`/${slug}`);
  }

  return NextResponse.json({ ok: true, statusFlipped: flipped?.length ?? 0, revalidated: allLandingSlugs.length + 1 });
}
