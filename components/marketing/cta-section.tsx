import { InquiryForm } from "@/components/marketing/inquiry-form";
import { FadeIn } from "@/components/marketing/fade-in";
import { createClient } from "@/lib/supabase/server";
import type { Vertical } from "@/types/database";

export async function CtaSection({ vertical }: { vertical: Vertical }) {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("tour_events")
    .select("title")
    .eq("vertical", vertical)
    .eq("status", "upcoming")
    .order("start_date", { ascending: true })
    .limit(8);

  return (
    <section
      id="inquiry"
      className="relative overflow-hidden py-[88px] text-white"
      style={{ background: "linear-gradient(150deg, var(--hero-g1), var(--hero-g2))" }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A24B' stroke-opacity='.16'%3E%3Cpath d='M60 6l14 26 30 6-22 22 4 30-26-14-26 14 4-30L16 38l30-6z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <FadeIn>
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent before:h-px before:w-[26px] before:bg-accent">
              Start your journey
            </p>
            <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-white">
              Seats confirm on a first-paid, first-served basis.
            </h2>
            <p className="mb-6 mt-3 max-w-md text-hero-text">
              Send an inquiry and our team responds within minutes on WhatsApp during working hours — or
              instantly via our AI assistant, any time.
            </p>
            <div className="flex flex-wrap gap-3">
              {["No advance needed to inquire", "Response in <15 min", "Urdu & English"].map((badge) => (
                <span key={badge} className="rounded-full bg-white/12 px-4 py-2 text-[13px] font-semibold backdrop-blur-sm">
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <InquiryForm vertical={vertical} groups={(events ?? []).map((e) => e.title)} />
        </FadeIn>
      </div>
    </section>
  );
}
