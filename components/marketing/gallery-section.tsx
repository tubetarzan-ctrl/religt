import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SceneArt } from "@/components/marketing/scene-art";
import { FadeIn } from "@/components/marketing/fade-in";

// Matches the prototype's fixed 6-tile gradient variety (.gal-item nth-child).
const TILE_BACKGROUNDS = [
  "linear-gradient(140deg, var(--hero-g1), var(--hero-g3))",
  "linear-gradient(140deg, #8A6A1F, #C9A24B)",
  "linear-gradient(140deg, #37474F, #607D8B)",
  "linear-gradient(140deg, #4E342E, #8D6E63)",
  "linear-gradient(140deg, #1A3C34, #2E7D6B)",
  "linear-gradient(140deg, #B08D2F, #E4C878)",
];

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
    .limit(6);

  if (!images || images.length === 0) return null;

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
            const isRealUpload = image.image_url.startsWith("http");
            const shape = TILE_SHAPE[i % TILE_SHAPE.length];
            return (
              <FadeIn
                key={image.id}
                delay={i * 0.05}
                className={shape === "tall" ? "row-span-2" : shape === "wide" ? "col-span-2" : ""}
              >
                <div className="relative flex h-full min-h-[170px] items-end overflow-hidden rounded-xl p-3.5">
                  {isRealUpload ? (
                    <Image src={image.image_url} alt={CATEGORY_LABEL[image.category ?? ""] ?? ""} fill sizes="25vw" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: TILE_BACKGROUNDS[i % TILE_BACKGROUNDS.length] }}>
                      <SceneArt variant="dome" className="h-full w-full opacity-70" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-black/55" />
                  <span className="relative text-[13px] font-semibold text-white">
                    {CATEGORY_LABEL[image.category ?? ""] ?? "Religious Tours"}
                  </span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
