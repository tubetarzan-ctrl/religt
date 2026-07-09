import { getBalanceSheet } from "@/lib/accounting/reports";
import { formatMoney } from "@/lib/money";

export default async function BalanceSheetPage({
  searchParams,
}: {
  searchParams: Promise<{ asOf?: string }>;
}) {
  const { asOf } = await searchParams;
  const asOfDate = asOf ?? new Date().toISOString().slice(0, 10);
  const sheet = await getBalanceSheet(asOfDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Balance Sheet</h1>
        <p className={`text-sm ${sheet.isBalanced ? "text-brand-primary" : "text-destructive"}`}>
          As of {sheet.asOfDate} · {sheet.isBalanced ? "Balanced" : "NOT BALANCED"}
        </p>
      </div>

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="rounded-brand border border-white/10 bg-brand-bg-elevated p-6">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-accent">Assets</h2>
          {sheet.assets.filter((a) => a.balance !== 0).map((a) => (
            <div key={a.id} className="flex justify-between py-1 text-sm">
              <span className="text-brand-text-muted">{a.name}</span>
              <span className="text-brand-text">{formatMoney(a.balance)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-medium">
            <span className="text-brand-text">Total Assets</span>
            <span className="text-brand-text">{formatMoney(sheet.totalAssets)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-brand border border-white/10 bg-brand-bg-elevated p-6">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-accent">Liabilities</h2>
            {sheet.liabilities.filter((l) => l.balance !== 0).map((l) => (
              <div key={l.id} className="flex justify-between py-1 text-sm">
                <span className="text-brand-text-muted">{l.name}</span>
                <span className="text-brand-text">{formatMoney(l.balance)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-medium">
              <span className="text-brand-text">Total Liabilities</span>
              <span className="text-brand-text">{formatMoney(sheet.totalLiabilities)}</span>
            </div>
          </div>

          <div className="rounded-brand border border-white/10 bg-brand-bg-elevated p-6">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-accent">Equity</h2>
            {sheet.equity.filter((e) => e.balance !== 0).map((e) => (
              <div key={e.id} className="flex justify-between py-1 text-sm">
                <span className="text-brand-text-muted">{e.name}</span>
                <span className="text-brand-text">{formatMoney(e.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1 text-sm">
              <span className="text-brand-text-muted">Current Period Net Income</span>
              <span className="text-brand-text">{formatMoney(sheet.currentPeriodNetIncome)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-medium">
              <span className="text-brand-text">Total Equity</span>
              <span className="text-brand-text">{formatMoney(sheet.totalEquity)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
