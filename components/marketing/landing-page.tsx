import { Hero } from "@/components/marketing/hero";
import { FeatureStrip } from "@/components/marketing/feature-strip";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { UpcomingDepartures } from "@/components/marketing/upcoming-departures";
import { MoodSection } from "@/components/marketing/mood-section";
import { PastTrips } from "@/components/marketing/past-trips";
import { Testimonials } from "@/components/marketing/testimonials";
import { GallerySection } from "@/components/marketing/gallery-section";
import { WhyUs } from "@/components/marketing/why-us";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FadeIn } from "@/components/marketing/fade-in";
import type { VerticalContent } from "@/lib/content/verticals";

export function LandingPage({
  content,
  children,
}: {
  content: VerticalContent;
  /** Vertical-specific blocks rendered directly below the hero — e.g. Sunni Group Tours' package builder. */
  children?: React.ReactNode;
}) {
  return (
    <>
      <Hero content={content} />
      <FeatureStrip />
      {children}
      <FadeIn>
        <ProblemSolution items={content.problemSolution} />
      </FadeIn>
      <UpcomingDepartures vertical={content.vertical} />
      <MoodSection quote={content.moodQuote} videoId={content.moodVideoYoutubeId} />
      <PastTrips vertical={content.vertical} slug={content.slug} />
      <Testimonials slug={content.slug} />
      <GallerySection slug={content.slug} />
      <WhyUs items={content.whyUs} />
      <FaqSection items={content.faq} />
      <CtaSection vertical={content.vertical} />
    </>
  );
}
