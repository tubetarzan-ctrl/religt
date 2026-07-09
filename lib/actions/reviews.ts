"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { moderateReviewText } from "@/lib/moderation";

export interface ReviewSubmissionState {
  status: "idle" | "success" | "pending" | "error";
  message?: string;
  reviewText?: string;
}

export async function submitReview(
  _prevState: ReviewSubmissionState,
  formData: FormData
): Promise<ReviewSubmissionState> {
  const landingPageSlug = String(formData.get("landing_page_slug") ?? "");
  const customerName = String(formData.get("customer_name") ?? "").trim();
  const customerPhone = String(formData.get("customer_phone") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 5);
  const textContent = String(formData.get("text_content") ?? "").trim();
  const tourEventId = String(formData.get("tour_event_id") ?? "") || null;
  const imageUrlsRaw = String(formData.get("image_urls") ?? "");
  const imageUrls = imageUrlsRaw ? imageUrlsRaw.split(",").filter(Boolean) : [];

  if (!landingPageSlug || !customerName || !customerPhone || !textContent) {
    return { status: "error", message: "Name, phone, and review text are required." };
  }

  const moderation = moderateReviewText(textContent);

  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").insert({
    landing_page_slug: landingPageSlug,
    tour_event_id: tourEventId,
    customer_name: customerName,
    customer_phone: customerPhone,
    rating,
    text_content: textContent,
    image_urls: imageUrls,
    source: "customer_submitted",
    moderation_status: moderation.flagged ? "pending_review" : "auto_published",
    published: !moderation.flagged,
    flagged_reason: moderation.reason,
  });

  if (error) {
    return { status: "error", message: "Something went wrong submitting your review — please try again." };
  }

  if (moderation.flagged) {
    return {
      status: "pending",
      message: "Thank you! Your review is being reviewed by our team before it appears publicly.",
    };
  }

  return {
    status: "success",
    message: "Thank you! Your review is now live.",
    reviewText: textContent,
  };
}

export async function markGoogleReviewPrompted(reviewLandingSlug: string, customerPhone: string) {
  const supabase = createAdminClient();
  await supabase
    .from("reviews")
    .update({ google_review_prompted: true })
    .eq("landing_page_slug", reviewLandingSlug)
    .eq("customer_phone", customerPhone)
    .order("created_at", { ascending: false })
    .limit(1);
}
