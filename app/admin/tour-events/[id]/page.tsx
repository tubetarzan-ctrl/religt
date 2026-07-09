import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TourEventForm } from "@/components/admin/tour-event-form";
import { updateTourEvent, deleteTourEvent } from "@/lib/actions/admin-tour-events";
import { Button } from "@/components/ui/button";

export default async function EditTourEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("tour_events").select("*").eq("id", id).maybeSingle();

  if (!event) notFound();

  const boundUpdate = updateTourEvent.bind(null, id);
  const boundDelete = deleteTourEvent.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-brand-text">Edit Tour Event</h1>
        <form action={boundDelete}>
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </form>
      </div>
      <TourEventForm action={boundUpdate} initial={event} submitLabel="Save Changes" />
    </div>
  );
}
