import { createClient } from "@/lib/supabase/server";
import { PaymentVerificationRow } from "@/components/admin/payment-verification-row";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("payment_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Payment Verification Queue</h1>
        <p className="text-sm text-brand-text-muted">
          Approving posts the journal entry automatically and advances the booking to paid.
        </p>
      </div>

      <div className="space-y-3">
        {(pending ?? []).map((submission) => (
          <PaymentVerificationRow key={submission.id} submission={submission} />
        ))}
        {(!pending || pending.length === 0) && (
          <p className="text-sm text-brand-text-muted">No payment proofs pending verification.</p>
        )}
      </div>
    </div>
  );
}
