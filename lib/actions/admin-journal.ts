"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { postJournalEntry, reverseJournalEntry } from "@/lib/accounting/journal";
import { toSmallestUnit } from "@/lib/money";

export interface ManualJournalState {
  status: "idle" | "error";
  message?: string;
}

export async function createManualJournalEntry(
  _prevState: ManualJournalState,
  formData: FormData
): Promise<ManualJournalState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Unauthorized" };

  const entryDate = String(formData.get("entry_date") ?? "");
  const memo = String(formData.get("memo") ?? "");
  const accountCodes = formData.getAll("account_code") as string[];
  const debits = formData.getAll("debit") as string[];
  const credits = formData.getAll("credit") as string[];

  const lines = accountCodes
    .map((code, i) => ({
      accountCode: code,
      debit: toSmallestUnit(Number(debits[i] || 0)),
      credit: toSmallestUnit(Number(credits[i] || 0)),
    }))
    .filter((l) => l.accountCode && (l.debit > 0 || l.credit > 0));

  if (lines.length < 2) {
    return { status: "error", message: "A journal entry needs at least two lines." };
  }

  try {
    await postJournalEntry({
      entryDate,
      memo,
      source: "manual",
      createdBy: user.id,
      lines,
    });
  } catch (err) {
    return { status: "error", message: err instanceof Error ? err.message : "Failed to post entry" };
  }

  revalidatePath("/admin/accounting/journal-entries");
  return { status: "idle" };
}

export async function reverseEntry(journalEntryId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await reverseJournalEntry(journalEntryId, user.id);
  revalidatePath("/admin/accounting/journal-entries");
}
