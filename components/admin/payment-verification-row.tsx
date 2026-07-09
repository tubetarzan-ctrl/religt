"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fromSmallestUnit, toSmallestUnit, formatMoney } from "@/lib/money";
import { approvePayment, rejectPayment } from "@/lib/actions/admin-payments";

export function PaymentVerificationRow({ submission }: { submission: any }) {
  const [amount, setAmount] = useState(fromSmallestUnit(submission.claimed_amount ?? 0));
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-brand border border-white/10 bg-brand-bg p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <a href={submission.proof_url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
            View proof
          </a>
          <p className="mt-1 text-sm text-brand-text-muted">
            Booking: {submission.booking_id} · Bank: {submission.bank_account_used ?? "—"}
          </p>
          <p className="text-xs text-brand-text-muted">
            Claimed: {formatMoney(submission.claimed_amount ?? 0)} · Submitted{" "}
            {new Date(submission.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-32"
          />
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  await approvePayment(submission.id, toSmallestUnit(amount));
                  toast.success("Payment verified — journal entry posted");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Failed to approve");
                }
              })
            }
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            Approve
          </Button>
          <Button
            disabled={pending}
            variant="destructive"
            onClick={() =>
              startTransition(async () => {
                const reason = window.prompt("Rejection reason?") ?? "Not specified";
                await rejectPayment(submission.id, reason);
                toast.success("Payment rejected");
              })
            }
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
