"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function GalleryVideoTile({ videoId, label }: { videoId: string; label: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={label}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className="relative h-full w-full">
      <Image src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={label} fill sizes="25vw" className="object-cover" />
      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
          <Play className="h-5 w-5 fill-current text-black" />
        </span>
      </span>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-black/55" />
      <span className="absolute bottom-3.5 left-3.5 text-[13px] font-semibold text-white">{label}</span>
    </button>
  );
}
