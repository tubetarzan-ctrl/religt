import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/money";

const VERTICAL_LABEL: Record<string, string> = {
  iraq_ziarat: "Iraq Ziarat",
  iran_ziarat: "Iran Ziarat",
  umrah: "Umrah",
  air_ticket: "Air Ticket",
  visa: "Visa",
  sunni_group: "Sunni Group Tour",
};

/**
 * Regenerates the auto-synced chatbot_knowledge rows for one tour event
 * (price, dates, seats left, guide, itinerary length). Called after any
 * create/update of a tour event, and after any booking change that moves
 * seats_booked, so the bot never quotes stale seat counts or prices.
 *
 * Delete-then-reinsert instead of upsert: the set of facts worth knowing
 * about an event changes (e.g. guide added later), so there's no fixed key
 * to upsert against — easier to regenerate the whole batch from scratch.
 */
export async function syncTourEventKnowledge(tourEventId: string) {
  const admin = createAdminClient();

  const { data: event } = await admin.from("tour_events").select("*").eq("id", tourEventId).single();

  await admin
    .from("chatbot_knowledge")
    .delete()
    .eq("tour_event_id", tourEventId)
    .eq("source", "tour_event_sync");

  if (!event) return;

  const seatsLeft = Math.max(0, event.capacity - event.seats_booked);
  const verticalLabel = VERTICAL_LABEL[event.vertical] ?? event.vertical;
  const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const entries: { question_pattern: string; answer: string }[] = [];

  entries.push({
    question_pattern: `${event.title} ${verticalLabel} price cost fee package how much tour`,
    answer:
      `${event.title} (${verticalLabel}) costs ${formatMoney(event.price_amount, event.currency)} per person` +
      (event.early_bird_price
        ? `, with an early-bird price of ${formatMoney(event.early_bird_price, event.currency)} if booked before ${dateFmt.format(new Date(event.early_bird_deadline ?? event.start_date))}.`
        : "."),
  });

  entries.push({
    question_pattern: `${event.title} ${verticalLabel} date schedule when departure return start end tour upcoming`,
    answer:
      `${event.title} departs on ${dateFmt.format(new Date(event.start_date))} and returns on ${dateFmt.format(new Date(event.end_date))}` +
      (event.duration_days ? ` (${event.duration_days} days).` : "."),
  });

  entries.push({
    question_pattern: `${event.title} ${verticalLabel} seats available spots left capacity full booked tour`,
    answer:
      seatsLeft > 0
        ? `${event.title} currently has ${seatsLeft} seat(s) left out of ${event.capacity}.`
        : `${event.title} is currently fully booked. Please ask about our next available departure or the waitlist.`,
  });

  if (event.guide_name) {
    entries.push({
      question_pattern: `${event.title} guide scholar alim leader who`,
      answer: `${event.title} is guided by ${event.guide_name}${event.guide_bio ? ` — ${event.guide_bio}` : "."}`,
    });
  }

  if (event.price_single_sharing || event.price_triple_sharing || event.price_quad_sharing) {
    const parts: string[] = [];
    if (event.price_single_sharing) parts.push(`single sharing: ${formatMoney(event.price_single_sharing, event.currency)}`);
    if (event.price_triple_sharing) parts.push(`triple sharing: ${formatMoney(event.price_triple_sharing, event.currency)}`);
    if (event.price_quad_sharing) parts.push(`quad sharing: ${formatMoney(event.price_quad_sharing, event.currency)}`);
    entries.push({
      question_pattern: `${event.title} room sharing single double triple quad price`,
      answer: `Room-sharing prices for ${event.title} — ${parts.join(", ")}.`,
    });
  }

  await admin.from("chatbot_knowledge").insert(
    entries.map((e) => ({
      ...e,
      vertical: event.vertical,
      tour_event_id: tourEventId,
      source: "tour_event_sync" as const,
      hit_count: 0,
    }))
  );
}

/** Booking changes move seats_booked (via DB trigger) — re-sync that event's
 * knowledge so "seats left" stays accurate without touching other facts. */
export async function syncKnowledgeForBooking(bookingId: string) {
  const admin = createAdminClient();
  const { data: booking } = await admin.from("bookings").select("tour_event_id").eq("id", bookingId).single();
  if (booking?.tour_event_id) {
    await syncTourEventKnowledge(booking.tour_event_id);
  }
}
