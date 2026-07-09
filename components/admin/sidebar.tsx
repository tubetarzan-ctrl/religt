"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Star,
  Image as ImageIcon,
  Images,
  Wallet,
  Calculator,
  Inbox,
  Mail,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";
import type { Role } from "@/types/database";

const navItems: { href: string; label: string; icon: typeof LayoutDashboard; roles?: Role[] }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/tour-events", label: "Tour Events", icon: CalendarDays },
  { href: "/admin/reviews", label: "Reviews Manager", icon: Star },
  { href: "/admin/past-groups", label: "Past Groups Manager", icon: Images },
  { href: "/admin/gallery", label: "Gallery Manager", icon: ImageIcon },
  { href: "/admin/payments", label: "Payment Verification", icon: Wallet },
  {
    href: "/admin/accounting",
    label: "Accounting",
    icon: Calculator,
    roles: ["super_admin", "admin", "accountant"],
  },
  { href: "/admin/inquiries", label: "Inquiries / Leads", icon: Inbox },
  { href: "/admin/email-escalations", label: "Email Escalations", icon: Mail },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["super_admin", "admin"] },
];

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-brand-bg-elevated">
      <div className="px-5 py-6">
        <p className="font-heading text-lg text-brand-text">Religious Tours</p>
        <p className="text-xs text-brand-text-muted">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems
          .filter((item) => !item.roles || item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-brand-primary/15 text-brand-primary"
                    : "text-brand-text-muted hover:bg-white/5 hover:text-brand-text"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <form action={signOut}>
          <Button type="submit" variant="ghost" className="w-full justify-start gap-3 text-brand-text-muted">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
