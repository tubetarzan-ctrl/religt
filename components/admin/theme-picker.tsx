"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { THEMES } from "@/lib/themes";
import { applyTheme } from "@/lib/actions/admin-appearance";
import { cn } from "@/lib/utils";

export function ThemePicker({ currentTheme }: { currentTheme: string }) {
  const [selected, setSelected] = useState(currentTheme);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => setSelected(theme.id)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-brand border p-3 transition-colors",
              selected === theme.id ? "border-brand-primary" : "border-border hover:border-brand-primary/40"
            )}
          >
            <span
              className="h-10 w-full rounded-md"
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]} 0 45%, ${theme.colors[1]} 45% 70%, ${theme.colors[2]} 70% 100%)`,
              }}
            />
            <span className="text-xs text-brand-text-muted">{theme.name}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-brand border border-border">
        <iframe key={selected} src={`/?previewTheme=${selected}`} title="Homepage preview" className="h-96 w-full" />
      </div>

      <Button
        disabled={pending || selected === currentTheme}
        onClick={() =>
          startTransition(async () => {
            await applyTheme(selected);
            toast.success(`Theme applied — ${THEMES.find((t) => t.id === selected)?.name} is now live`);
          })
        }
        className="bg-brand-primary hover:bg-brand-primary/90"
      >
        {pending ? "Applying..." : "Apply to Site"}
      </Button>
    </div>
  );
}
