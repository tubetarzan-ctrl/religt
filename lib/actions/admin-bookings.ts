"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireStaffUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const user = await requireStaffUser();
  const admin = createAdminClient();

  const { data: before } = await admin.from("bookings").select("*").eq("id", bookingId).single();

  const patch: Record<string, unknown> = { status };
  if (status === "cancelled") patch.cancelled_at = new Date().toISOString();

  const { error } = await admin.from("bookings").update(patch).eq("id", bookingId);
  if (error) throw new Error(error.message);

  await admin.from("audit_log").insert({
    actor_id: user.id,
    action: "booking.status_changed",
    entity_type: "bookings",
    entity_id: bookingId,
    before_state: before,
    after_state: { ...before, ...patch },
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function deleteBooking(bookingId: string) {
  const user = await requireStaffUser();
  const admin = createAdminClient();

  const { data: before } = await admin.from("bookings").select("*").eq("id", bookingId).single();
  const { error } = await admin.from("bookings").delete().eq("id", bookingId);
  if (error) throw new Error(error.message);

  await admin.from("audit_log").insert({
    actor_id: user.id,
    action: "booking.deleted",
    entity_type: "bookings",
    entity_id: bookingId,
    before_state: before,
    after_state: null,
  });

  revalidatePath("/admin/bookings");
}
