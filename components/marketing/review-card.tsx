"use client";

import { useState } from "react";
import { Play, Star } from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function VideoReviewCard({ title, meta, youtubeVideoId }: { title: string; meta: string; youtubeVideoId: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-square overflow-hidden rounded-2xl shadow-card sm:aspect-auto sm:min-h-[280px]">
        <iframe
          className="h-full min-h-[280px] w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl p-6 text-center text-white shadow-card transition-transform hover:scale-[1.01]"
      style={{ background: "linear-gradient(140deg, var(--hero-g1), var(--hero-g3))" }}
    >
      <span className="mb-3.5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg">
        <Play className="h-6 w-6 fill-current" />
      </span>
      <strong className="text-white">{title}</strong>
      <em className="mt-1.5 block text-xs not-italic text-hero-muted">{meta}</em>
    </button>
  );
}

export function TextReviewCard({
  rating,
  text,
  name,
  meta,
}: {
  rating: number;
  text: string;
  name: string;
  meta: string;
}) {
  return (
    <div className="flex h-full flex-col gap-3.5 rounded-2xl border border-line bg-surface p-[26px] shadow-card">
      <div className="flex gap-0.5 text-accent-ink">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-[15px] text-ink">&ldquo;{text}&rdquo;</p>
      <div className="mt-auto flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-extrabold text-on-primary">
          {initials(name)}
        </div>
        <div>
          <strong className="block text-[14.5px] text-ink">{name}</strong>
          <span className="text-xs text-ink-soft">{meta}</span>
        </div>
      </div>
    </div>
  );
}
