import { createClient } from "@/lib/supabase/server";

export interface AccountBalance {
  id: string;
  code: string;
  name: string;
  type: string;
  subtype: string | null;
  normalBalance: "debit" | "credit";
  debitTotal: number;
  creditTotal: number;
  balance: number; // signed per normal_balance
}

/**
 * Section 7.5: every report is derived live from journal_lines, formula-driven
 * off the chart_of_accounts numbering block + subtype — no hardcoded account lists.
 */
export async function getAccountBalances(asOfDate?: string): Promise<AccountBalance[]> {
  const supabase = await createClient();

  const { data: accounts } = await supabase
    .from("chart_of_accounts")
    .select("*")
    .eq("is_active", true)
    .order("code", { ascending: true });

  let query = supabase.from("journal_lines").select("account_id, debit, credit, journal_entries!inner(entry_date, posted)");
  if (asOfDate) query = query.lte("journal_entries.entry_date", asOfDate);
  const { data: lines } = await query;

  const totals = new Map<string, { debit: number; credit: number }>();
  for (const line of (lines ?? []) as any[]) {
    if (!line.journal_entries?.posted) continue;
    const entry = totals.get(line.account_id) ?? { debit: 0, credit: 0 };
    entry.debit += line.debit ?? 0;
    entry.credit += line.credit ?? 0;
    totals.set(line.account_id, entry);
  }

  return (accounts ?? []).map((account) => {
    const t = totals.get(account.id) ?? { debit: 0, credit: 0 };
    const balance = account.normal_balance === "debit" ? t.debit - t.credit : t.credit - t.debit;
    return {
      id: account.id,
      code: account.code,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      normalBalance: account.normal_balance,
      debitTotal: t.debit,
      creditTotal: t.credit,
      balance,
    };
  });
}

export async function getTrialBalance(asOfDate?: string) {
  const balances = await getAccountBalances(asOfDate);
  const totalDebit = balances.reduce((sum, b) => sum + b.debitTotal, 0);
  const totalCredit = balances.reduce((sum, b) => sum + b.creditTotal, 0);
  return { balances, totalDebit, totalCredit, isBalanced: totalDebit === totalCredit };
}

export async function getProfitAndLoss(startDate: string, endDate: string) {
  const supabase = await createClient();

  const { data: accounts } = await supabase
    .from("chart_of_accounts")
    .select("*")
    .in("type", ["revenue", "expense"])
    .eq("is_active", true)
    .order("code", { ascending: true });

  const { data: lines } = await supabase
    .from("journal_lines")
    .select("account_id, debit, credit, journal_entries!inner(entry_date, posted)")
    .gte("journal_entries.entry_date", startDate)
    .lte("journal_entries.entry_date", endDate);

  const totals = new Map<string, { debit: number; credit: number }>();
  for (const line of (lines ?? []) as any[]) {
    if (!line.journal_entries?.posted) continue;
    const entry = totals.get(line.account_id) ?? { debit: 0, credit: 0 };
    entry.debit += line.debit ?? 0;
    entry.credit += line.credit ?? 0;
    totals.set(line.account_id, entry);
  }

  const revenue: { code: string; name: string; vertical: string | null; amount: number }[] = [];
  const cogs: { code: string; name: string; amount: number }[] = [];
  const opex: { code: string; name: string; amount: number }[] = [];

  for (const account of accounts ?? []) {
    const t = totals.get(account.id) ?? { debit: 0, credit: 0 };
    if (account.type === "revenue") {
      revenue.push({ code: account.code, name: account.name, vertical: account.vertical, amount: t.credit - t.debit });
    } else if (account.subtype === "cogs") {
      cogs.push({ code: account.code, name: account.name, amount: t.debit - t.credit });
    } else {
      opex.push({ code: account.code, name: account.name, amount: t.debit - t.credit });
    }
  }

  const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
  const totalCogs = cogs.reduce((s, c) => s + c.amount, 0);
  const grossProfit = totalRevenue - totalCogs;
  const totalOpex = opex.reduce((s, o) => s + o.amount, 0);
  const netIncome = grossProfit - totalOpex;

  return { revenue, cogs, opex, totalRevenue, totalCogs, grossProfit, totalOpex, netIncome, startDate, endDate };
}

export async function getBalanceSheet(asOfDate: string) {
  const balances = await getAccountBalances(asOfDate);

  const assets = balances.filter((b) => b.type === "asset");
  const liabilities = balances.filter((b) => b.type === "liability");
  const equity = balances.filter((b) => b.type === "equity");

  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);

  // Current-period net income rolls into equity until year-end close posts it to
  // Retained Earnings (Section 7.7) — include it here so the sheet balances mid-year.
  const pnl = await getProfitAndLoss("1970-01-01", asOfDate);
  const totalEquity = equity.reduce((s, a) => s + a.balance, 0) + pnl.netIncome;

  return {
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity,
    currentPeriodNetIncome: pnl.netIncome,
    isBalanced: totalAssets === totalLiabilities + totalEquity,
    asOfDate,
  };
}

export interface AgingRow {
  name: string;
  current: number;
  d1_30: number;
  d31_60: number;
  d61_90: number;
  d90_plus: number;
  total: number;
}

async function getAgingReport(subtype: "ar" | "ap", groupKey: "customer_id" | "vendor_id") {
  const supabase = await createClient();
  const today = new Date();

  const { data: lines } = await supabase
    .from("journal_lines")
    .select(`debit, credit, ${groupKey}, journal_entries!inner(entry_date, posted), chart_of_accounts!inner(subtype)`)
    .eq("chart_of_accounts.subtype", subtype);

  const buckets = new Map<string, AgingRow>();

  for (const line of (lines ?? []) as any[]) {
    if (!line.journal_entries?.posted) continue;
    const key = line[groupKey] ?? "unassigned";
    const net = subtype === "ar" ? (line.debit ?? 0) - (line.credit ?? 0) : (line.credit ?? 0) - (line.debit ?? 0);
    if (net === 0) continue;

    const days = Math.floor((today.getTime() - new Date(line.journal_entries.entry_date).getTime()) / 86400000);
    const row = buckets.get(key) ?? { name: key, current: 0, d1_30: 0, d31_60: 0, d61_90: 0, d90_plus: 0, total: 0 };

    if (days <= 0) row.current += net;
    else if (days <= 30) row.d1_30 += net;
    else if (days <= 60) row.d31_60 += net;
    else if (days <= 90) row.d61_90 += net;
    else row.d90_plus += net;
    row.total += net;

    buckets.set(key, row);
  }

  return Array.from(buckets.values()).filter((r) => r.total !== 0);
}

export const getArAging = () => getAgingReport("ar", "customer_id");
export const getApAging = () => getAgingReport("ap", "vendor_id");

export async function getGeneralLedger(accountId: string, startDate?: string, endDate?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("journal_lines")
    .select("*, journal_entries!inner(entry_date, memo, reference, posted, tour_event_id)")
    .eq("account_id", accountId)
    .order("journal_entries(entry_date)", { ascending: true });

  if (startDate) query = query.gte("journal_entries.entry_date", startDate);
  if (endDate) query = query.lte("journal_entries.entry_date", endDate);

  const { data: lines } = await query;

  let running = 0;
  const rows = (lines ?? []).map((line: any) => {
    running += (line.debit ?? 0) - (line.credit ?? 0);
    return {
      date: line.journal_entries.entry_date,
      memo: line.memo ?? line.journal_entries.memo,
      reference: line.journal_entries.reference,
      debit: line.debit,
      credit: line.credit,
      runningBalance: running,
    };
  });

  return rows;
}
