import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const REPORTS = [
  { href: "/admin/accounting/trial-balance", label: "Trial Balance" },
  { href: "/admin/accounting/profit-loss", label: "Profit & Loss" },
  { href: "/admin/accounting/balance-sheet", label: "Balance Sheet" },
  { href: "/admin/accounting/ar-aging", label: "AR Aging" },
  { href: "/admin/accounting/ap-aging", label: "AP Aging" },
  { href: "/admin/accounting/general-ledger", label: "General Ledger" },
  { href: "/admin/accounting/journal-entries", label: "Journal Entries" },
];

export default async function AdminAccountingPage() {
  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("chart_of_accounts")
    .select("*")
    .eq("is_active", true)
    .order("code", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Accounting</h1>
        <p className="text-sm text-brand-text-muted">Chart of Accounts and financial reports.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
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

      <div>
        <h2 className="mb-3 font-heading text-lg text-brand-text">Chart of Accounts</h2>
        <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subtype</TableHead>
                <TableHead>Vertical</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(accounts ?? []).map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-mono text-brand-text-muted">{account.code}</TableCell>
                  <TableCell className="text-brand-text">
                    <Link href={`/admin/accounting/general-ledger?account=${account.id}`} className="hover:text-brand-primary">
                      {account.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-brand-text-muted">{account.type}</TableCell>
                  <TableCell className="text-brand-text-muted">{account.subtype}</TableCell>
                  <TableCell className="text-brand-text-muted">{account.vertical ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
