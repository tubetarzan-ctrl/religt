import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/marketing/fade-in";
import { Carousel } from "@/components/marketing/carousel";
import { PastTripCard } from "@/components/marketing/past-trip-card";
import type { Vertical } from "@/types/database";

interface DisplayCard {
  id: string;
  monthLabel: string | null;
  title: string;
  narrative: string;
  ratingLabel: string | null;
  coverImageUrl: string | null;
  youtubeVideoId: string | null;
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
      .limit(20),
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
    coverImageUrl: c.cover_image_url,
    youtubeVideoId: c.youtube_video_id,
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
        coverImageUrl: event.poster_image_url,
        youtubeVideoId: null,
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
        {cards.length > 3 ? (
          <FadeIn className="mt-11">
            <Carousel
              items={cards.map((card, i) => (
                <PastTripCard
                  key={card.id}
                  title={card.title}
                  narrative={card.narrative}
                  monthLabel={card.monthLabel}
                  ratingLabel={card.ratingLabel}
                  coverImageUrl={card.coverImageUrl}
                  youtubeVideoId={card.youtubeVideoId}
                  background={CARD_BACKGROUNDS[i % 3]}
                />
              ))}
            />
          </FadeIn>
        ) : (
          <div className="mt-11 flex flex-wrap gap-6">
            {cards.map((card, i) => (
              <FadeIn key={card.id} delay={i * 0.08}>
                <PastTripCard
                  title={card.title}
                  narrative={card.narrative}
                  monthLabel={card.monthLabel}
                  ratingLabel={card.ratingLabel}
                  coverImageUrl={card.coverImageUrl}
                  youtubeVideoId={card.youtubeVideoId}
                  background={CARD_BACKGROUNDS[i % 3]}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
