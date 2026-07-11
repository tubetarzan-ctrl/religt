"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function PastTripCard({
  title,
  narrative,
  monthLabel,
  ratingLabel,
  coverImageUrl,
  youtubeVideoId,
  background,
}: {
  title: string;
  narrative: string;
  monthLabel: string | null;
  ratingLabel: string | null;
  coverImageUrl: string | null;
  youtubeVideoId: string | null;
  background: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing && youtubeVideoId) {
    return (
      <div className="h-[340px] w-[280px] overflow-hidden rounded-2xl shadow-card sm:w-[320px]">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  const imageSrc = youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : coverImageUrl;

  return (
    <button
      type="button"
      onClick={() => youtubeVideoId && setPlaying(true)}
      className="relative flex h-[340px] w-[280px] items-end overflow-hidden rounded-2xl text-left shadow-card sm:w-[320px]"
    >
      {imageSrc ? (
        <Image src={imageSrc} alt={title} fill sizes="320px" className="object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-black/90" />
      {youtubeVideoId && (
        <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90">
          <Play className="h-4 w-4 fill-current text-black" />
        </span>
      )}
      <div className="relative p-6">
        {monthLabel && <p className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{monthLabel}</p>}
        <h3 className="mt-2 mb-1.5 font-heading text-xl text-white">{title}</h3>
        <p className="text-sm text-[#D5E2DD]">{narrative}</p>
        {ratingLabel && (
          <span className="mt-3 inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-bold text-white backdrop-blur-sm">
            {ratingLabel}
          </span>
        )}
      </div>
    </button>
  );
}
