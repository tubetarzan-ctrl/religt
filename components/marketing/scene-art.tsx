// Crafted SVG/gradient artwork standing in for real photography until Religious
// Tours supplies actual Ziarat/Umrah photos and video (Day 1 checklist, Section 16).
// Colors are drawn from the active theme's CSS variables (Section 5.4), not
// hardcoded hex, so this automatically matches whichever of the 10 themes is
// selected in Admin → Settings → Appearance.
// Swap points: replace the <SceneArt> usage in hero-carousel.tsx, past-trips.tsx,
// mood-section.tsx, and gallery-section.tsx with real <Image>/<video> once
// assets exist — the surrounding layout (aspect ratios, overlay gradients) is
// already built for that.

const VARIANT_PATHS: Record<string, string> = {
  // Central dome flanked by two minarets — used in the mood section.
  skyline:
    "M0,220 L0,150 L60,150 L60,90 Q60,60 90,60 Q120,60 120,90 L120,150 L170,150 " +
    "Q170,70 260,45 Q280,20 300,45 Q390,70 390,150 L440,150 L440,90 Q440,60 470,60 " +
    "Q500,60 500,90 L500,150 L560,150 L560,220 Z",
  // Simpler single-dome silhouette for smaller card art.
  dome: "M0,140 L0,110 L70,110 Q70,60 130,40 Q150,20 170,40 Q230,60 230,110 L300,110 L300,140 Z",
};

export function SceneArt({
  variant = "skyline",
  className = "",
}: {
  variant?: "skyline" | "dome";
  className?: string;
}) {
  const path = VARIANT_PATHS[variant];
  const viewBox = variant === "skyline" ? "0 0 560 220" : "0 0 300 140";

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--hero-g2)", stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: "var(--hero-g1)", stopOpacity: 0.05 }} />
        </linearGradient>
        <linearGradient id="scene-silhouette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--hero-g2)" }} />
          <stop offset="100%" style={{ stopColor: "var(--hero-g1)" }} />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#scene-sky)" />
      <circle
        cx={variant === "skyline" ? "300" : "170"}
        cy={variant === "skyline" ? "70" : "55"}
        r={variant === "skyline" ? "34" : "22"}
        style={{ fill: "var(--accent)" }}
        opacity="0.35"
      />
      <path d={path} fill="url(#scene-silhouette)" />
    </svg>
  );
}
