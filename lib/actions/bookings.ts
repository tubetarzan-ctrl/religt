"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface BookingFormState {
  status: "idle" | "success" | "error";
  message?: string;
  bookingId?: string;
}

export async function createBooking(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const tourEventId = String(formData.get("tour_event_id") ?? "");
  const vertical = String(formData.get("vertical") ?? "");
  const paxCount = Math.max(1, Number(formData.get("pax_count") ?? 1));
  const priceAmount = Number(formData.get("price_amount") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!tourEventId || !name || !phone) {
    return { status: "error", message: "Name and phone are required." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      tour_event_id: tourEventId,
      vertical,
      pax_count: paxCount,
      total_amount: priceAmount * paxCount,
      status: "quoted",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { status: "error", message: "Something went wrong creating your booking — please try again." };
  }

  await supabase.from("travelers").insert({
    booking_id: data.id,
    full_name: name,
    emergency_contact: { phone },
  });

  await supabase.from("inquiries").insert({
    name,
    phone,
    vertical,
    message: `New booking quoted for tour_event ${tourEventId}, ${paxCount} pax.`,
    source: "form",
    status: "open",
  });

  return { status: "success", bookingId: data.id };
}

export interface PaymentProofState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitPaymentProof(
  _prevState: PaymentProofState,
  formData: FormData
): Promise<PaymentProofState> {
  const bookingId = String(formData.get("booking_id") ?? "");
  const proofUrl = String(formData.get("proof_url") ?? "");
  const claimedAmount = Number(formData.get("claimed_amount") ?? 0);
  const bankAccountUsed = String(formData.get("bank_account_used") ?? "");

  if (!bookingId || !proofUrl) {
    return { status: "error", message: "Please upload your payment proof before submitting." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("payment_submissions").insert({
    booking_id: bookingId,
    proof_url: proofUrl,
    claimed_amount: claimedAmount || null,
    bank_account_used: bankAccountUsed || null,
    status: "pending",
  });

  if (error) {
    return { status: "error", message: "Something went wrong submitting your proof — please try again." };
  }

  return {
    status: "success",
    message: "Payment proof received. Our team will verify it and confirm your booking shortly.",
  };
}
