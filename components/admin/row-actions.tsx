"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Generic Edit + Delete pair for admin list rows — used across Tour Events,
 * Bookings, etc. so every list has direct modify/delete actions, not just the
 * detail page. */
export function RowActions({
  editHref,
  deleteAction,
  confirmMessage = "Delete this? This can't be undone.",
}: {
  editHref?: string;
  /** Pass a bound Server Action, e.g. `deleteThing.bind(null, id)` — a plain
   * arrow function closure can't cross the server→client boundary here. */
  deleteAction: () => Promise<void>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex justify-end gap-2">
      {editHref && (
        <Button asChild size="sm" variant="outline">
          <Link href={editHref}>Edit</Link>
        </Button>
      )}
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmMessage)) return;
          startTransition(async () => {
            try {
              await deleteAction();
              toast.success("Deleted");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Delete failed");
            }
          });
        }}
      >
        {pending ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
