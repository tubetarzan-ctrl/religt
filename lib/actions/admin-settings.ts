"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface KnowledgeFormState {
  status: "idle" | "error";
  message?: string;
}

export async function addKnowledgeEntry(
  _prevState: KnowledgeFormState,
  formData: FormData
): Promise<KnowledgeFormState> {
  const questionPattern = String(formData.get("question_pattern") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const vertical = String(formData.get("vertical") ?? "") || null;

  if (!questionPattern || !answer) {
    return { status: "error", message: "Keywords and answer are required." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("chatbot_knowledge").insert({ question_pattern: questionPattern, answer, vertical });
  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/settings");
  return { status: "idle" };
}

export async function deleteKnowledgeEntry(id: string) {
  const admin = createAdminClient();
  await admin.from("chatbot_knowledge").delete().eq("id", id);
  revalidatePath("/admin/settings");
}

export async function updateStaffRole(userId: string, role: string) {
  const admin = createAdminClient();
  await admin.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/settings");
}
