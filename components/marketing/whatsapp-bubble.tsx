"use client";

import { usePathname } from "next/navigation";

export function WhatsappBubble({ context }: { context: string }) {
  const pathname = usePathname();
  const isSunniGroupTours = pathname?.startsWith("/sunni-group-tours");
  const number = isSunniGroupTours
    ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_SUNNI ?? ""
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const message = encodeURIComponent(`Assalam-o-Alaikum, I'm interested in ${context}.`);
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#25D366] py-3.5 pl-4 pr-5 font-bold text-white shadow-[0_10px_34px_rgba(37,211,102,0.45)] transition-transform hover:scale-105"
    >
      <span className="relative flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-white text-lg">
        💬
        <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 animate-ping rounded-full bg-white" />
      </span>
      <span className="hidden text-sm sm:inline">Chat with us — replies in seconds</span>
    </a>
  );
}
