import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, FileText } from "lucide-react";
import { BUSINESS } from "@/lib/content/business";
import { formatPkWhatsapp } from "@/lib/phone";

// Footer reads --footer-bg / --footer-text from the active theme (Section 5.4)
// — every theme ships its own dark footer tone, so this re-themes automatically.
export function SiteFooter() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";
  const waDefault = formatPkWhatsapp(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "");
  const waSunni = formatPkWhatsapp(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_SUNNI || "");

  return (
    <footer className="bg-footer-bg py-16 pb-8 text-sm text-footer-text">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-11 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="mb-3.5 flex items-center gap-2 font-heading text-2xl text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image src="/logo.jpg" alt={`${BUSINESS.name} logo`} width={36} height={36} className="h-full w-full object-cover" />
              </span>
              {BUSINESS.name}
            </span>
            <p className="opacity-80">
              Scholar-guided Ziarat and Umrah groups from Pakistan. Licensed, transparent, and trusted by
              thousands of travelers.
            </p>
            <div className="mt-4 space-y-1 text-xs opacity-70">
              <p>Govt. License {BUSINESS.govtLicense}</p>
              <p>NTN {BUSINESS.ntn}</p>
              <p>Registered with {BUSINESS.registeredWith}</p>
              <a
                href={BUSINESS.licenseCertificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                <FileText className="h-3.5 w-3.5" /> View registration certificate
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-[15px] font-bold text-white">Services</h4>
            <ul className="space-y-2.5 opacity-80">
              <li><Link href="/iraq-ziarat" className="hover:text-accent">Iraq Ziarat</Link></li>
              <li><Link href="/iran-ziarat" className="hover:text-accent">Iran Ziarat</Link></li>
              <li><Link href="/umrah" className="hover:text-accent">Umrah</Link></li>
              <li><Link href="/sunni-group-tours" className="hover:text-accent">Sunni Group Tours</Link></li>
              <li><Link href="/air-tickets" className="hover:text-accent">Air Tickets</Link></li>
              <li><Link href="/visas" className="hover:text-accent">Visas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[15px] font-bold text-white">Company</h4>
            <ul className="space-y-2.5 opacity-80">
              <li><Link href="/blog" className="hover:text-accent">Blog</Link></li>
              <li><Link href="#reviews" className="hover:text-accent">Reviews</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-accent">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent">Terms &amp; Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-accent">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[15px] font-bold text-white">Contact</h4>
            <ul className="space-y-2.5 opacity-80">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> {BUSINESS.landline} (landline)</li>
              {waDefault && (
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> {waDefault} (WhatsApp)</li>
              )}
              {waSunni && (
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> {waSunni} (Sunni Group Tours)</li>
              )}
              {supportEmail && (
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-accent" /> {supportEmail}</li>
              )}
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {BUSINESS.address}</li>
              <li className="mt-3.5">
                <a href={BUSINESS.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
                  </svg>
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3.5 border-t border-white/10 pt-6 text-[13px]">
          <span>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved. Govt. License {BUSINESS.govtLicense} · NTN {BUSINESS.ntn}</span>
          <span>
            Licensed Travel Operator — Govt. of Pakistan &nbsp;·&nbsp;{" "}
            <Link href="/admin/login" className="hover:text-accent">Staff Login</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
