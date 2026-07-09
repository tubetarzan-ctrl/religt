import { FadeIn } from "@/components/marketing/fade-in";
import type { WhyUsItem } from "@/lib/content/verticals";

export function WhyUs({ items }: { items: WhyUsItem[] }) {
  return (
    <section className="bg-surface py-[88px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
            Why S.Religious Tours
          </p>
          <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
            What no other operator in Pakistan offers
          </h2>
        </FadeIn>
        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.06}>
              <div className="rounded-2xl border border-line bg-surface p-7 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-primary-soft text-2xl">
                  ✓
                </div>
                <h3 className="mb-2 text-[17.5px] font-bold text-ink">{item.title}</h3>
                <p className="text-[13.5px] text-ink-soft">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
