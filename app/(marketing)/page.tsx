import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureStrip } from "@/components/marketing/feature-strip";
import { WhyUs } from "@/components/marketing/why-us";
import { FadeIn } from "@/components/marketing/fade-in";
import { verticals, sunniGroupTours } from "@/lib/content/verticals";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "S.Religious Tours — Iraq & Iran Ziarat, Umrah, Sunni Group Tours, Visas",
  description:
    "Choose your journey: Shia-oriented Iraq & Iran Ziarat groups, Umrah packages, Sunni Group Tours, air tickets, and visa services — all with verified departures and transparent pricing.",
};

const allCards = [
  verticals["iraq-ziarat"],
  verticals["iran-ziarat"],
  verticals["umrah"],
  sunniGroupTours,
  verticals["air-tickets"],
  verticals["visas"],
];

export default function HomePage() {
  return (
    <>
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
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
            <span className="h-px w-6 bg-accent" />
            Islamic Ziarat · Umrah · Visas · Air Tickets
            <span className="h-px w-6 bg-accent" />
          </p>
          <h1 className="font-heading text-4xl leading-tight text-white sm:text-5xl lg:text-[56px]">
            Choose Your Journey
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-hero-text">
            Sect-appropriate Ziarat groups, transparent Umrah packages, and a dedicated Sunni Group Tours
            journey — verified departures, real reviews, zero hidden costs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-primary px-7 text-on-primary hover:bg-primary-dark">
              <Link href="/iraq-ziarat">Shia Ziarat Groups (Iraq &amp; Iran)</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-accent/60 bg-transparent px-7 text-accent hover:bg-white/10"
            >
              <Link href="/sunni-group-tours">Sunni Group Tours</Link>
            </Button>
          </div>
        </div>
      </header>

      <FeatureStrip />

      <section className="bg-surface py-[88px]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
              All Services
            </p>
            <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
              Every journey, one trusted operator
            </h2>
          </FadeIn>
          <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allCards.map((card, i) => (
              <FadeIn key={card.slug} delay={i * 0.05}>
                <Link
                  href={`/${card.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all hover:-translate-y-1.5 hover:shadow-card-lg"
                >
                  <div
                    className="flex h-[140px] items-end p-4"
                    style={{ background: "linear-gradient(35deg, var(--hero-g1), var(--hero-g3))" }}
                  >
                    <span className="rounded-md bg-black/35 px-2.5 py-1.5 text-xs text-white/85">
                      {card.heroEyebrow}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-xl text-ink group-hover:text-primary">{card.navLabel}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink-soft">{card.heroSubtitle}</p>
                    <span className="mt-4 text-sm font-bold text-primary">Explore →</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <WhyUs
        items={[
          { title: "WhatsApp AI Support", description: "Instant answers on pricing, visas, and departure dates — day or night." },
          { title: "Verified Payment Tracking", description: "Every bank transfer is verified and confirmed with a receipt." },
          { title: "Sect-Aware Itineraries", description: "Distinct Sunni and Shia itineraries — never cross-contaminated." },
          { title: "Video-Verified Reviews", description: "Real, unedited reviews from past groups, not just text testimonials." },
        ]}
      />
    </>
  );
}
