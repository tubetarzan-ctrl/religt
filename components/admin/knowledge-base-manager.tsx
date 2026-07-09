"use client";

import { useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addKnowledgeEntry, deleteKnowledgeEntry, type KnowledgeFormState } from "@/lib/actions/admin-settings";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Adding..." : "Add Entry"}
    </Button>
  );
}

export function KnowledgeBaseManager({ entries }: { entries: any[] }) {
  const [state, formAction] = useFormState(addKnowledgeEntry, { status: "idle" } as KnowledgeFormState);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <form action={formAction} className="grid gap-3 rounded-brand border border-white/10 bg-brand-bg-elevated p-4 sm:grid-cols-3">
        {state.status === "error" && (
          <p className="col-span-3 rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{state.message}</p>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="question_pattern">Keywords</Label>
          <Input id="question_pattern" name="question_pattern" placeholder="e.g. visa processing time iraq" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="answer">Answer</Label>
          <Input id="answer" name="answer" required />
        </div>
        <div className="flex items-end">
          <SubmitButton />
        </div>
      </form>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between rounded-md border border-white/10 bg-brand-bg p-3">
            <div>
              <p className="text-sm text-brand-text">{entry.question_pattern}</p>
              <p className="text-xs text-brand-text-muted">{entry.answer}</p>
              <p className="text-xs text-brand-text-muted">Hit count: {entry.hit_count}</p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await deleteKnowledgeEntry(entry.id);
                  toast.success("Deleted");
                })
              }
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
