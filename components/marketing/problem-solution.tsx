import { CheckCircle2 } from "lucide-react";
import type { ProblemSolutionItem } from "@/lib/content/verticals";

export function ProblemSolution({ items }: { items: ProblemSolutionItem[] }) {
  return (
    <section className="bg-bg py-[88px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
          Why travel with a managed group
        </p>
        <h2 className="mt-2.5 max-w-2xl font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
          The fears every traveler has. We built this service around them.
        </h2>
        <div className="mt-11 grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.problem} className="rounded-2xl border border-line bg-surface p-[30px] shadow-card">
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#C0564A]">
                Concern #{i + 1}
              </span>
              <h3 className="mt-2.5 mb-2 font-heading text-xl text-ink">{item.problem}</h3>
              <div className="mt-4 flex items-start gap-2.5 border-t border-line pt-4 text-[14.5px] font-semibold text-primary">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                {item.solution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
