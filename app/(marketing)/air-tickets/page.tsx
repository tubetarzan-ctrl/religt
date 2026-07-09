import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";
import { verticals } from "@/lib/content/verticals";

const content = verticals["air-tickets"];

export const revalidate = 60;

export const metadata: Metadata = {
  title: content.heroTitle,
  description: content.heroSubtitle,
};

export default function AirTicketsPage() {
  return <LandingPage content={content} />;
}
