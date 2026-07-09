import { getProfitAndLoss } from "@/lib/accounting/reports";
import { formatMoney } from "@/lib/money";

function firstDayOfYear() {
  return `${new Date().getFullYear()}-01-01`;
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function ProfitLossPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const { start, end } = await searchParams;
  const startDate = start ?? firstDayOfYear();
  const endDate = end ?? today();

  const report = await getProfitAndLoss(startDate, endDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Profit &amp; Loss</h1>
        <p className="text-sm text-brand-text-muted">
          {report.startDate} — {report.endDate}
        </p>
      </div>

      <div className="max-w-2xl space-y-6 rounded-brand border border-white/10 bg-brand-bg-elevated p-6">
        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-accent">Revenue</h2>
          {report.revenue.map((r) => (
            <div key={r.code} className="flex justify-between py-1 text-sm">
              <span className="text-brand-text-muted">{r.name}</span>
              <span className="text-brand-text">{formatMoney(r.amount)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-sm font-medium">
            <span className="text-brand-text">Total Revenue</span>
            <span className="text-brand-text">{formatMoney(report.totalRevenue)}</span>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-accent">Cost of Services</h2>
          {report.cogs.map((c) => (
            <div key={c.code} className="flex justify-between py-1 text-sm">
              <span className="text-brand-text-muted">{c.name}</span>
              <span className="text-brand-text">{formatMoney(c.amount)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-sm font-medium">
            <span className="text-brand-text">Gross Profit</span>
            <span className="text-brand-text">{formatMoney(report.grossProfit)}</span>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-accent">Operating Expenses</h2>
          {report.opex.map((o) => (
            <div key={o.code} className="flex justify-between py-1 text-sm">
              <span className="text-brand-text-muted">{o.name}</span>
              <span className="text-brand-text">{formatMoney(o.amount)}</span>
            </div>
          ))}
        </section>

        <div className="flex justify-between border-t border-white/10 pt-3 font-heading text-lg">
          <span className="text-brand-text">Net Income</span>
          <span className={report.netIncome >= 0 ? "text-brand-primary" : "text-destructive"}>
            {formatMoney(report.netIncome)}
          </span>
        </div>
      </div>
    </div>
  );
}
