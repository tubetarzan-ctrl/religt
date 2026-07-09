import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/marketing/fade-in";
import type { Vertical } from "@/types/database";

interface DisplayCard {
  id: string;
  monthLabel: string | null;
  title: string;
  narrative: string;
  ratingLabel: string | null;
}

// Matches the prototype's fixed 3-card gradient variety (.past-card / :nth-child).
const CARD_BACKGROUNDS = [
  "linear-gradient(160deg, var(--hero-g1), var(--hero-g2))",
  "linear-gradient(160deg, #4A3A10, #C9A24B)",
  "linear-gradient(160deg, #2C3E50, #546E7A)",
];

// Section 5.5: curated past_group_cards take display priority; auto past
// tour_events backfill if there are fewer than 3 curated cards for this page.
export async function PastTrips({ vertical, slug }: { vertical: Vertical; slug: string }) {
  const supabase = await createClient();

  const [{ data: curated }, { data: autoEvents }] = await Promise.all([
    supabase
      .from("past_group_cards")
      .select("*")
      .eq("landing_page_slug", slug)
      .eq("visible", true)
      .order("sort_order", { ascending: true })
      .limit(3),
    supabase
      .from("tour_events")
      .select("*")
      .eq("vertical", vertical)
      .eq("status", "past")
      .order("end_date", { ascending: false })
      .limit(3),
  ]);

  const cards: DisplayCard[] = (curated ?? []).map((c) => ({
    id: c.id,
    monthLabel: c.month_label,
    title: c.title,
    narrative: c.narrative ?? "",
    ratingLabel: c.rating_label,
  }));

  if (cards.length < 3) {
    for (const event of autoEvents ?? []) {
      if (cards.length >= 3) break;
      cards.push({
        id: event.id,
        monthLabel: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(event.end_date)),
        title: event.title,
        narrative: `${event.seats_booked} travelers · ${event.duration_days ?? "—"} days, guided by ${event.guide_name ?? "our senior team"}.`,
        ratingLabel: null,
      });
    }
  }

  if (cards.length === 0) return null;

  return (
    <section id="past-trips" className="bg-bg py-[88px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
            Past groups · Our track record
          </p>
          <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
            Every group came home with stories, not complaints.
          </h2>
        </FadeIn>
        <div className="mt-11 grid gap-6 sm:grid-cols-3">
          {cards.map((card, i) => (
            <FadeIn key={card.id} delay={i * 0.08}>
              <div className="relative flex h-[340px] items-end overflow-hidden rounded-2xl shadow-card">
                <div className="absolute inset-0" style={{ background: CARD_BACKGROUNDS[i % 3] }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-black/90" />
                <div className="relative p-6">
                  {card.monthLabel && (
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{card.monthLabel}</p>
                  )}
                  <h3 className="mt-2 mb-1.5 font-heading text-xl text-white">{card.title}</h3>
                  <p className="text-sm text-[#D5E2DD]">{card.narrative}</p>
                  {card.ratingLabel && (
                    <span className="mt-3 inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-bold text-white backdrop-blur-sm">
                      {card.ratingLabel}
                    </span>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
