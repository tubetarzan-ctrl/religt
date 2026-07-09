import { createClient } from "@/lib/supabase/server";
import { getGeneralLedger } from "@/lib/accounting/reports";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney } from "@/lib/money";

export default async function GeneralLedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const { account } = await searchParams;
  const supabase = await createClient();
  const { data: accounts } = await supabase.from("chart_of_accounts").select("id, code, name").order("code");

  const selectedAccountId = account ?? accounts?.[0]?.id;
  const rows = selectedAccountId ? await getGeneralLedger(selectedAccountId) : [];
  const selected = accounts?.find((a) => a.id === selectedAccountId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">General Ledger</h1>
        <p className="text-sm text-brand-text-muted">
          {selected ? `${selected.code} — ${selected.name}` : "Select an account"}
        </p>
      </div>

      <form className="flex gap-2">
        <select
          name="account"
          defaultValue={selectedAccountId}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-brand-text"
        >
          {(accounts ?? []).map((a) => (
            <option key={a.id} value={a.id}>
              {a.code} — {a.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm text-white">
          View
        </button>
      </form>

      <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Running Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="text-brand-text-muted">{row.date}</TableCell>
                <TableCell className="text-brand-text-muted">{row.memo}</TableCell>
                <TableCell className="text-brand-text-muted">{row.reference}</TableCell>
                <TableCell className="text-right text-brand-text-muted">{row.debit ? formatMoney(row.debit) : "—"}</TableCell>
                <TableCell className="text-right text-brand-text-muted">{row.credit ? formatMoney(row.credit) : "—"}</TableCell>
                <TableCell className="text-right text-brand-text">{formatMoney(row.runningBalance)}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-brand-text-muted">
                  No activity for this account.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
