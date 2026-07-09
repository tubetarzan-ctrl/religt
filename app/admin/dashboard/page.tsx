import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [{ count: todaysBookings }, { count: pendingPayments }, { data: upcomingDepartures }, { data: journalLines }] =
    await Promise.all([
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${today}T00:00:00`),
      supabase.from("payment_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase
        .from("tour_events")
        .select("*")
        .eq("status", "upcoming")
        .lte("start_date", in30Days)
        .order("start_date", { ascending: true }),
      supabase
        .from("journal_lines")
        .select("debit, credit, account_id, chart_of_accounts(subtype)")
        .limit(5000),
    ]);

  let cashPosition = 0;
  let arBalance = 0;
  let apBalance = 0;
  if (journalLines) {
    for (const line of journalLines as any[]) {
      const subtype = line.chart_of_accounts?.subtype;
      const net = (line.debit ?? 0) - (line.credit ?? 0);
      if (subtype === "cash") cashPosition += net;
      if (subtype === "ar") arBalance += net;
      if (subtype === "ap") apBalance += -net;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Dashboard</h1>
        <p className="text-sm text-brand-text-muted">Overview of today&apos;s operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-brand-bg-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-text-muted">Today&apos;s Bookings</CardTitle>
          </CardHeader>
          <CardContent className="font-heading text-2xl text-brand-text">{todaysBookings ?? 0}</CardContent>
        </Card>
        <Card className="border-white/10 bg-brand-bg-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-text-muted">Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent className="font-heading text-2xl text-brand-accent">{pendingPayments ?? 0}</CardContent>
        </Card>
        <Card className="border-white/10 bg-brand-bg-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-text-muted">Cash Position</CardTitle>
          </CardHeader>
          <CardContent className="font-heading text-2xl text-brand-primary">{formatMoney(cashPosition)}</CardContent>
        </Card>
        <Card className="border-white/10 bg-brand-bg-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-text-muted">AR / AP</CardTitle>
          </CardHeader>
          <CardContent className="font-heading text-lg text-brand-text">
            {formatMoney(arBalance)} / {formatMoney(apBalance)}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-brand-bg-elevated">
        <CardHeader>
          <CardTitle className="text-brand-text">Upcoming Departures (next 30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {!upcomingDepartures || upcomingDepartures.length === 0 ? (
            <p className="text-sm text-brand-text-muted">No departures in the next 30 days.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {upcomingDepartures.map((event) => (
                <li key={event.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/admin/tour-events/${event.id}`} className="text-sm text-brand-text hover:text-brand-primary">
                      {event.title}
                    </Link>
                    <p className="text-xs text-brand-text-muted">{event.start_date}</p>
                  </div>
                  <span className="text-xs text-brand-text-muted">
                    {event.seats_booked}/{event.capacity} booked
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
