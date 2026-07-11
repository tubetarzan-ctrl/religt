"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { createPastGroupCard, type PastGroupFormState } from "@/lib/actions/admin-past-groups";
import { allLandingSlugs } from "@/lib/content/verticals";

const RATING_OPTIONS = ["5.0", "4.9", "4.8", "4.7", "4.6", "4.5", "4.0", "3.5", "3.0", "2.0", "1.0"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Adding..." : "Add Past Group Card"}
    </Button>
  );
}

export function PastGroupForm({ tourEvents }: { tourEvents: { id: string; title: string }[] }) {
  const [state, formAction] = useFormState(createPastGroupCard, { status: "idle" } as PastGroupFormState);
  const [coverUrl, setCoverUrl] = useState("");
  const [rating, setRating] = useState("");

  return (
    <form action={formAction} className="grid gap-3 rounded-brand border border-border bg-brand-bg-elevated p-4 sm:grid-cols-2">
      {state.status === "error" && (
        <p className="col-span-2 rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{state.message}</p>
      )}
      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <input type="hidden" name="rating_label" value={rating ? `★ ${rating} group rating` : ""} />

      <div className="space-y-1.5">
        <Label>Landing Page</Label>
        <select
          name="landing_page_slug"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-brand-text"
        >
          {allLandingSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label>Link to Tour Event (optional)</Label>
        <select
          name="tour_event_id"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-brand-text"
        >
          <option value="">— none —</option>
          {tourEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="month_label">Month Label</Label>
        <Input id="month_label" name="month_label" placeholder="June 2026 · Group #47" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rating">Group Rating</Label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-ink"
        >
          <option value="">— no rating —</option>
          {RATING_OPTIONS.map((r) => (
            <option key={r} value={r}>
              ★ {r}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="narrative">Narrative (1-2 sentences)</Label>
        <Textarea id="narrative" name="narrative" rows={2} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input id="sort_order" name="sort_order" type="number" defaultValue={0} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="youtube_video_id">YouTube Video URL or ID (optional)</Label>
        <Input id="youtube_video_id" name="youtube_video_id" placeholder="e.g. https://youtu.be/dQw4w9WgXcQ or dQw4w9WgXcQ" />
      </div>

      <div className="space-y-1.5">
        <Label>Cover Image</Label>
        <UploadButton
          endpoint="galleryImage"
          content={{
            button: (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Cover
              </span>
            ),
            allowedContent: "Images up to 8MB, max 20",
          }}
          appearance={{
            button:
              "bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-primary/90 ut-uploading:bg-brand-primary/60 ut-readying:bg-brand-primary/60",
            allowedContent: "text-xs text-brand-text-muted",
            container: "items-start",
          }}
          onClientUploadComplete={(res) => {
            if (res[0]) {
              setCoverUrl(res[0].url);
              toast.success("Cover image uploaded");
            }
          }}
          onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`); }}
        />
        {coverUrl && <p className="text-xs text-brand-primary">Cover attached ✓</p>}
      </div>

      <div className="sm:col-span-2">
        <SubmitButton />
      </div>
    </form>
  );
}
