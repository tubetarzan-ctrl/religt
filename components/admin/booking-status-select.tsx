"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookingStatus } from "@/lib/actions/admin-bookings";

const STATUSES = ["inquiry", "quoted", "confirmed", "paid", "completed", "cancelled"];

export function BookingStatusSelect({ bookingId, status }: { bookingId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(async () => {
          try {
            await updateBookingStatus(bookingId, value);
            toast.success(`Booking marked ${value}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update status");
          }
        });
      }}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
