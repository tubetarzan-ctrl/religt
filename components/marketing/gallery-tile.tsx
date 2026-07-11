"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useLightbox, type LightboxItem } from "@/components/lightbox";

export function GalleryTile({
  items,
  index,
  label,
}: {
  items: LightboxItem[];
  index: number;
  label: string;
}) {
  const { open } = useLightbox();
  const item = items[index];

  return (
    <button type="button" onClick={() => open(items, index)} className="relative flex h-full w-full items-end overflow-hidden p-3.5 text-left">
      <Image
        src={item.type === "youtube" ? `https://img.youtube.com/vi/${item.src}/hqdefault.jpg` : item.src}
        alt={label}
        fill
        sizes="25vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-black/55" />
      {item.type === "youtube" && (
        <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
          <Play className="h-4 w-4 fill-current text-black" />
        </span>
      )}
      <span className="relative text-[13px] font-semibold text-white">{label}</span>
    </button>
  );
}
