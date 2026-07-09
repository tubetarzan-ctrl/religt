import { createClient } from "@/lib/supabase/server";
import { ReviewRow } from "@/components/admin/review-row";
import { AddReviewDialog } from "@/components/admin/add-review-dialog";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const pending = (reviews ?? []).filter((r) => r.moderation_status === "pending_review");
  const rest = (reviews ?? []).filter((r) => r.moderation_status !== "pending_review");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-text">Reviews Manager</h1>
          <p className="text-sm text-brand-text-muted">
            {pending.length} pending review{pending.length === 1 ? "" : "s"} awaiting moderation.
          </p>
        </div>
        <AddReviewDialog />
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-brand-accent">Pending Moderation</h2>
          {pending.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-brand-text-muted">All Reviews</h2>
        {rest.map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
