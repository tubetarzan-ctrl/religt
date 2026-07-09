"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateInquiryStatus(id: string, status: string) {
  const admin = createAdminClient();
  await admin.from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/inquiries");
}
