import { createAdminClient } from "@/lib/supabase/admin";
import { postJournalEntry } from "@/lib/accounting/journal";
import { VERTICAL_ACCOUNTS, CASH_ACCOUNT_CODE } from "@/lib/accounting/revenue-recognition";
import type { Vertical } from "@/types/database";

/**
 * Section 7.4, "Bank transfer verified by admin": Dr Cash/Bank, Cr Accounts
 * Receivable (or Cr Unearned Revenue if paid in advance of a future-dated trip).
 *
 * This MVP flow doesn't post a separate "booking confirmed / invoice issued"
 * entry before payment (no admin action currently triggers that), so payment
 * verification is the single moment money and revenue-in-advance are recorded:
 * on_completion verticals credit Unearned Revenue directly; immediate-recognition
 * verticals (air tickets, visas) credit Revenue directly.
 */
export async function postPaymentVerified(paymentSubmissionId: string, createdBy?: string | null) {
  const admin = createAdminClient();

  const { data: submission, error } = await admin
    .from("payment_submissions")
    .select("*, bookings(id, vertical, tour_event_id, customer_id)")
    .eq("id", paymentSubmissionId)
    .single();

  if (error || !submission) throw new Error(error?.message ?? "Payment submission not found");

  const booking = submission.bookings;
  const vertical = booking?.vertical as Vertical | undefined;
  const amount = submission.claimed_amount ?? 0;

  if (!vertical || !VERTICAL_ACCOUNTS[vertical]) {
    throw new Error(`Cannot post journal entry: unknown vertical "${vertical}" on booking ${booking?.id}`);
  }
  if (amount <= 0) {
    throw new Error("Cannot post journal entry: claimed amount must be greater than zero");
  }

  const config = VERTICAL_ACCOUNTS[vertical];
  const creditAccountCode =
    config.policy === "on_completion" && config.unearnedRevenueAccountCode
      ? config.unearnedRevenueAccountCode
      : config.revenueAccountCode;

  return postJournalEntry({
    entryDate: new Date().toISOString().slice(0, 10),
    reference: booking?.id,
    memo: `Payment verified for booking ${booking?.id}`,
    tourEventId: booking?.tour_event_id ?? null,
    source: "payment_verification",
    createdBy,
    lines: [
      { accountCode: CASH_ACCOUNT_CODE, debit: amount, customerId: booking?.customer_id ?? undefined },
      { accountCode: creditAccountCode, credit: amount, customerId: booking?.customer_id ?? undefined },
    ],
  });
}

/**
 * Section 7.4, "Trip completion": for on_completion verticals, Dr Unearned
 * Revenue, Cr Revenue. Run by the daily cron once event_date passes
 * (Section 12) against every verified payment tied to that tour_event that
 * hasn't already been recognized.
 */
export async function postTripCompletionRevenue(tourEventId: string, createdBy?: string | null) {
  const admin = createAdminClient();

  const { data: event, error: eventError } = await admin
    .from("tour_events")
    .select("id, vertical, title")
    .eq("id", tourEventId)
    .single();

  if (eventError || !event) throw new Error(eventError?.message ?? "Tour event not found");

  const vertical = event.vertical as Vertical;
  const config = VERTICAL_ACCOUNTS[vertical];
  if (config.policy !== "on_completion" || !config.unearnedRevenueAccountCode) {
    return null; // nothing to recognize — already immediate-recognition
  }

  // Sum verified payments tied to bookings on this tour_event that haven't yet had
  // their revenue recognized (tracked via journal_entries.source = 'trip_completion'
  // per tour_event — a single aggregate entry per event keeps the GL uncluttered).
  const { data: existing } = await admin
    .from("journal_entries")
    .select("id")
    .eq("tour_event_id", tourEventId)
    .eq("source", "trip_completion")
    .maybeSingle();

  if (existing) return null; // already recognized for this event

  const { data: payments } = await admin
    .from("payment_submissions")
    .select("claimed_amount, bookings!inner(tour_event_id)")
    .eq("status", "verified")
    .eq("bookings.tour_event_id", tourEventId);

  const total = (payments ?? []).reduce((sum: number, p: any) => sum + (p.claimed_amount ?? 0), 0);
  if (total <= 0) return null;

  return postJournalEntry({
    entryDate: new Date().toISOString().slice(0, 10),
    memo: `Revenue recognized on trip completion — ${event.title}`,
    tourEventId,
    source: "trip_completion",
    createdBy,
    lines: [
      { accountCode: config.unearnedRevenueAccountCode, debit: total },
      { accountCode: config.revenueAccountCode, credit: total },
    ],
  });
}

/** Section 7.4, "Vendor bill entered": Dr Cost of Services, Cr Accounts Payable. */
export async function postVendorBill(input: {
  vendorId: string;
  cogsAccountCode: string;
  amount: number;
  memo: string;
  tourEventId?: string | null;
  createdBy?: string | null;
}) {
  return postJournalEntry({
    entryDate: new Date().toISOString().slice(0, 10),
    memo: input.memo,
    tourEventId: input.tourEventId ?? null,
    source: "vendor_bill",
    createdBy: input.createdBy,
    lines: [
      { accountCode: input.cogsAccountCode, debit: input.amount, vendorId: input.vendorId },
      { accountCode: "20100", credit: input.amount, vendorId: input.vendorId },
    ],
  });
}

/** Section 7.4, "Vendor paid": Dr Accounts Payable, Cr Cash/Bank. */
export async function postVendorPayment(input: {
  vendorId: string;
  amount: number;
  memo: string;
  createdBy?: string | null;
}) {
  return postJournalEntry({
    entryDate: new Date().toISOString().slice(0, 10),
    memo: input.memo,
    source: "vendor_payment",
    createdBy: input.createdBy,
    lines: [
      { accountCode: "20100", debit: input.amount, vendorId: input.vendorId },
      { accountCode: CASH_ACCOUNT_CODE, credit: input.amount, vendorId: input.vendorId },
    ],
  });
}
