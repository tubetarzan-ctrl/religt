"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  approveReview,
  rejectReview,
  deleteReview,
  replyToReview,
  togglePublished,
} from "@/lib/actions/admin-reviews";

export function ReviewRow({ review }: { review: any }) {
  const [pending, startTransition] = useTransition();
  const [reply, setReply] = useState(review.admin_reply ?? "");

  const run = (fn: () => Promise<void>, successMsg: string) => {
    startTransition(async () => {
      try {
        await fn();
        toast.success(successMsg);
      } catch {
        toast.error("Action failed");
      }
    });
  };

  return (
    <div className="rounded-brand border border-white/10 bg-brand-bg p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-brand-text">{review.customer_name ?? "Anonymous"}</p>
          <p className="text-xs text-brand-text-muted">
            {review.landing_page_slug} · {review.rating ?? "—"}★ · {review.source}
          </p>
        </div>
        <StatusBadge status={review.moderation_status} />
      </div>
      {review.text_content && <p className="mt-2 text-sm text-brand-text-muted">{review.text_content}</p>}
      {review.flagged_reason && (
        <p className="mt-2 text-xs text-destructive">Flagged: {review.flagged_reason}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {review.moderation_status === "pending_review" && (
          <>
            <Button size="sm" disabled={pending} onClick={() => run(() => approveReview(review.id), "Approved")}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => run(() => rejectReview(review.id), "Rejected")}
            >
              Reject
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(() => togglePublished(review.id, !review.published), review.published ? "Hidden" : "Published")}
        >
          {review.published ? "Hide" : "Publish"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => run(() => deleteReview(review.id), "Deleted")}
        >
          Delete
        </Button>
      </div>

      <div className="mt-3 flex gap-2">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply publicly..."
          rows={1}
          className="flex-1"
        />
        <Button
          size="sm"
          disabled={pending || !reply.trim()}
          onClick={() => run(() => replyToReview(review.id, reply), "Reply posted")}
        >
          Reply
        </Button>
      </div>
    </div>
  );
}
