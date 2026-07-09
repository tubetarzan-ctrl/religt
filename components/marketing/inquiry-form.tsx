"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitInquiry, type InquiryFormState } from "@/lib/actions/inquiries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Vertical } from "@/types/database";

const initialState: InquiryFormState = { status: "idle" };
const fieldClass =
  "border-[1.5px] border-line bg-bg text-ink placeholder:text-ink-soft focus-visible:border-primary focus-visible:ring-0";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-1.5 w-full rounded-full bg-primary py-6 text-on-primary hover:bg-primary-dark">
      {pending ? "Sending..." : "Send Inquiry →"}
    </Button>
  );
}

export function InquiryForm({
  vertical,
  groups = [],
}: {
  vertical: Vertical;
  groups?: string[];
}) {
  const [state, formAction] = useFormState(submitInquiry, initialState);
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || "#inquiry";
  const whatsappNumber =
    vertical === "sunni_group"
      ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_SUNNI ?? ""
      : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <div className="rounded-[18px] bg-surface p-[34px] text-ink shadow-card-lg">
      <h3 className="font-heading text-[23px] text-ink">Get group details &amp; price list</h3>
      <p className="mb-5 text-sm text-ink-soft">We&apos;ll WhatsApp you the full itinerary, hotel names and payment plan.</p>

      <form action={formAction} className="space-y-3.5">
        <input type="hidden" name="vertical" value={vertical} />
        {state.status !== "idle" && (
          <p
            className={
              state.status === "success"
                ? "rounded-md bg-primary-soft px-3 py-2 text-sm text-primary"
                : "rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive"
            }
          >
            {state.message}
          </p>
        )}
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" className="mb-1.5 block text-xs font-bold text-ink-soft">Full name</Label>
            <Input id="name" name="name" required className={fieldClass} />
          </div>
          <div>
            <Label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-ink-soft">WhatsApp number</Label>
            <Input id="phone" name="phone" required className={fieldClass} />
          </div>
        </div>

        {groups.length > 0 && (
          <div>
            <Label htmlFor="group" className="mb-1.5 block text-xs font-bold text-ink-soft">Which group?</Label>
            <select
              id="group"
              name="group"
              className="w-full rounded-[10px] border-[1.5px] border-line bg-bg px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
              <option value="Custom / family group">Custom / family group</option>
            </select>
          </div>
        )}

        <div>
          <Label htmlFor="message" className="mb-1.5 block text-xs font-bold text-ink-soft">Message (optional)</Label>
          <Textarea id="message" name="message" rows={3} placeholder="Number of travelers, elderly members, questions…" className={fieldClass} />
        </div>

        <SubmitButton />
      </form>

      <div className="mt-3.5 flex gap-2.5">
        <Button
          asChild
          className="flex-1 justify-center rounded-full bg-[#25D366] text-sm text-white hover:brightness-95"
        >
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Assalamualaikum, I want details of your groups")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 WhatsApp Instead
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 justify-center rounded-full border-[1.5px] border-primary text-sm text-primary hover:bg-primary-soft"
        >
          <a href={calLink} target="_blank" rel="noopener noreferrer">
            📅 Book a Call
          </a>
        </Button>
      </div>
    </div>
  );
}
