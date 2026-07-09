"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { addGalleryImage } from "@/lib/actions/admin-gallery";
import { allLandingSlugs } from "@/lib/content/verticals";

const CATEGORIES = ["hotel", "shrine", "group_photo"];

export function GalleryUploader() {
  const [slug, setSlug] = useState(allLandingSlugs[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-brand border border-white/10 bg-brand-bg-elevated p-4">
      <Select value={slug} onValueChange={(v) => v && setSlug(v)}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allLandingSlugs.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={category} onValueChange={(v) => v && setCategory(v)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <UploadButton
        endpoint="galleryImage"
        onClientUploadComplete={async (res) => {
          for (const file of res) {
            await addGalleryImage(slug, category, file.url);
          }
          toast.success(`${res.length} image(s) added to gallery`);
        }}
        onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`); }}
      />
    </div>
  );
}
