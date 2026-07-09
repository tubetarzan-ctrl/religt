import { createClient } from "@/lib/supabase/server";
import { KnowledgeBaseManager } from "@/components/admin/knowledge-base-manager";
import { StaffRoleSelect } from "@/components/admin/staff-role-select";
import { ThemePicker } from "@/components/admin/theme-picker";
import { AnnouncementBarEditor } from "@/components/admin/announcement-bar-editor";
import { VerticalTileImagesEditor } from "@/components/admin/vertical-tile-images-editor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_THEME } from "@/lib/themes";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const [{ data: knowledge }, { data: staff }, { data: themeSetting }, { data: announcementSetting }, { data: tileImagesSetting }] =
    await Promise.all([
      supabase.from("chatbot_knowledge").select("*").order("hit_count", { ascending: false }),
      supabase.from("profiles").select("*").neq("role", "customer").order("full_name"),
      supabase.from("site_settings").select("value").eq("key", "active_theme").maybeSingle(),
      supabase.from("site_settings").select("value").eq("key", "announcement_bar_text").maybeSingle(),
      supabase.from("site_settings").select("value").eq("key", "vertical_tile_images").maybeSingle(),
    ]);

  const currentTheme = (themeSetting?.value as string | undefined) ?? DEFAULT_THEME;
  const currentAnnouncement =
    (announcementSetting?.value as string | undefined) ?? "📢 Next Karbala group departs 14 Aug 2026 — only 6 seats left";
  const tileImages = (tileImagesSetting?.value as Record<string, string> | undefined) ?? {};

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
        <h2 className="font-heading text-lg text-brand-text">Announcement Bar</h2>
        <p className="text-sm text-brand-text-muted">
          The scrolling message shown at the very top of every landing page. Applies instantly, no redeploy needed.
        </p>
        <AnnouncementBarEditor currentText={currentAnnouncement} />
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg text-brand-text">Homepage Tile Images</h2>
        <p className="text-sm text-brand-text-muted">
          The 6 service tiles on the homepage. Upload a photo to replace the default stock image for any
          vertical — applies instantly, no redeploy needed.
        </p>
        <VerticalTileImagesEditor images={tileImages} />
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
