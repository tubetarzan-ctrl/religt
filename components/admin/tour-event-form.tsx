"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import type { TourEventFormState } from "@/lib/actions/admin-tour-events";
import { fromSmallestUnit } from "@/lib/money";
import type { Database } from "@/types/database";

type TourEvent = Database["public"]["Tables"]["tour_events"]["Row"];

const VERTICALS = ["iraq_ziarat", "iran_ziarat", "umrah", "air_ticket", "visa", "sunni_group"];
const SECTS = ["sunni", "shia", "general"];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-primary hover:bg-brand-primary/90">
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function TourEventForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: TourEventFormState, formData: FormData) => Promise<TourEventFormState>;
  initial?: TourEvent;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, { status: "idle" } as TourEventFormState);
  const [vertical, setVertical] = useState(initial?.vertical ?? "iraq_ziarat");
  const [sect, setSect] = useState(initial?.sect ?? "general");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [posterUrl, setPosterUrl] = useState(initial?.poster_image_url ?? "");

  return (
    <form action={formAction} className="space-y-6 rounded-brand border border-border bg-brand-bg-elevated p-6">
      <input type="hidden" name="vertical" value={vertical} />
      <input type="hidden" name="sect" value={sect} />

      {state.status === "error" && (
        <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{state.message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Vertical</Label>
          <Select value={vertical} onValueChange={(v) => v && setVertical(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERTICALS.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Sect</Label>
          <Select value={sect} onValueChange={(v) => v && setSect(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={initial?.title} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={initial?.slug} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" name="start_date" type="date" defaultValue={initial?.start_date} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" name="end_date" type="date" defaultValue={initial?.end_date} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration_days">Duration (days)</Label>
          <Input id="duration_days" name="duration_days" type="number" defaultValue={initial?.duration_days ?? undefined} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" name="capacity" type="number" defaultValue={initial?.capacity ?? 0} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price_amount">Price (PKR)</Label>
          <Input
            id="price_amount"
            name="price_amount"
            type="number"
            step="0.01"
            defaultValue={initial ? fromSmallestUnit(initial.price_amount) : undefined}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue={initial?.currency ?? "PKR"} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="guide_name">Guide Name</Label>
          <Input id="guide_name" name="guide_name" defaultValue={initial?.guide_name ?? undefined} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guide_bio">Guide Bio</Label>
          <Textarea id="guide_bio" name="guide_bio" defaultValue={initial?.guide_bio ?? undefined} rows={2} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Poster / Hero Image</Label>
        <p className="text-xs text-brand-text-muted">
          Shows on the departure card and the hero carousel for this vertical. Uploads to UploadThing —
          swaps out the placeholder artwork automatically once set.
        </p>
        <input type="hidden" name="poster_image_url" value={posterUrl} />
        <div className="flex items-center gap-4">
          {posterUrl && (
            <div className="relative h-20 w-32 overflow-hidden rounded-md border border-border">
              <Image src={posterUrl} alt="Poster preview" fill className="object-cover" />
            </div>
          )}
          <UploadButton
            endpoint="galleryImage"
            content={{
              button: (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Poster
                </span>
              ),
              allowedContent: "Images up to 8MB, max 20",
            }}
            appearance={{
              button:
                "bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-primary/90 ut-uploading:bg-brand-primary/60 ut-readying:bg-brand-primary/60",
              allowedContent: "text-xs text-brand-text-muted",
              container: "items-start",
            }}
            onClientUploadComplete={(res) => {
              if (res[0]) {
                setPosterUrl(res[0].url);
                toast.success("Poster uploaded");
              }
            }}
            onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`); }}
          />
          {posterUrl && (
            <Button type="button" variant="outline" size="sm" onClick={() => setPosterUrl("")}>
              Remove
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="featured"
          checked={featured}
          onCheckedChange={(checked) => setFeatured(checked === true)}
        />
        <input type="hidden" name="featured" value={featured ? "on" : "off"} />
        <Label htmlFor="featured" className="cursor-pointer">
          Featured — appears in the hero tour carousel (Section 5.3)
        </Label>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
