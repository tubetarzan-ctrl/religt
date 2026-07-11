"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId } from "@/lib/youtube";

export async function addGalleryImage(landingPageSlug: string, category: string, imageUrl: string) {
  const admin = createAdminClient();
  await admin.from("gallery_images").insert({
    landing_page_slug: landingPageSlug,
    category,
    image_url: imageUrl,
    media_type: "image",
    visible: true,
  });
  revalidatePath("/admin/gallery");
}

export async function addGalleryVideo(landingPageSlug: string, category: string, youtubeInput: string) {
  const videoId = extractYoutubeId(youtubeInput);
  if (!videoId) throw new Error("Couldn't recognize that YouTube link/ID — paste the full URL or just the 11-character video ID.");

  const admin = createAdminClient();
  const { error } = await admin.from("gallery_images").insert({
    landing_page_slug: landingPageSlug,
    category,
    youtube_video_id: videoId,
    media_type: "youtube",
    visible: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
}

export async function toggleGalleryImageVisibility(id: string, visible: boolean) {
  const admin = createAdminClient();
  await admin.from("gallery_images").update({ visible }).eq("id", id);
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(id: string) {
  const admin = createAdminClient();
  await admin.from("gallery_images").delete().eq("id", id);
  revalidatePath("/admin/gallery");
}
