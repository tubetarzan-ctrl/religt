"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import type { Database } from "@/types/database";

type TourEvent = Database["public"]["Tables"]["tour_events"]["Row"];

type Option = "iraq_only" | "umrah_only" | "combined";

export function SunniPackageBuilder({ event }: { event: TourEvent | null }) {
  const [option, setOption] = useState<Option>("combined");

  if (!event) return null;

  const priceByOption: Record<Option, number | null> = {
    iraq_only: event.price_iraq_leg_only,
    umrah_only: event.price_umrah_leg_only,
    combined: event.price_amount,
  };

  const labels: Record<Option, string> = {
    iraq_only: "Iraq Ziarat Only",
    umrah_only: "Umrah Only",
    combined: "Combined (Iraq + Umrah)",
  };

  const price = priceByOption[option];

  return (
    <section className="bg-surface py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-[1.5px] border-accent/30 bg-bg p-6 shadow-card">
          <h3 className="font-heading text-xl text-ink">Build Your Journey</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Choose Iraq-only, Umrah-only, or the full combined Sunni journey — price updates live.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(Object.keys(labels) as Option[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setOption(key)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  option === key
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-line text-ink-soft hover:border-primary/40"
                }`}
              >
                {labels[key]}
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-soft">Price</p>
              <p className="font-heading text-3xl font-extrabold text-primary">
                {price ? formatMoney(price, event.currency) : "Contact us"}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-primary text-on-primary hover:bg-primary-dark">
              <Link href={`/book/${event.slug}?option=${option}`}>Reserve Seat</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
