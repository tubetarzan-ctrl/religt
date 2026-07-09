import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroCarousel, type CarouselTour } from "@/components/marketing/hero-carousel";
import { createClient } from "@/lib/supabase/server";
import type { VerticalContent } from "@/lib/content/verticals";

function deriveTag(seatsLeft: number, capacity: number, earlyBirdDeadline: string | null) {
  if (earlyBirdDeadline && new Date(earlyBirdDeadline) > new Date()) return "🌟 Early Bird";
  if (capacity > 0 && seatsLeft / capacity <= 0.25) return "🔥 Filling Fast";
  return "✓ Verified Departure";
}

// Section 5.3: hero always shows the two-column layout — headline/CTAs/trust
// stats on the left, an auto-rotating carousel of featured tours on the right.
// Fetches its own data so every vertical page gets this without extra wiring.
export async function Hero({ content }: { content: VerticalContent }) {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("tour_events")
    .select("*")
    .eq("vertical", content.vertical)
    .eq("status", "upcoming")
    .eq("featured", true)
    .order("start_date", { ascending: true })
    .limit(5);

  const tours: CarouselTour[] = (events ?? []).map((event) => {
    const seatsLeft = Math.max(0, event.capacity - event.seats_booked);
    return {
      id: event.id,
      slug: event.slug,
      title: event.title,
      tag: deriveTag(seatsLeft, event.capacity, event.early_bird_deadline),
      priceAmount: event.price_amount,
      currency: event.currency,
      priceSub: "per person · quad sharing",
      seatsLabel: seatsLeft > 0 ? `${seatsLeft} seats left` : "Waitlist only",
      posterUrl: event.poster_image_url,
    };
  });

  return (
    <header
      className="relative overflow-hidden text-white"
      style={{ background: "linear-gradient(160deg, var(--hero-g1) 0%, var(--hero-g2) 55%, var(--hero-g3) 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A24B' stroke-opacity='.14'%3E%3Cpath d='M60 6l14 26 30 6-22 22 4 30-26-14-26 14 4-30L16 38l30-6z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
            <span className="h-px w-6 bg-accent" />
            {content.heroEyebrow}
          </p>
          <h1 className="font-heading text-4xl leading-tight text-white sm:text-5xl lg:text-[56px]">
            {content.heroTitle}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-hero-text">{content.heroSubtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-accent px-7 text-on-accent hover:brightness-95">
              <Link href="#departures">{content.heroCtaPrimary}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-transparent px-7 text-white hover:bg-white/10"
            >
              <Link href="#past-trips">{content.heroCtaSecondary}</Link>
            </Button>
          </div>

          <dl className="mt-10 flex flex-wrap gap-8">
            {content.trustBar.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-2xl text-accent">{stat.value}</dd>
                <dd className="text-xs text-hero-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          {tours.length > 0 ? (
            <HeroCarousel tours={tours} />
          ) : (
            <div className="rounded-2xl border border-white/15 bg-black/20 p-8 text-center text-sm text-hero-muted">
              Departure details coming soon — message us on WhatsApp for the next available group.
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
