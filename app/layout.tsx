import type { Metadata } from "next";
import { Suspense } from "react";
import { Marcellus, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getActiveTheme } from "@/lib/site-settings";
import { ThemePreviewOverride } from "@/components/marketing/theme-preview-override";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Section 4, cost item 8: keeps the home page's ISR caching intact even though
// the theme lookup here touches the DB — applyTheme() (admin action) calls
// revalidatePath('/', 'layout') on save, so theme changes still show up
// instantly instead of waiting out this window.
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    default: "S.Religious Tours — Iraq & Iran Ziarat, Umrah, Visas & Air Tickets",
    template: "%s | S.Religious Tours",
  },
  description:
    "Pakistan-based Islamic travel agency offering Iraq & Iran Ziarat groups, Umrah packages, Sunni Group Tours, air tickets, and visa services — with verified departures and transparent pricing.",
  icons: { icon: "/logo.jpg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Section 5.4: active theme is read server-side and rendered directly as
  // body[data-theme], so the correct palette paints on first byte — no flash
  // of the wrong theme, no client-side fetch. Admin routes override this via
  // their own .admin-theme class (app/admin/layout.tsx), which always wins
  // regardless of the public site's selected theme.
  const activeTheme = await getActiveTheme();

  return (
    <html lang="en" className={`${marcellus.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Warms up the connection ahead of the hero's YouTube background so the
            video starts sooner instead of paying DNS/TLS negotiation cost cold. */}
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://www.google.com" />
      </head>
      <body data-theme={activeTheme} className="font-body antialiased bg-background text-foreground">
        <Suspense fallback={null}>
          <ThemePreviewOverride />
        </Suspense>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
