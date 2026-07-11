"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId } from "@/lib/youtube";

export async function approveReview(id: string) {
  const admin = createAdminClient();
  await admin.from("reviews").update({ moderation_status: "auto_published", published: true, flagged_reason: null }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function rejectReview(id: string) {
  const admin = createAdminClient();
  await admin.from("reviews").update({ moderation_status: "rejected", published: false }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function togglePublished(id: string, published: boolean) {
  const admin = createAdminClient();
  await admin.from("reviews").update({ published }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  const admin = createAdminClient();
  await admin.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function replyToReview(id: string, reply: string) {
  const admin = createAdminClient();
  await admin.from("reviews").update({ admin_reply: reply, admin_reply_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function retagReview(id: string, landingPageSlug: string, tourEventId: string | null) {
  const admin = createAdminClient();
  await admin
    .from("reviews")
    .update({ landing_page_slug: landingPageSlug, tour_event_id: tourEventId })
    .eq("id", id);
  revalidatePath("/admin/reviews");
}

export interface AddReviewState {
  status: "idle" | "error";
  message?: string;
}

export async function addReviewManually(
  _prevState: AddReviewState,
  formData: FormData
): Promise<AddReviewState> {
  const landingPageSlug = String(formData.get("landing_page_slug") ?? "");
  const customerName = String(formData.get("customer_name") ?? "");
  const rating = Number(formData.get("rating") ?? 5);
  const textContent = String(formData.get("text_content") ?? "");
  const youtubeInput = String(formData.get("youtube_video_id") ?? "").trim();
  const youtubeVideoId = youtubeInput ? extractYoutubeId(youtubeInput) : null;

  if (!landingPageSlug || !customerName) {
    return { status: "error", message: "Landing page and customer name are required." };
  }

  if (youtubeInput && !youtubeVideoId) {
    return { status: "error", message: "Couldn't recognize that YouTube link/ID — paste the full URL or just the 11-character video ID." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("reviews").insert({
    landing_page_slug: landingPageSlug,
    customer_name: customerName,
    rating,
    text_content: textContent || null,
    youtube_video_id: youtubeVideoId,
    video_status: youtubeVideoId ? "ready" : "none",
    source: "admin_added",
    moderation_status: "auto_published",
    published: true,
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/reviews");
  return { status: "idle" };
}
