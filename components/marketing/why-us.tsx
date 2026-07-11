import Image from "next/image";
import { FadeIn } from "@/components/marketing/fade-in";
import type { WhyUsItem } from "@/lib/content/verticals";

// Keyed by the recurring title strings shared across vertical pages — titles
// not in this map (e.g. "Fast Ticketing") just keep the checkmark icon.
const TITLE_IMAGE: Record<string, string> = {
  "WhatsApp AI Support": "/images/why-us/whatsapp-ai-support.jpg",
  "Verified Payment Tracking": "/images/why-us/verified-payment-tracking.jpg",
  "Transparent Pricing": "/images/why-us/transparent-pricing.jpg",
  "Video-Verified Reviews": "/images/why-us/video-verified-reviews.jpg",
};

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
          {items.map((item, i) => {
            const image = TITLE_IMAGE[item.title];
            return (
              <FadeIn key={item.title} delay={i * 0.06}>
                <div className="overflow-hidden rounded-2xl border border-line bg-surface text-center shadow-card">
                  {image ? (
                    <div className="relative h-32 w-full">
                      <Image src={image} alt={item.title} fill sizes="280px" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    </div>
                  ) : (
                    <div className="mx-auto mt-7 flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-primary-soft text-2xl">
                      ✓
                    </div>
                  )}
                  <div className="p-7 pt-5">
                    <h3 className="mb-2 text-[17.5px] font-bold text-ink">{item.title}</h3>
                    <p className="text-[13.5px] text-ink-soft">{item.description}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
