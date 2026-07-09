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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { submitReview, markGoogleReviewPrompted, type ReviewSubmissionState } from "@/lib/actions/reviews";

const initialReviewState: ReviewSubmissionState = { status: "idle" };
import { UploadButton } from "@/lib/uploadthing";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Submitting..." : "Submit Review"}
    </Button>
  );
}

function GoogleReviewPrompt({
  reviewText,
  landingPageSlug,
  customerPhone,
}: {
  reviewText: string;
  landingPageSlug: string;
  customerPhone: string;
}) {
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PLACE_ID;
  const googleUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : null;

  const handleClick = async () => {
    await navigator.clipboard.writeText(reviewText);
    await markGoogleReviewPrompted(landingPageSlug, customerPhone);
    if (googleUrl) window.open(googleUrl, "_blank", "noopener,noreferrer");
    toast.success("Review copied — paste it into the Google review box that just opened.");
  };

  return (
    <div className="space-y-3 rounded-brand border border-brand-accent/30 bg-brand-accent/10 p-4">
      <p className="text-sm text-brand-text">
        Thank you! Would you also share this on Google? It helps other travelers find us.
      </p>
      <p className="rounded-md bg-brand-bg/60 p-3 text-xs text-brand-text-muted">{reviewText}</p>
      <Button type="button" onClick={handleClick} className="w-full bg-brand-accent text-brand-bg hover:bg-brand-accent/90">
        Copy & Open Google Reviews
      </Button>
    </div>
  );
}

export function ReviewSubmissionDialog({
  landingPageSlug,
  tourEvents,
}: {
  landingPageSlug: string;
  tourEvents: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [state, formAction] = useFormState(submitReview, initialReviewState);
  const [customerPhone, setCustomerPhone] = useState("");
  const [tourEventId, setTourEventId] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10">
            Share Your Experience
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-brand-bg-elevated">
        <DialogHeader>
          <DialogTitle className="font-heading text-brand-text">Share Your Experience</DialogTitle>
        </DialogHeader>

        {state.status === "success" && state.reviewText ? (
          <GoogleReviewPrompt
            reviewText={state.reviewText}
            landingPageSlug={landingPageSlug}
            customerPhone={customerPhone}
          />
        ) : state.status === "pending" ? (
          <p className="rounded-md bg-brand-primary/15 px-3 py-2 text-sm text-brand-primary">{state.message}</p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="landing_page_slug" value={landingPageSlug} />
            <input type="hidden" name="rating" value={rating} />
            <input type="hidden" name="image_urls" value={imageUrls.join(",")} />
            <input type="hidden" name="tour_event_id" value={tourEventId} />

            {state.status === "error" && (
              <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{state.message}</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="customer_name">Name</Label>
                <Input id="customer_name" name="customer_name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer_phone">Phone</Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Which group/departure?</Label>
              <Select value={tourEventId} onValueChange={(value) => setTourEventId(value ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {tourEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <Star
                      className={`h-6 w-6 ${n <= rating ? "fill-brand-accent text-brand-accent" : "text-brand-text-muted"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="text_content">Your review</Label>
              <Textarea id="text_content" name="text_content" required rows={4} minLength={8} />
            </div>

            <div className="space-y-1.5">
              <Label>Photos (optional)</Label>
              <UploadButton
                endpoint="reviewMedia"
                onClientUploadComplete={(res) => {
                  setImageUrls((prev) => [...prev, ...res.map((f) => f.url)]);
                  toast.success(`${res.length} photo(s) uploaded`);
                }}
                onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`); }}
              />
              {imageUrls.length > 0 && (
                <p className="text-xs text-brand-text-muted">{imageUrls.length} photo(s) attached</p>
              )}
            </div>

            <SubmitButton />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
