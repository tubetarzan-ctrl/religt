"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleVisible, deletePastGroupCard } from "@/lib/actions/admin-past-groups";

export function PastGroupList({ cards }: { cards: any[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <div key={card.id} className="flex items-center justify-between rounded-brand border border-border bg-brand-bg p-4">
          <div>
            <p className="text-xs text-brand-text-muted">
              {card.landing_page_slug} · {card.month_label} · sort {card.sort_order}
            </p>
            <p className="text-sm text-brand-text">{card.title}</p>
            <p className="text-xs text-brand-text-muted">{card.narrative}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await toggleVisible(card.id, !card.visible);
                  toast.success(card.visible ? "Hidden" : "Shown");
                })
              }
            >
              {card.visible ? "Hide" : "Show"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await deletePastGroupCard(card.id);
                  toast.success("Deleted");
                })
              }
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
      {cards.length === 0 && <p className="text-sm text-brand-text-muted">No past group cards yet.</p>}
    </div>
  );
}
