"use client";

import { usePathname } from "next/navigation";
import { formatPkWhatsapp } from "@/lib/phone";

export function Topbar({ announcement }: { announcement: string }) {
  const pathname = usePathname();
  const isSunniGroupTours = pathname?.startsWith("/sunni-group-tours");
  const waNumber = isSunniGroupTours
    ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_SUNNI ?? ""
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "";

  return (
    <div className="bg-primary-dark py-2 text-[13px] text-on-primary">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <span>{announcement}</span>
        <span className="font-semibold">
          📞 {formatPkWhatsapp(waNumber)} {supportEmail && <>&nbsp;·&nbsp; ✉ {supportEmail}</>}
        </span>
      </div>
    </div>
  );
}
