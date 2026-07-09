import { createClient } from "@/lib/supabase/server";
import { KnowledgeBaseManager } from "@/components/admin/knowledge-base-manager";
import { StaffRoleSelect } from "@/components/admin/staff-role-select";
import { ThemePicker } from "@/components/admin/theme-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_THEME } from "@/lib/themes";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const [{ data: knowledge }, { data: staff }, { data: themeSetting }] = await Promise.all([
    supabase.from("chatbot_knowledge").select("*").order("hit_count", { ascending: false }),
    supabase.from("profiles").select("*").neq("role", "customer").order("full_name"),
    supabase.from("site_settings").select("value").eq("key", "active_theme").maybeSingle(),
  ]);

  const currentTheme = (themeSetting?.value as string | undefined) ?? DEFAULT_THEME;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Settings</h1>
        <p className="text-sm text-brand-text-muted">
          Appearance, chatbot knowledge base, WhatsApp templates, and staff user management.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg text-brand-text">Appearance</h2>
        <p className="text-sm text-brand-text-muted">
          Pick a theme for the public site. Applies instantly to every landing page — no redeploy needed.
        </p>
        <ThemePicker currentTheme={currentTheme} />
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg text-brand-text">Chatbot Knowledge Base</h2>
        <p className="text-sm text-brand-text-muted">
          Static Q&amp;A the WhatsApp/email bot checks before ever calling gpt-4o-mini — every entry
          added here is a call avoided.
        </p>
        <KnowledgeBaseManager entries={knowledge ?? []} />
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg text-brand-text">Staff Users</h2>
        <div className="rounded-brand border border-white/10 bg-brand-bg-elevated">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(staff ?? []).map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="text-brand-text">{profile.full_name ?? "—"}</TableCell>
                  <TableCell className="text-brand-text-muted">{profile.phone ?? "—"}</TableCell>
                  <TableCell>
                    <StaffRoleSelect userId={profile.id} role={profile.role} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
