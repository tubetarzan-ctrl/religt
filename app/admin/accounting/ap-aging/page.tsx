import { getApAging } from "@/lib/accounting/reports";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney } from "@/lib/money";

export default async function ApAgingPage() {
  const rows = await getApAging();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Accounts Payable Aging</h1>
        <p className="text-sm text-brand-text-muted">Outstanding vendor balances by age.</p>
      </div>

      <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="text-right">1-30</TableHead>
              <TableHead className="text-right">31-60</TableHead>
              <TableHead className="text-right">61-90</TableHead>
              <TableHead className="text-right">90+</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="text-brand-text">{row.name}</TableCell>
                <TableCell className="text-right text-brand-text-muted">{formatMoney(row.current)}</TableCell>
                <TableCell className="text-right text-brand-text-muted">{formatMoney(row.d1_30)}</TableCell>
                <TableCell className="text-right text-brand-text-muted">{formatMoney(row.d31_60)}</TableCell>
                <TableCell className="text-right text-brand-text-muted">{formatMoney(row.d61_90)}</TableCell>
                <TableCell className="text-right text-destructive">{formatMoney(row.d90_plus)}</TableCell>
                <TableCell className="text-right text-brand-text">{formatMoney(row.total)}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-brand-text-muted">
                  No outstanding payables.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
