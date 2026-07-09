import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookingFlow } from "@/components/marketing/booking-flow";
import { formatMoney } from "@/lib/money";

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("tour_events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!event) notFound();

  const seatsLeft = Math.max(0, event.capacity - event.seats_booked);

  return (
    <section className="bg-brand-bg py-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl text-brand-text">{event.title}</h1>
        <p className="mt-2 text-brand-text-muted">
          {formatMoney(event.price_amount, event.currency)} per person ·{" "}
          {seatsLeft > 0 ? `${seatsLeft} seats left` : "Waitlist only"}
        </p>
        <div className="mt-8">
          <BookingFlow event={event} />
        </div>
      </div>
    </section>
  );
}
