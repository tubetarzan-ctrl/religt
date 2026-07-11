import { Topbar } from "@/components/marketing/topbar";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsappBubble } from "@/components/marketing/whatsapp-bubble";
import { ChatWidget } from "@/components/marketing/chat-widget";
import { LightboxProvider } from "@/components/lightbox";
import { getAnnouncementBarText } from "@/lib/site-settings";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const announcement = await getAnnouncementBarText();

  return (
    <LightboxProvider>
      <div className="flex min-h-screen flex-col">
        <Topbar announcement={announcement} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsappBubble context="your services" />
        <ChatWidget />
      </div>
    </LightboxProvider>
  );
}
