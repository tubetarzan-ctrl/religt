import { createAdminClient } from "@/lib/supabase/admin";

export interface JournalLineInput {
  accountCode: string;
  debit?: number;
  credit?: number;
  memo?: string;
  vendorId?: string;
  customerId?: string;
}

export interface PostJournalEntryInput {
  entryDate: string;
  reference?: string;
  memo?: string;
  tourEventId?: string | null;
  source: "manual" | "booking_auto" | "payment_verification" | "vendor_bill" | "vendor_payment" | "trip_completion" | "closing_entry" | "reversal";
  createdBy?: string | null;
  lines: JournalLineInput[];
}

/**
 * Posts a balanced double-entry journal entry. Section 7.3's hard invariant
 * (sum(debit) = sum(credit)) is enforced both here and by the deferred DB
 * constraint trigger — this check fails fast with a clearer error message.
 */
export async function postJournalEntry(input: PostJournalEntryInput) {
  const totalDebit = input.lines.reduce((sum, l) => sum + (l.debit ?? 0), 0);
  const totalCredit = input.lines.reduce((sum, l) => sum + (l.credit ?? 0), 0);

  if (totalDebit !== totalCredit) {
    throw new Error(
      `Unbalanced journal entry: debits ${totalDebit} != credits ${totalCredit} (${input.memo ?? input.source})`
    );
  }

  const admin = createAdminClient();

  const codes = Array.from(new Set(input.lines.map((l) => l.accountCode)));
  const { data: accounts, error: accountsError } = await admin
    .from("chart_of_accounts")
    .select("id, code")
    .in("code", codes);

  if (accountsError) throw new Error(accountsError.message);

  const codeToId = new Map((accounts ?? []).map((a: any) => [a.code, a.id]));
  const missing = codes.filter((c) => !codeToId.has(c));
  if (missing.length > 0) {
    throw new Error(`Unknown chart_of_accounts code(s): ${missing.join(", ")}`);
  }

  const { data: entry, error: entryError } = await admin
    .from("journal_entries")
    .insert({
      entry_date: input.entryDate,
      reference: input.reference ?? null,
      memo: input.memo ?? null,
      tour_event_id: input.tourEventId ?? null,
      source: input.source,
      created_by: input.createdBy ?? null,
      posted: true,
    })
    .select("id")
    .single();

  if (entryError || !entry) throw new Error(entryError?.message ?? "Failed to create journal entry");

  const lines = input.lines.map((l) => ({
    journal_entry_id: entry.id,
    account_id: codeToId.get(l.accountCode),
    debit: l.debit ?? 0,
    credit: l.credit ?? 0,
    memo: l.memo ?? null,
    vendor_id: l.vendorId ?? null,
    customer_id: l.customerId ?? null,
  }));

  const { error: linesError } = await admin.from("journal_lines").insert(lines);
  if (linesError) throw new Error(linesError.message);

  return entry.id as string;
}

/** Reverses a posted journal entry with an equal-and-opposite entry — never edits the original (Section 7.4). */
export async function reverseJournalEntry(journalEntryId: string, createdBy?: string | null) {
  const admin = createAdminClient();

  const { data: original, error } = await admin
    .from("journal_entries")
    .select("*, journal_lines(*)")
    .eq("id", journalEntryId)
    .single();

  if (error || !original) throw new Error(error?.message ?? "Journal entry not found");

  const { data: reversal, error: reversalError } = await admin
    .from("journal_entries")
    .insert({
      entry_date: new Date().toISOString().slice(0, 10),
      reference: original.reference,
      memo: `Reversal of ${original.memo ?? original.id}`,
      tour_event_id: original.tour_event_id,
      source: "reversal",
      reversed_entry_id: original.id,
      created_by: createdBy ?? null,
      posted: true,
    })
    .select("id")
    .single();

  if (reversalError || !reversal) throw new Error(reversalError?.message ?? "Failed to create reversal");

  const reversedLines = (original.journal_lines as any[]).map((l) => ({
    journal_entry_id: reversal.id,
    account_id: l.account_id,
    debit: l.credit,
    credit: l.debit,
    memo: l.memo,
    vendor_id: l.vendor_id,
    customer_id: l.customer_id,
  }));

  const { error: linesError } = await admin.from("journal_lines").insert(reversedLines);
  if (linesError) throw new Error(linesError.message);

  return reversal.id as string;
}
