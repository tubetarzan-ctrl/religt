import { TourEventForm } from "@/components/admin/tour-event-form";
import { createTourEvent } from "@/lib/actions/admin-tour-events";

export default function NewTourEventPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-brand-text">New Tour Event</h1>
      <TourEventForm action={createTourEvent} submitLabel="Create Tour Event" />
    </div>
  );
}
