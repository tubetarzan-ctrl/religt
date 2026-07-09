"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SceneArt } from "@/components/marketing/scene-art";
import { formatMoney } from "@/lib/money";

export interface CarouselTour {
  id: string;
  slug: string;
  title: string;
  tag: string;
  priceAmount: number;
  currency: string;
  priceSub: string;
  seatsLabel: string;
  posterUrl: string | null;
}

const ROTATE_MS = 4000;

/**
 * Section 5.3: hero tour carousel. Auto-rotates every 4s, swapping poster,
 * badge, title, price, and seats together; a 4s progress bar animates under
 * the poster and restarts per slide. Dots/arrows let the visitor jump
 * directly to a tour (any manual interaction resets the timer). Pauses on
 * hover/touch-hold and respects prefers-reduced-motion (no auto-rotate, but
 * arrows/dots still work).
 */
export function HeroCarousel({ tours }: { tours: CarouselTour[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback((i: number) => {
    setIndex((i + tours.length) % tours.length);
    setProgressKey((k) => k + 1);
  }, [tours.length]);

  useEffect(() => {
    if (paused || reducedMotion || tours.length <= 1) return;
    timerRef.current = setInterval(() => goTo(index + 1), ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, tours.length, index, goTo]);

  if (tours.length === 0) return null;
  const tour = tours[index];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-6 -top-4 z-10 hidden items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-card-lg sm:flex">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-primary" />
        Verified departures live
      </div>

      <div
        className="rotate-[1.5deg] overflow-hidden rounded-2xl bg-surface text-ink shadow-card-lg"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <Link href={`/book/${encodeURIComponent(tour.slug)}`} className="block">
          <div className="relative h-56 sm:h-64">
            {tour.posterUrl ? (
              <Image src={tour.posterUrl} alt={tour.title} fill sizes="(max-width: 640px) 100vw, 480px" className="object-cover" />
            ) : (
              <SceneArt variant="skyline" className="h-full w-full" />
            )}
            <span className="absolute bottom-3 left-3 rounded-md bg-black/45 px-3 py-1.5 text-xs text-white">
              {tour.title}
            </span>
          </div>
          <div className="px-5 pb-2 pt-4">
            <Badge className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-ink hover:bg-accent-soft">
              {tour.tag}
            </Badge>
            <h3 className="mt-3 min-h-[52px] font-heading text-xl leading-snug text-ink">{tour.title}</h3>
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-line pt-3">
              <div>
                <p className="font-heading text-xl font-extrabold text-primary">
                  {formatMoney(tour.priceAmount, tour.currency)}
                </p>
                <small className="text-xs font-medium text-ink-soft">{tour.priceSub}</small>
              </div>
              <span className="whitespace-nowrap rounded-full bg-[#FDECEC] px-3 py-1.5 text-xs font-bold text-[#B03A2E]">
                {tour.seatsLabel}
              </span>
            </div>
          </div>
        </Link>

        {/* Progress bar — restarts on every slide change via the progressKey remount. */}
        <div className="h-[3px] bg-line">
          {!reducedMotion && !paused && (
            <div key={progressKey} className="h-full origin-left bg-accent" style={{ animation: `hero-carousel-progress ${ROTATE_MS}ms linear forwards` }} />
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex gap-2">
            {tours.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Show tour ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-accent" : "w-2.5 bg-line"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous tour"
              onClick={() => goTo(index - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next tour"
              onClick={() => goTo(index + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-4 -right-3 z-10 hidden max-w-[220px] items-center gap-2 rounded-xl bg-surface px-4 py-3 text-xs font-semibold text-ink shadow-card-lg sm:flex">
        💬 &ldquo;Best organized group, Alhamdulillah&rdquo;
      </div>

      <style>{`
        @keyframes hero-carousel-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
