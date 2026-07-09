"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createBooking,
  submitPaymentProof,
  type BookingFormState,
  type PaymentProofState,
} from "@/lib/actions/bookings";

const initialBookingState: BookingFormState = { status: "idle" };
const initialPaymentProofState: PaymentProofState = { status: "idle" };
import { formatMoney } from "@/lib/money";
import { UploadButton } from "@/lib/uploadthing";
import type { Database } from "@/types/database";

type TourEvent = Database["public"]["Tables"]["tour_events"]["Row"];

const BANK_ACCOUNTS = [
  { bank: "Meezan Bank", accountTitle: "Religious Tours (Pvt) Ltd", accountNumber: "PK00 MEZN 0000 0000 0000 0000", currency: "PKR" },
];

function StepOneSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Reserving..." : "Continue to Payment"}
    </Button>
  );
}

function StepTwoSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Submitting..." : "Submit Payment Proof"}
    </Button>
  );
}

export function BookingFlow({ event }: { event: TourEvent }) {
  const [paxCount, setPaxCount] = useState(1);
  const [bookingState, bookingAction] = useFormState(createBooking, initialBookingState);
  const [proofUrl, setProofUrl] = useState<string>("");
  const [proofState, proofAction] = useFormState(submitPaymentProof, initialPaymentProofState);

  const total = event.price_amount * paxCount;

  if (proofState.status === "success") {
    return (
      <div className="rounded-brand border border-brand-primary/30 bg-brand-primary/10 p-6 text-center">
        <p className="text-brand-text">{proofState.message}</p>
      </div>
    );
  }

  if (bookingState.status === "success" && bookingState.bookingId) {
    return (
      <div className="space-y-6">
        <div className="rounded-brand border border-border bg-brand-bg-elevated p-6">
          <h3 className="font-heading text-lg text-brand-text">Bank Transfer Details</h3>
          <p className="mt-1 text-sm text-brand-text-muted">
            Transfer {formatMoney(total, event.currency)} to one of the accounts below, then upload your proof.
          </p>
          <div className="mt-4 space-y-3">
            {BANK_ACCOUNTS.map((acc) => (
              <div key={acc.accountNumber} className="rounded-md bg-brand-bg p-3 text-sm text-brand-text-muted">
                <p className="text-brand-text">{acc.bank} — {acc.currency}</p>
                <p>{acc.accountTitle}</p>
                <p className="font-mono">{acc.accountNumber}</p>
              </div>
            ))}
          </div>
        </div>

        <form action={proofAction} className="space-y-4 rounded-brand border border-border bg-brand-bg-elevated p-6">
          <input type="hidden" name="booking_id" value={bookingState.bookingId} />
          <input type="hidden" name="proof_url" value={proofUrl} />

          {proofState.status === "error" && (
            <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{proofState.message}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="claimed_amount">Amount Transferred</Label>
            <Input id="claimed_amount" name="claimed_amount" type="number" defaultValue={total / 100} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bank_account_used">Bank Used</Label>
            <Input id="bank_account_used" name="bank_account_used" placeholder="e.g. Meezan Bank" />
          </div>
          <div className="space-y-1.5">
            <Label>Upload Proof (image or PDF)</Label>
            <UploadButton
              endpoint="paymentProof"
              onClientUploadComplete={(res) => {
                if (res[0]) {
                  setProofUrl(res[0].url);
                  toast.success("Proof uploaded");
                }
              }}
              onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`); }}
            />
            {proofUrl && <p className="text-xs text-brand-primary">Proof attached ✓</p>}
          </div>
          <StepTwoSubmit />
        </form>
      </div>
    );
  }

  return (
    <form action={bookingAction} className="space-y-4 rounded-brand border border-border bg-brand-bg-elevated p-6">
      <input type="hidden" name="tour_event_id" value={event.id} />
      <input type="hidden" name="vertical" value={event.vertical} />
      <input type="hidden" name="price_amount" value={event.price_amount} />

      {bookingState.status === "error" && (
        <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{bookingState.message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input id="phone" name="phone" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pax_count">Number of Travelers</Label>
        <Input
          id="pax_count"
          name="pax_count"
          type="number"
          min={1}
          value={paxCount}
          onChange={(e) => setPaxCount(Math.max(1, Number(e.target.value)))}
        />
      </div>
      <p className="text-sm text-brand-text-muted">
        Total: <span className="font-heading text-lg text-brand-accent">{formatMoney(total, event.currency)}</span>
      </p>
      <StepOneSubmit />
    </form>
  );
}
