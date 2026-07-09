import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  inquiry: "bg-muted text-brand-text-muted",
  quoted: "bg-blue-500/15 text-blue-400",
  confirmed: "bg-brand-primary/15 text-brand-primary",
  paid: "bg-brand-accent/15 text-brand-accent",
  completed: "bg-emerald-500/15 text-emerald-400",
  cancelled: "bg-destructive/15 text-destructive",
  pending: "bg-brand-accent/15 text-brand-accent",
  verified: "bg-brand-primary/15 text-brand-primary",
  rejected: "bg-destructive/15 text-destructive",
  open: "bg-blue-500/15 text-blue-400",
  auto_published: "bg-brand-primary/15 text-brand-primary",
  pending_review: "bg-brand-accent/15 text-brand-accent",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? "bg-muted text-brand-text-muted"} variant="outline">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
