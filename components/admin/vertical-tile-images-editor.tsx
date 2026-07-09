"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { updateVerticalTileImage } from "@/lib/actions/admin-appearance";

const VERTICAL_TILES = [
  { slug: "iraq-ziarat", label: "Iraq Ziarat" },
  { slug: "iran-ziarat", label: "Iran Ziarat" },
  { slug: "umrah", label: "Umrah" },
  { slug: "sunni-group-tours", label: "Sunni Group Tours" },
  { slug: "air-tickets", label: "Air Tickets" },
  { slug: "visas", label: "Visas" },
] as const;

export function VerticalTileImagesEditor({ images }: { images: Record<string, string> }) {
  const [current, setCurrent] = useState(images);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {VERTICAL_TILES.map((tile) => {
        const url = current[tile.slug] || `/images/verticals/${tile.slug}.jpg`;
        return (
          <div key={tile.slug} className="space-y-2 rounded-brand border border-white/10 bg-brand-bg p-3">
            <div className="relative h-28 w-full overflow-hidden rounded-md">
              <Image src={url} alt={tile.label} fill className="object-cover" />
            </div>
            <p className="text-sm font-semibold text-brand-text">{tile.label}</p>
            <UploadButton
              endpoint="galleryImage"
              content={{ button: <span>{pending ? "Saving..." : "Change Image"}</span> }}
              appearance={{
                button:
                  "w-full ut-ready:bg-brand-primary ut-uploading:bg-brand-primary/60 bg-brand-primary hover:bg-brand-primary/90 text-sm py-2 rounded-md",
                allowedContent: "hidden",
              }}
              onClientUploadComplete={(res) => {
                const newUrl = res[0]?.url;
                if (!newUrl) return;
                setCurrent((prev) => ({ ...prev, [tile.slug]: newUrl }));
                startTransition(async () => {
                  await updateVerticalTileImage(tile.slug, newUrl);
                  toast.success(`${tile.label} image updated`);
                });
              }}
              onUploadError={(error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
