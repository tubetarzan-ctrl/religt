import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";
import { verticals } from "@/lib/content/verticals";

const content = verticals["visas"];

export const revalidate = 60;

export const metadata: Metadata = {
  title: content.heroTitle,
  description: content.heroSubtitle,
};

export default function VisasPage() {
  return <LandingPage content={content} />;
}
