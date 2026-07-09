import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/admin/row-actions";
import { deleteTourEventInline } from "@/lib/actions/admin-tour-events";
import { formatMoney } from "@/lib/money";

export default async function AdminTourEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("tour_events")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-text">Tour Events</h1>
          <p className="text-sm text-brand-text-muted">Ziarat groups and Umrah batches.</p>
        </div>
        <Button asChild className="bg-brand-primary hover:bg-brand-primary/90">
          <Link href="/admin/tour-events/new">New Tour Event</Link>
        </Button>
      </div>

      <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Vertical</TableHead>
              <TableHead>Sect</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(events ?? []).map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Link href={`/admin/tour-events/${event.id}`} className="text-brand-text hover:text-brand-primary">
                    {event.title}
                  </Link>
                </TableCell>
                <TableCell className="text-brand-text-muted">{event.vertical}</TableCell>
                <TableCell className="text-brand-text-muted">{event.sect}</TableCell>
                <TableCell className="text-brand-text-muted">
                  {event.start_date} → {event.end_date}
                </TableCell>
                <TableCell className="text-brand-text-muted">
                  {event.seats_booked}/{event.capacity}
                </TableCell>
                <TableCell className="text-brand-text-muted">{formatMoney(event.price_amount, event.currency)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={event.status === "upcoming" ? "text-brand-primary" : "text-brand-text-muted"}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RowActions
                    editHref={`/admin/tour-events/${event.id}`}
                    deleteAction={deleteTourEventInline.bind(null, event.id)}
                    confirmMessage={`Delete "${event.title}"? This can't be undone.`}
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
