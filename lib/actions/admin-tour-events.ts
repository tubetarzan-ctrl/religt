"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncTourEventKnowledge } from "@/lib/chatbot/knowledge-sync";
import { slugify } from "@/lib/slugify";

export interface TourEventFormState {
  status: "idle" | "error";
  message?: string;
}

function parseTourEventForm(formData: FormData) {
  return {
    vertical: String(formData.get("vertical")),
    sect: String(formData.get("sect")),
    title: String(formData.get("title")),
    slug: slugify(String(formData.get("slug") || formData.get("title") || "")),
    start_date: String(formData.get("start_date")),
    end_date: String(formData.get("end_date")),
    duration_days: Number(formData.get("duration_days")) || null,
    capacity: Number(formData.get("capacity")) || 0,
    price_amount: Math.round(Number(formData.get("price_amount")) * 100),
    currency: String(formData.get("currency") || "PKR"),
    guide_name: String(formData.get("guide_name") || "") || null,
    guide_bio: String(formData.get("guide_bio") || "") || null,
    poster_image_url: String(formData.get("poster_image_url") || "") || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createTourEvent(
  _prevState: TourEventFormState,
  formData: FormData
): Promise<TourEventFormState> {
  const values = parseTourEventForm(formData);
  const admin = createAdminClient();
  const { error, data } = await admin.from("tour_events").insert(values).select("id").single();

  if (error) {
    return { status: "error", message: error.message };
  }

  await syncTourEventKnowledge(data.id);

  revalidatePath("/admin/tour-events");
  redirect(`/admin/tour-events/${data.id}`);
}

export async function updateTourEvent(
  id: string,
  _prevState: TourEventFormState,
  formData: FormData
): Promise<TourEventFormState> {
  const values = parseTourEventForm(formData);
  const admin = createAdminClient();
  const { error } = await admin.from("tour_events").update(values).eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  await syncTourEventKnowledge(id);

  revalidatePath("/admin/tour-events");
  revalidatePath(`/admin/tour-events/${id}`);
  return { status: "idle" };
}

export async function deleteTourEvent(id: string) {
  const admin = createAdminClient();
  await admin.from("tour_events").delete().eq("id", id);
  revalidatePath("/admin/tour-events");
  redirect("/admin/tour-events");
}

/** Same delete, but no redirect — for the list page's inline Delete button,
 * which is already on /admin/tour-events and just needs the row gone. */
export async function deleteTourEventInline(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("tour_events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tour-events");
}
