import { createClient } from "@/lib/supabase/server";
import { GalleryUploader } from "@/components/admin/gallery-uploader";
import { GalleryGrid } from "@/components/admin/gallery-grid";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(300);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-brand-text">Gallery Manager</h1>
        <p className="text-sm text-brand-text-muted">Hotel images and past-trip photo catalog.</p>
      </div>
      <GalleryUploader />
      <GalleryGrid images={images ?? []} />
    </div>
  );
}
