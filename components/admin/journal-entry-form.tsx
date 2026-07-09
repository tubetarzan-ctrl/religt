"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createManualJournalEntry, type ManualJournalState } from "@/lib/actions/admin-journal";

interface Line {
  accountCode: string;
  debit: string;
  credit: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Posting..." : "Post Journal Entry"}
    </Button>
  );
}

export function JournalEntryForm({ accounts }: { accounts: { code: string; name: string }[] }) {
  const [state, formAction] = useFormState(createManualJournalEntry, { status: "idle" } as ManualJournalState);
  const [lines, setLines] = useState<Line[]>([
    { accountCode: "", debit: "", credit: "" },
    { accountCode: "", debit: "", credit: "" },
  ]);

  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);

  return (
    <form action={formAction} className="space-y-4 rounded-brand border border-white/10 bg-brand-bg-elevated p-6">
      {state.status === "error" && (
        <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{state.message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="entry_date">Date</Label>
          <Input id="entry_date" name="entry_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="memo">Memo</Label>
          <Input id="memo" name="memo" required />
        </div>
      </div>

      <div className="space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2">
            <select
              name="account_code"
              value={line.accountCode}
              onChange={(e) => {
                const next = [...lines];
                next[i] = { ...next[i], accountCode: e.target.value };
                setLines(next);
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-brand-text"
              required
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} — {a.name}
                </option>
              ))}
            </select>
            <Input
              name="debit"
              type="number"
              step="0.01"
              placeholder="Debit"
              value={line.debit}
              onChange={(e) => {
                const next = [...lines];
                next[i] = { ...next[i], debit: e.target.value, credit: "" };
                setLines(next);
              }}
            />
            <Input
              name="credit"
              type="number"
              step="0.01"
              placeholder="Credit"
              value={line.credit}
              onChange={(e) => {
                const next = [...lines];
                next[i] = { ...next[i], credit: e.target.value, debit: "" };
                setLines(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setLines(lines.filter((_, j) => j !== i))}
              disabled={lines.length <= 2}
            >
              ✕
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLines([...lines, { accountCode: "", debit: "", credit: "" }])}
        >
          Add Line
        </Button>
      </div>

      <p className={`text-sm ${totalDebit === totalCredit ? "text-brand-primary" : "text-destructive"}`}>
        Debit: {totalDebit.toFixed(2)} · Credit: {totalCredit.toFixed(2)}{" "}
        {totalDebit === totalCredit ? "(balanced)" : "(unbalanced)"}
      </p>

      <SubmitButton />
    </form>
  );
}
