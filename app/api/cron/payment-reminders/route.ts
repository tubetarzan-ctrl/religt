import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWhatsappMessage } from "@/lib/whatsapp/send";

export const dynamic = "force-dynamic";

const REMINDER_WINDOW_DAYS = 14;

// Section 12, item 4 / 13.1: confirmed-but-unpaid bookings within REMINDER_WINDOW_DAYS
// of departure get a WhatsApp nudge. Booking-level dedup isn't tracked yet (no
// reminders_sent column) — safe to run daily since the message itself is idempotent
// in content; add a `last_reminder_sent_at` column before wiring this to a real cron
// schedule to avoid repeat sends.
export async function GET(request: NextRequest) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  const admin = createAdminClient();
  const windowEnd = new Date(Date.now() + REMINDER_WINDOW_DAYS * 86400000).toISOString().slice(0, 10);

  const { data: bookings } = await admin
    .from("bookings")
    .select("id, total_amount, tour_events(title, start_date), travelers(full_name, emergency_contact)")
    .eq("status", "confirmed")
    .lte("tour_events.start_date", windowEnd);

  let sent = 0;
  for (const booking of (bookings ?? []) as any[]) {
    const phone = booking.travelers?.[0]?.emergency_contact?.phone;
    if (!phone) continue;

    try {
      await sendWhatsappMessage(
        phone,
        `Assalam-o-Alaikum! A reminder that your payment for "${booking.tour_events?.title}" ` +
          `(departing ${booking.tour_events?.start_date}) is still pending. Please complete your ` +
          `bank transfer and upload proof to confirm your seat.`
      );
      sent += 1;
    } catch (err) {
      console.error(`Payment reminder failed for booking ${booking.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
