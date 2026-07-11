"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId } from "@/lib/youtube";

export interface PastGroupFormState {
  status: "idle" | "error";
  message?: string;
}

function parseForm(formData: FormData) {
  return {
    landing_page_slug: String(formData.get("landing_page_slug") ?? ""),
    tour_event_id: String(formData.get("tour_event_id") ?? "") || null,
    month_label: String(formData.get("month_label") ?? "") || null,
    title: String(formData.get("title") ?? ""),
    narrative: String(formData.get("narrative") ?? "") || null,
    rating_label: String(formData.get("rating_label") ?? "") || null,
    cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
    youtube_input: String(formData.get("youtube_video_id") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createPastGroupCard(
  _prevState: PastGroupFormState,
  formData: FormData
): Promise<PastGroupFormState> {
  const { youtube_input, ...values } = parseForm(formData);
  if (!values.landing_page_slug || !values.title) {
    return { status: "error", message: "Landing page and title are required." };
  }

  const youtubeVideoId = youtube_input ? extractYoutubeId(youtube_input) : null;
  if (youtube_input && !youtubeVideoId) {
    return { status: "error", message: "Couldn't recognize that YouTube link/ID — paste the full URL or just the 11-character video ID." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("past_group_cards").insert({ ...values, youtube_video_id: youtubeVideoId });
  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/past-groups");
  return { status: "idle" };
}

export async function toggleVisible(id: string, visible: boolean) {
  const admin = createAdminClient();
  await admin.from("past_group_cards").update({ visible }).eq("id", id);
  revalidatePath("/admin/past-groups");
}

export async function deletePastGroupCard(id: string) {
  const admin = createAdminClient();
  await admin.from("past_group_cards").delete().eq("id", id);
  revalidatePath("/admin/past-groups");
}

export async function reorderPastGroupCard(id: string, sortOrder: number) {
  const admin = createAdminClient();
  await admin.from("past_group_cards").update({ sort_order: sortOrder }).eq("id", id);
  revalidatePath("/admin/past-groups");
}
