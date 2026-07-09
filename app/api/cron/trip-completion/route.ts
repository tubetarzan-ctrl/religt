import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { postTripCompletionRevenue } from "@/lib/accounting/auto-posting";

export const dynamic = "force-dynamic";

// Section 7.4 / 12: once event_date passes, recognize Unearned Revenue -> Revenue
// for on_completion verticals. Runs daily; idempotent per tour_event (see
// postTripCompletionRevenue's existing-entry guard).
export async function GET(request: NextRequest) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  const admin = createAdminClient();
  const { data: pastEvents } = await admin.from("tour_events").select("id, title").eq("status", "past");

  const results: { tourEventId: string; posted: boolean }[] = [];
  for (const event of pastEvents ?? []) {
    try {
      const entryId = await postTripCompletionRevenue(event.id);
      results.push({ tourEventId: event.id, posted: Boolean(entryId) });
    } catch (err) {
      console.error(`Trip completion posting failed for ${event.id}:`, err);
      results.push({ tourEventId: event.id, posted: false });
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
