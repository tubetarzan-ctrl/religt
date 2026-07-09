"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { postPaymentVerified } from "@/lib/accounting/auto-posting";

export async function approvePayment(paymentSubmissionId: string, verifiedAmount: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();

  const { data: submission } = await admin
    .from("payment_submissions")
    .select("booking_id")
    .eq("id", paymentSubmissionId)
    .single();

  await admin
    .from("payment_submissions")
    .update({ status: "verified", claimed_amount: verifiedAmount, reviewed_by: user.id })
    .eq("id", paymentSubmissionId);

  await postPaymentVerified(paymentSubmissionId, user.id);

  if (submission?.booking_id) {
    await admin.from("bookings").update({ status: "paid" }).eq("id", submission.booking_id);
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/accounting");
}

export async function rejectPayment(paymentSubmissionId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  await admin
    .from("payment_submissions")
    .update({ status: "rejected", rejection_reason: reason, reviewed_by: user.id })
    .eq("id", paymentSubmissionId);

  revalidatePath("/admin/payments");
}
