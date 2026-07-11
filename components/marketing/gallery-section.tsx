import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/marketing/fade-in";
import { GalleryTile } from "@/components/marketing/gallery-tile";
import type { LightboxItem } from "@/components/lightbox";

// tall = row-span-2, wide = col-span-2 — same pattern positions as the prototype.
const TILE_SHAPE = ["tall", "", "", "tall", "wide", ""];

const CATEGORY_LABEL: Record<string, string> = {
  hotel: "Hotel accommodation",
  shrine: "Shrine visit",
  group_photo: "Group moment",
};

export async function GallerySection({ slug }: { slug: string }) {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("landing_page_slug", slug)
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(24);

  if (!images || images.length === 0) return null;

  const items: LightboxItem[] = images.map((image) => {
    const label = CATEGORY_LABEL[image.category ?? ""] ?? "S.Religious Tours";
    if (image.media_type === "youtube" && image.youtube_video_id) {
      return { type: "youtube", src: image.youtube_video_id, alt: label };
    }
    return { type: "image", src: image.image_url ?? "", alt: label };
  });

  return (
    <section className="bg-bg py-[88px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary before:h-px before:w-[26px] before:bg-accent">
            Gallery
          </p>
          <h2 className="mt-2.5 font-heading text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink">
            Hotels, shrines &amp; group moments
          </h2>
        </FadeIn>
        <div className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:[grid-auto-rows:170px]">
          {images.map((image, i) => {
            const shape = TILE_SHAPE[i % TILE_SHAPE.length];
            const label = CATEGORY_LABEL[image.category ?? ""] ?? "S.Religious Tours";
            return (
              <FadeIn
                key={image.id}
                delay={i * 0.05}
                className={shape === "tall" ? "row-span-2" : shape === "wide" ? "col-span-2" : ""}
              >
                <div className="h-full min-h-[170px] overflow-hidden rounded-xl">
                  <GalleryTile items={items} index={i} label={label} />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
