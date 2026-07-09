import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const REPORTS = [
  { href: "/admin/accounting/trial-balance", label: "Trial Balance", exportable: true },
  { href: "/admin/accounting/profit-loss", label: "Profit & Loss" },
  { href: "/admin/accounting/balance-sheet", label: "Balance Sheet" },
  { href: "/admin/accounting/ar-aging", label: "AR Aging" },
  { href: "/admin/accounting/ap-aging", label: "AP Aging" },
  { href: "/admin/accounting/general-ledger", label: "General Ledger" },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Reports</h1>
        <p className="text-sm text-brand-text-muted">
          All financial statements, derived live from the general ledger. Excel export is available
          on Trial Balance today — the same exceljs pattern (see
          app/api/reports/trial-balance/excel) extends directly to the others.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <Link key={r.href} href={r.href}>
            <Card className="border-white/10 bg-brand-bg-elevated transition-colors hover:border-brand-primary/40">
              <CardHeader>
                <CardTitle className="text-sm text-brand-text">{r.label}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
