"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { addGalleryImage, addGalleryVideo } from "@/lib/actions/admin-gallery";
import { allLandingSlugs } from "@/lib/content/verticals";

const CATEGORIES = ["hotel", "shrine", "group_photo"];

export function GalleryUploader() {
  const [slug, setSlug] = useState(allLandingSlugs[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [youtubeInput, setYoutubeInput] = useState("");
  const [pending, startTransition] = useTransition();

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
        onUploadError={(error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
      />
      <div className="flex items-center gap-2">
        <Input
          value={youtubeInput}
          onChange={(e) => setYoutubeInput(e.target.value)}
          placeholder="Paste YouTube URL or video ID"
          className="w-64"
        />
        <Button
          type="button"
          disabled={pending || !youtubeInput.trim()}
          className="bg-brand-primary hover:bg-brand-primary/90"
          onClick={() =>
            startTransition(async () => {
              try {
                await addGalleryVideo(slug, category, youtubeInput);
                setYoutubeInput("");
                toast.success("Video added to gallery");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Couldn't add that video");
              }
            })
          }
        >
          {pending ? "Adding..." : "Add Video"}
        </Button>
      </div>
    </div>
  );
}
