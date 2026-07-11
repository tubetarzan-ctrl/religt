"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoReviewCard, TextReviewCard } from "@/components/marketing/review-card";

export interface ReviewCardData {
  id: string;
  kind: "video" | "text";
  rating: number;
  text: string;
  name: string;
  meta: string;
  youtubeVideoId?: string;
}

function cardStep(el: HTMLDivElement) {
  const first = el.firstElementChild;
  return first instanceof HTMLElement ? first.offsetWidth + 24 : 320;
}

export function ReviewsCarousel({ cards }: { cards: ReviewCardData[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || cards.length <= 1) return;
    const interval = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + cardStep(el), behavior: "smooth" });
    }, 2800);
    return () => clearInterval(interval);
  }, [paused, cards.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * cardStep(el), behavior: "smooth" });
  };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <div key={card.id} className="w-[85%] shrink-0 snap-start sm:w-[360px]">
            {card.kind === "video" && card.youtubeVideoId ? (
              <VideoReviewCard title={`Watch: ${card.name}'s experience`} meta={card.meta} youtubeVideoId={card.youtubeVideoId} />
            ) : (
              <TextReviewCard rating={card.rating} text={card.text} name={card.name} meta={card.meta} />
            )}
          </div>
        ))}
      </div>
      {cards.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
