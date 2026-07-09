import { FadeIn } from "@/components/marketing/fade-in";
import type { FaqItem } from "@/lib/content/verticals";

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="bg-bg py-[88px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
              Common questions
            </p>
            <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
              Everything travelers ask us
            </h2>
          </div>
        </FadeIn>
        <div className="mx-auto mt-11 max-w-3xl">
          {items.map((item, i) => (
            <FadeIn key={item.question} delay={i * 0.03}>
              <details className="group mb-3 overflow-hidden rounded-xl border border-line bg-surface" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-[15.5px] font-bold text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="ml-4 shrink-0 text-2xl text-accent-ink transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-[14.5px] text-ink-soft">{item.answer}</div>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
