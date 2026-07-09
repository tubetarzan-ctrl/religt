"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addReviewManually, type AddReviewState } from "@/lib/actions/admin-reviews";
import { allLandingSlugs } from "@/lib/content/verticals";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Adding..." : "Add Review"}
    </Button>
  );
}

export function AddReviewDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(addReviewManually, { status: "idle" } as AddReviewState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-brand-primary hover:bg-brand-primary/90">Add Review</Button>} />
      <DialogContent className="border-white/10 bg-brand-bg-elevated">
        <DialogHeader>
          <DialogTitle className="text-brand-text">Add Review Manually</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {state.status === "error" && (
            <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{state.message}</p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="landing_page_slug">Landing Page</Label>
            <select
              id="landing_page_slug"
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
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input id="customer_name" name="customer_name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="text_content">Review Text</Label>
            <Textarea id="text_content" name="text_content" rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="youtube_video_id">YouTube Video ID (unlisted, optional)</Label>
            <Input id="youtube_video_id" name="youtube_video_id" placeholder="e.g. dQw4w9WgXcQ" />
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
