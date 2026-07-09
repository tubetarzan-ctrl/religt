"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { verticals, sunniGroupTours } from "@/lib/content/verticals";
import { cn } from "@/lib/utils";

const navItems = [
  { slug: "iraq-ziarat", label: verticals["iraq-ziarat"].navLabel },
  { slug: "iran-ziarat", label: verticals["iran-ziarat"].navLabel },
  { slug: "umrah", label: verticals["umrah"].navLabel },
  { slug: "sunni-group-tours", label: sunniGroupTours.navLabel },
  { slug: "air-tickets", label: verticals["air-tickets"].navLabel },
  { slug: "visas", label: verticals["visas"].navLabel },
];

export function SiteHeader() {
  const pathname = usePathname();
  // NEXT_PUBLIC_CALCOM_LINK is currently unset in .env.local — `||` (not `??`)
  // catches that empty string and falls back to the on-page inquiry form
  // instead of a dead "#" link. Set the real Cal.com link to replace this.
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || "#inquiry";
  const hasRealCalLink = calLink.startsWith("http");

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-heading text-2xl text-primary">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base text-accent">
            ☪
          </span>
          Religious Tours
        </Link>

        <div className="hidden gap-5 whitespace-nowrap text-[14px] font-semibold text-ink-soft xl:flex xl:gap-6">
          <Link href="/" className={cn("hover:text-primary", pathname === "/" && "text-primary")}>
            Home
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className={cn("hover:text-primary", pathname === `/${item.slug}` && "text-primary")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="hidden whitespace-nowrap rounded-full border-[1.5px] border-primary px-5 py-[11px] text-sm text-primary hover:bg-primary-soft sm:inline-flex"
          >
            <a href={calLink} target={hasRealCalLink ? "_blank" : undefined} rel={hasRealCalLink ? "noopener noreferrer" : undefined}>
              📅 Book a Call
            </a>
          </Button>
          <Button asChild className="rounded-full bg-primary px-5 py-[11px] text-sm text-on-primary hover:bg-primary-dark">
            <Link href="#departures">View Departures</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
