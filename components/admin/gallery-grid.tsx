"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleGalleryImageVisibility, deleteGalleryImage } from "@/lib/actions/admin-gallery";

export function GalleryGrid({ images }: { images: any[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {images.map((image) => (
        <div key={image.id} className="space-y-2">
          <div className="relative aspect-square overflow-hidden rounded-brand bg-brand-bg-elevated">
            <Image src={image.image_url} alt={image.category ?? ""} fill sizes="200px" className="object-cover" />
          </div>
          <p className="truncate text-xs text-brand-text-muted">{image.landing_page_slug}</p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await toggleGalleryImageVisibility(image.id, !image.visible);
                  toast.success(image.visible ? "Hidden" : "Shown");
                })
              }
            >
              {image.visible ? "Hide" : "Show"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await deleteGalleryImage(image.id);
                  toast.success("Deleted");
                })
              }
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
