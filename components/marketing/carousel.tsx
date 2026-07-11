"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function cardStep(el: HTMLDivElement) {
  const first = el.firstElementChild;
  return first instanceof HTMLElement ? first.offsetWidth + 24 : 320;
}

/** Generic horizontally-scrollable carousel: auto-rotates every ~2.8s,
 * pauses on hover/touch, plus manual prev/next arrows. Each child is
 * responsible for its own width (e.g. w-[320px]) — this just handles
 * snap-scroll + rotation, layout-agnostic otherwise. */
export function Carousel({ items }: { items: ReactNode[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const interval = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + cardStep(el), behavior: "smooth" });
    }, 2800);
    return () => clearInterval(interval);
  }, [paused, items.length]);

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
        {items.map((item, i) => (
          <div key={i} className="shrink-0 snap-start">
            {item}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
