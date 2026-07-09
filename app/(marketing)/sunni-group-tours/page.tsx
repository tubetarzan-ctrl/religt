import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";
import { SunniPackageBuilder } from "@/components/marketing/sunni-package-builder";
import { ScholarProfile } from "@/components/marketing/scholar-profile";
import { sunniGroupTours } from "@/lib/content/verticals";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: sunniGroupTours.heroTitle,
  description: sunniGroupTours.heroSubtitle,
};

export default async function SunniGroupToursPage() {
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("tour_events")
    .select("*")
    .eq("vertical", "sunni_group")
    .eq("status", "upcoming")
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <LandingPage content={sunniGroupTours}>
      <SunniPackageBuilder event={event ?? null} />
      <ScholarProfile event={event ?? null} />
    </LandingPage>
  );
}
