"use client";

import Image from "next/image";
import { useLightbox } from "@/components/lightbox";

export function DeparturePoster({ posterUrl, title }: { posterUrl: string; title: string }) {
  const { open } = useLightbox();

  return (
    <button
      type="button"
      onClick={() => open([{ type: "image", src: posterUrl, alt: title }])}
      className="absolute inset-0 h-full w-full"
    >
      <Image src={posterUrl} alt={title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
    </button>
  );
}
