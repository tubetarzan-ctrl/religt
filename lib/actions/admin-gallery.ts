"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function addGalleryImage(landingPageSlug: string, category: string, imageUrl: string) {
  const admin = createAdminClient();
  await admin.from("gallery_images").insert({
    landing_page_slug: landingPageSlug,
    category,
    image_url: imageUrl,
    visible: true,
  });
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
