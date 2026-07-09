"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { reverseEntry } from "@/lib/actions/admin-journal";
import { formatMoney } from "@/lib/money";

export function JournalEntriesList({ entries }: { entries: any[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const total = (entry.journal_lines ?? []).reduce((s: number, l: any) => s + (l.debit ?? 0), 0);
        return (
          <div key={entry.id} className="rounded-brand border border-white/10 bg-brand-bg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-brand-text">{entry.memo}</p>
                <p className="text-xs text-brand-text-muted">
                  {entry.entry_date} · {entry.source} · {formatMoney(total)}
                </p>
              </div>
              {entry.source !== "reversal" && !entry.reversed_entry_id && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await reverseEntry(entry.id);
                      toast.success("Reversal entry posted");
                    })
                  }
                >
                  Reverse
                </Button>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {(entry.journal_lines ?? []).map((line: any) => (
                <div key={line.id} className="flex justify-between text-xs text-brand-text-muted">
                  <span>{line.chart_of_accounts?.code} — {line.chart_of_accounts?.name}</span>
                  <span>{line.debit ? `Dr ${formatMoney(line.debit)}` : `Cr ${formatMoney(line.credit)}`}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
