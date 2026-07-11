import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminThemeWrapper } from "@/components/admin/theme-toggle-wrapper";
import { LightboxProvider } from "@/components/lightbox";
import type { Role } from "@/types/database";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /admin/login has its own standalone layout (no sidebar) — middleware already
  // exempts it from the auth redirect, so just pass it through here too.
  if (!user) {
    return <div className="admin-theme">{children}</div>;
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile) redirect("/admin/login");

  return (
    <LightboxProvider>
      <AdminThemeWrapper>
        <AdminSidebar role={profile.role as Role} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </AdminThemeWrapper>
    </LightboxProvider>
  );
}
