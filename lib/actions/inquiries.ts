"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Vertical } from "@/types/database";

export interface InquiryFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitInquiry(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const group = String(formData.get("group") ?? "").trim();
  const rawMessage = String(formData.get("message") ?? "").trim();
  const vertical = String(formData.get("vertical") ?? "") as Vertical;

  if (!name || !phone) {
    return { status: "error", message: "Name and phone are required." };
  }

  const message = [group ? `Group: ${group}` : null, rawMessage || null].filter(Boolean).join("\n");

  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email: email || null,
    phone,
    message: message || null,
    vertical,
    source: "form",
    status: "open",
  });

  if (error) {
    return { status: "error", message: "Something went wrong — please try again or message us on WhatsApp." };
  }

  return { status: "success", message: "Thank you! Our team will respond within 15 minutes during business hours." };
}
