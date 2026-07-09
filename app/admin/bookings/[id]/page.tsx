import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusSelect } from "@/components/admin/booking-status-select";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatMoney } from "@/lib/money";

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: booking }, { data: travelers }, { data: payments }] = await Promise.all([
    supabase.from("bookings").select("*, tour_events(*)").eq("id", id).maybeSingle(),
    supabase.from("travelers").select("*").eq("booking_id", id),
    supabase.from("payment_submissions").select("*").eq("booking_id", id).order("created_at", { ascending: false }),
  ]);

  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-text">Booking Detail</h1>
          <p className="text-sm text-brand-text-muted">{(booking as any).tour_events?.title}</p>
        </div>
        <BookingStatusSelect bookingId={booking.id} status={booking.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-brand-bg-elevated">
          <CardHeader>
            <CardTitle className="text-brand-text">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-brand-text-muted">
            <p>Pax count: {booking.pax_count}</p>
            <p>Total amount: {formatMoney(booking.total_amount)}</p>
            <p>Payment plan: {booking.payment_plan}</p>
            <p>Created: {new Date(booking.created_at).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-brand-bg-elevated">
          <CardHeader>
            <CardTitle className="text-brand-text">Travelers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(travelers ?? []).map((traveler) => (
              <div key={traveler.id} className="rounded-md bg-brand-bg p-3 text-sm text-brand-text-muted">
                <p className="text-brand-text">{traveler.full_name}</p>
                <p>Passport: {traveler.passport_number ?? "not submitted"}</p>
                <p>Visa status: {traveler.visa_status}</p>
              </div>
            ))}
            {(!travelers || travelers.length === 0) && (
              <p className="text-sm text-brand-text-muted">No travelers added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-brand-bg-elevated">
        <CardHeader>
          <CardTitle className="text-brand-text">Payment Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(payments ?? []).map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md bg-brand-bg p-3 text-sm">
              <div>
                <a href={p.proof_url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                  View proof
                </a>
                <p className="text-brand-text-muted">
                  Claimed: {p.claimed_amount ? formatMoney(p.claimed_amount) : "—"} · {p.bank_account_used ?? "—"}
                </p>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
          {(!payments || payments.length === 0) && (
            <p className="text-sm text-brand-text-muted">No payment proof submitted yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
