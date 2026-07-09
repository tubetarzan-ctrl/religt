import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingStatusSelect } from "@/components/admin/booking-status-select";
import { RowActions } from "@/components/admin/row-actions";
import { deleteBooking } from "@/lib/actions/admin-bookings";
import { formatMoney } from "@/lib/money";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, tour_events(title), travelers(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Bookings</h1>
        <p className="text-sm text-brand-text-muted">All bookings across every vertical.</p>
      </div>

      <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Tour Event</TableHead>
              <TableHead>Pax</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(bookings ?? []).map((booking: any) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <Link href={`/admin/bookings/${booking.id}`} className="text-brand-text hover:text-brand-primary">
                    {booking.travelers?.[0]?.full_name ?? "—"}
                  </Link>
                </TableCell>
                <TableCell className="text-brand-text-muted">{booking.tour_events?.title ?? "—"}</TableCell>
                <TableCell className="text-brand-text-muted">{booking.pax_count}</TableCell>
                <TableCell className="text-brand-text-muted">{formatMoney(booking.total_amount)}</TableCell>
                <TableCell>
                  <BookingStatusSelect bookingId={booking.id} status={booking.status} />
                </TableCell>
                <TableCell className="text-brand-text-muted">
                  {new Date(booking.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <RowActions
                    editHref={`/admin/bookings/${booking.id}`}
                    deleteAction={deleteBooking.bind(null, booking.id)}
                    confirmMessage="Delete this booking? This can't be undone."
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
