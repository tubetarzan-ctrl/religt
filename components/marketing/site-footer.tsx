import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

// Footer reads --footer-bg / --footer-text from the active theme (Section 5.4)
// — every theme ships its own dark footer tone, so this re-themes automatically.
export function SiteFooter() {
  return (
    <footer className="bg-footer-bg py-16 pb-8 text-sm text-footer-text">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-11 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="mb-3.5 flex items-center gap-2 font-heading text-2xl text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base">☪</span>
              Religious Tours
            </span>
            <p className="opacity-80">
              Scholar-guided Ziarat and Umrah groups from Pakistan. Licensed, transparent, and trusted by
              thousands of travelers.
            </p>
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
            {/* Swap point: replace with the real office address/phone/email (Day 1 checklist). */}
            <ul className="space-y-2.5 opacity-80">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> +92 XXX XXXXXXX</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-accent" /> inquiries@religioustours.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-accent" /> Karachi, Pakistan</li>
              <li className="mt-3.5">
                <a href="#" className="hover:text-accent">Facebook</a> · <a href="#" className="hover:text-accent">Instagram</a> ·{" "}
                <a href="#" className="hover:text-accent">YouTube</a> · <a href="#" className="hover:text-accent">TikTok</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3.5 border-t border-white/10 pt-6 text-[13px]">
          <span>© {new Date().getFullYear()} Religious Tours. All rights reserved.</span>
          <span>
            Licensed Travel Operator — Govt. of Pakistan &nbsp;·&nbsp;{" "}
            <Link href="/admin/login" className="hover:text-accent">Staff Login</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
