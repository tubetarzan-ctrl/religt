import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/marketing/fade-in";
import { Carousel } from "@/components/marketing/carousel";
import type { Vertical } from "@/types/database";

const DEFAULT_INCLUSIONS = ["Visa", "Flights", "Hotels", "All meals", "Guide", "Transport"];

function formatDateRange(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt.format(new Date(start))} — ${fmt.format(new Date(end))}`;
}

function badgeFor(seatsLeft: number, capacity: number) {
  if (capacity > 0 && seatsLeft / capacity <= 0.2) return { label: "Filling Fast", hot: true };
  return { label: "Verified Departure", hot: false };
}

function DepartureCard({ event }: { event: any }) {
  const seatsLeft = Math.max(0, event.capacity - event.seats_booked);
  const pctBooked = event.capacity > 0 ? Math.min(100, (event.seats_booked / event.capacity) * 100) : 0;
  const badge = badgeFor(seatsLeft, event.capacity);
  return (
    <div className="flex h-full w-[320px] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all hover:-translate-y-1.5 hover:shadow-card-lg sm:w-[340px]">
      <div
        className="relative h-[190px]"
        style={event.poster_image_url ? undefined : { background: "linear-gradient(35deg, var(--hero-g1), var(--hero-g3))" }}
      >
        {event.poster_image_url && (
          <Image src={event.poster_image_url} alt={event.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
        )}
        <span
          className={`absolute left-3.5 top-3.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide ${
            badge.hot ? "bg-[#C0392B] text-white" : "bg-accent text-on-accent"
          }`}
        >
          {badge.label}
        </span>
        <span className="absolute bottom-3 left-3 w-max rounded-md bg-black/35 px-2.5 py-1.5 text-xs text-white/85">
          {event.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <span className="text-xs font-bold uppercase tracking-[0.06em] text-accent-ink">
          {formatDateRange(event.start_date, event.end_date)}
        </span>
        <h3 className="mt-2 mb-1.5 font-heading text-xl text-ink">{event.title}</h3>
        <div className="mb-3.5 flex flex-wrap gap-4 text-[13.5px] text-ink-soft">
          <span>📅 {event.duration_days ?? "—"} days</span>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {DEFAULT_INCLUSIONS.map((inc) => (
            <span key={inc} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              {inc}
            </span>
          ))}
        </div>
        <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full"
            style={{ width: `${pctBooked}%`, background: "linear-gradient(90deg, var(--accent), #B03A2E)" }}
          />
        </div>
        <p className="mb-4 text-xs font-bold text-[#C0564A]">
          {event.seats_booked} of {event.capacity} seats booked — {seatsLeft} left
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-dashed border-line pt-4">
          <div>
            <p className="font-heading text-xl font-extrabold text-primary">
              {formatMoney(event.price_amount, event.currency)}
            </p>
            <small className="text-xs text-ink-soft">quad sharing · p.p.</small>
          </div>
          <Button asChild className="rounded-full bg-primary text-on-primary hover:bg-primary-dark">
            <Link href={`/book/${encodeURIComponent(event.slug)}`}>Reserve</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export async function UpcomingDepartures({ vertical }: { vertical: Vertical }) {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("tour_events")
    .select("*")
    .eq("vertical", vertical)
    .eq("status", "upcoming")
    .order("start_date", { ascending: true })
    .limit(20);

  return (
    <section id="departures" className="bg-surface py-[88px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
                Upcoming departures
              </p>
              <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
                Confirmed groups. Real dates. Live seat availability.
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-full border-[1.5px] border-primary text-primary hover:bg-primary-soft">
              <Link href="#inquiry">Ask about a custom group →</Link>
            </Button>
          </div>
        </FadeIn>

        {!events || events.length === 0 ? (
          <p className="mt-10 text-ink-soft">
            No departures currently open for booking — message us on WhatsApp for the next available date.
          </p>
        ) : events.length > 3 ? (
          <FadeIn className="mt-11">
            <Carousel items={events.map((event) => <DepartureCard key={event.id} event={event} />)} />
          </FadeIn>
        ) : (
          <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <FadeIn key={event.id} delay={i * 0.06}>
                <DepartureCard event={event} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
