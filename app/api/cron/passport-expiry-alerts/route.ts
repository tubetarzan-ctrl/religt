import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Section 13.1: flag any traveler whose passport expires within 6 months of their
// tour_event's start_date — a common visa-rejection cause. Surfaces via audit_log
// for now; wire to an admin notification/email once that channel exists.
export async function GET(request: NextRequest) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  const admin = createAdminClient();

  const { data: travelers } = await admin
    .from("travelers")
    .select("id, full_name, passport_expiry, bookings(tour_events(title, start_date))")
    .not("passport_expiry", "is", null);

  const flagged: { travelerId: string; name: string; passportExpiry: string; tourTitle: string }[] = [];

  for (const traveler of (travelers ?? []) as any[]) {
    const startDate = traveler.bookings?.tour_events?.start_date;
    if (!startDate || !traveler.passport_expiry) continue;

    const sixMonthsBeforeExpiry = new Date(traveler.passport_expiry);
    sixMonthsBeforeExpiry.setMonth(sixMonthsBeforeExpiry.getMonth() - 6);

    if (new Date(startDate) >= sixMonthsBeforeExpiry) {
      flagged.push({
        travelerId: traveler.id,
        name: traveler.full_name,
        passportExpiry: traveler.passport_expiry,
        tourTitle: traveler.bookings?.tour_events?.title ?? "unknown",
      });
    }
  }

  if (flagged.length > 0) {
    await admin.from("audit_log").insert({
      action: "passport_expiry.flagged",
      entity_type: "travelers",
      after_state: { flagged },
    });
  }

  return NextResponse.json({ ok: true, flaggedCount: flagged.length, flagged });
}
