import { createClient } from "@/lib/supabase/server";
import { PastGroupForm } from "@/components/admin/past-group-form";
import { PastGroupList } from "@/components/admin/past-group-list";

export default async function AdminPastGroupsPage() {
  const supabase = await createClient();

  const [{ data: cards }, { data: tourEvents }] = await Promise.all([
    supabase.from("past_group_cards").select("*").order("sort_order", { ascending: true }),
    supabase.from("tour_events").select("id, title").order("start_date", { ascending: false }).limit(100),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Past Groups Manager</h1>
        <p className="text-sm text-brand-text-muted">
          Curated case-study cards for the Past Trips section (Section 5.5) — takes display priority over
          auto-generated past departures, most recent 3 by sort order shown per landing page.
        </p>
      </div>

      <PastGroupForm tourEvents={tourEvents ?? []} />
      <PastGroupList cards={cards ?? []} />
    </div>
  );
}
