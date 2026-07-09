import { Topbar } from "@/components/marketing/topbar";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsappBubble } from "@/components/marketing/whatsapp-bubble";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar announcement="📢 Next Karbala group departs 14 Aug 2026 — only 6 seats left" />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsappBubble context="your services" />
    </div>
  );
}
