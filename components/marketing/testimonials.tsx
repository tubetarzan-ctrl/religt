import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ReviewSubmissionDialog } from "@/components/marketing/review-submission-form";
import { VideoReviewCard, TextReviewCard } from "@/components/marketing/review-card";
import { FadeIn } from "@/components/marketing/fade-in";

export async function Testimonials({ slug }: { slug: string }) {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("landing_page_slug", slug)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(9);

  const { data: tourEvents } = await supabase
    .from("tour_events")
    .select("id, title")
    .eq("status", "upcoming");

  const allReviews = reviews ?? [];
  const videoReview = allReviews.find((r) => r.youtube_video_id && r.video_status === "ready");
  const textReviews = allReviews.filter((r) => r.id !== videoReview?.id).slice(0, videoReview ? 2 : 3);

  const ratings = allReviews.map((r) => r.rating ?? 5);
  const average = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : null;

  return (
    <section id="reviews" className="bg-surface py-[88px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
            Reviews from our travelers
          </p>
          <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
            Real people. Real groups. Video-verified reviews.
          </h2>
        </FadeIn>

        {allReviews.length === 0 ? (
          <p className="mt-10 text-ink-soft">Be the first to share your experience with this group.</p>
        ) : (
          <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videoReview && (
              <FadeIn>
                <VideoReviewCard
                  title={`Watch: ${videoReview.customer_name ?? "Traveler"}'s experience`}
                  meta="Video review"
                  youtubeVideoId={videoReview.youtube_video_id!}
                />
              </FadeIn>
            )}
            {textReviews.map((review, i) => (
              <FadeIn key={review.id} delay={i * 0.06}>
                <TextReviewCard
                  rating={review.rating ?? 5}
                  text={review.text_content ?? ""}
                  name={review.customer_name ?? "Verified traveler"}
                  meta={new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(review.created_at))}
                />
              </FadeIn>
            ))}
          </div>
        )}

        <FadeIn>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl border-[1.5px] border-dashed border-primary bg-primary-soft p-7">
            <div>
              <h3 className="font-heading text-[22px] text-ink">Traveled with us? Share your experience 🤲</h3>
              <p className="text-[14.5px] text-ink-soft">
                Post your review — with photos or a video — directly on this page. It appears instantly under your group.
              </p>
            </div>
            <ReviewSubmissionDialog landingPageSlug={slug} tourEvents={tourEvents ?? []} />
          </div>
        </FadeIn>

        {average !== null && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5 text-center text-[14.5px] font-bold text-ink-soft">
            <span className="text-[17px] font-extrabold">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
            rating <strong className="text-ink">{average.toFixed(1)}</strong>
            <span className="flex gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(average) ? "fill-current" : ""}`} />
              ))}
            </span>
            from {allReviews.length}+ verified reviews
          </div>
        )}
      </div>
    </section>
  );
}
