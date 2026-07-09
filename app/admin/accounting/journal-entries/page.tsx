import { createClient } from "@/lib/supabase/server";
import { JournalEntryForm } from "@/components/admin/journal-entry-form";
import { JournalEntriesList } from "@/components/admin/journal-entries-list";

export default async function JournalEntriesPage() {
  const supabase = await createClient();

  const [{ data: accounts }, { data: entries }] = await Promise.all([
    supabase.from("chart_of_accounts").select("code, name").eq("is_active", true).order("code"),
    supabase
      .from("journal_entries")
      .select("*, journal_lines(*, chart_of_accounts(code, name))")
      .order("entry_date", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Journal Entries</h1>
        <p className="text-sm text-brand-text-muted">
          Manual entries and the full auto-posted ledger. Posted entries are reversed, never edited.
        </p>
      </div>

      <JournalEntryForm accounts={accounts ?? []} />

      <JournalEntriesList entries={entries ?? []} />
    </div>
  );
}
