import { GraduationCap } from "lucide-react";
import type { Database } from "@/types/database";

type TourEvent = Database["public"]["Tables"]["tour_events"]["Row"];

export function ScholarProfile({ event }: { event: TourEvent | null }) {
  if (!event || !event.guide_name) return null;

  return (
    <section className="bg-bg py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-surface p-8 text-center shadow-card sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-soft">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent-ink">Accompanying Sunni Scholar</p>
            <h3 className="mt-1 font-heading text-xl text-ink">{event.guide_name}</h3>
            <p className="mt-2 text-sm text-ink-soft">{event.guide_bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
