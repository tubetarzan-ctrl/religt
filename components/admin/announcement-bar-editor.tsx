"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAnnouncementBar } from "@/lib/actions/admin-appearance";

export function AnnouncementBarEditor({ currentText }: { currentText: string }) {
  const [text, setText] = useState(currentText);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={200} className="sm:max-w-lg" />
      <Button
        disabled={pending || text.trim() === currentText.trim() || !text.trim()}
        onClick={() =>
          startTransition(async () => {
            await updateAnnouncementBar(text);
            toast.success("Announcement bar updated");
          })
        }
        className="bg-brand-primary hover:bg-brand-primary/90"
      >
        {pending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
