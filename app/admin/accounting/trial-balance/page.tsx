import { getTrialBalance } from "@/lib/accounting/reports";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney } from "@/lib/money";

export default async function TrialBalancePage({
  searchParams,
}: {
  searchParams: Promise<{ asOf?: string }>;
}) {
  const { asOf } = await searchParams;
  const { balances, totalDebit, totalCredit, isBalanced } = await getTrialBalance(asOf);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-text">Trial Balance</h1>
          <p className={`text-sm ${isBalanced ? "text-brand-primary" : "text-destructive"}`}>
            {isBalanced ? "Balanced" : "NOT BALANCED — investigate immediately"}
          </p>
        </div>
        <a
          href={`/api/reports/trial-balance/excel${asOf ? `?asOf=${asOf}` : ""}`}
          className="rounded-md border border-white/10 px-3 py-2 text-sm text-brand-text-muted hover:text-brand-text"
        >
          Export Excel
        </a>
      </div>

      <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances
              .filter((b) => b.debitTotal !== 0 || b.creditTotal !== 0)
              .map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-brand-text-muted">{b.code}</TableCell>
                  <TableCell className="text-brand-text">{b.name}</TableCell>
                  <TableCell className="text-right text-brand-text-muted">{formatMoney(b.debitTotal)}</TableCell>
                  <TableCell className="text-right text-brand-text-muted">{formatMoney(b.creditTotal)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="text-brand-text">Total</TableCell>
              <TableCell className="text-right text-brand-text">{formatMoney(totalDebit)}</TableCell>
              <TableCell className="text-right text-brand-text">{formatMoney(totalCredit)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
