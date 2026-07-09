import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminEmailEscalationsPage() {
  const supabase = await createClient();
  const { data: threads } = await supabase
    .from("email_threads")
    .select("*")
    .eq("escalated", true)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Email Escalations</h1>
        <p className="text-sm text-brand-text-muted">
          Refund/complaint emails and payment-proof emails routed here for manual response.
        </p>
      </div>

      <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(threads ?? []).map((thread) => (
              <TableRow key={thread.id}>
                <TableCell className="text-brand-text">{thread.sender_email}</TableCell>
                <TableCell className="text-brand-text-muted">{thread.subject}</TableCell>
                <TableCell>
                  <StatusBadge status={thread.classification ?? "unknown"} />
                </TableCell>
                <TableCell className="text-brand-text-muted">
                  {new Date(thread.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {(!threads || threads.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-brand-text-muted">
                  No escalations.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
