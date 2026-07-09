import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Inquiries / Leads</h1>
        <p className="text-sm text-brand-text-muted">Website inquiry-form submissions and WhatsApp-escalated leads.</p>
      </div>

      <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vertical</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(inquiries ?? []).map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="text-brand-text">{inquiry.name}</TableCell>
                <TableCell className="text-brand-text-muted">
                  {inquiry.phone}
                  {inquiry.email ? ` · ${inquiry.email}` : ""}
                </TableCell>
                <TableCell className="text-brand-text-muted">{inquiry.vertical}</TableCell>
                <TableCell className="max-w-xs truncate text-brand-text-muted">{inquiry.message}</TableCell>
                <TableCell className="text-brand-text-muted">{inquiry.source}</TableCell>
                <TableCell>
                  <InquiryStatusSelect id={inquiry.id} status={inquiry.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
