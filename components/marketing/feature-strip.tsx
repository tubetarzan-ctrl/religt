const DEFAULT_ITEMS = [
  "Visa processing included",
  "Hotels 5-min walk from haram",
  "Scholar-guided ziarat program",
  "Direct & via-Gulf flights",
  "Ladies & family friendly groups",
  "24/7 coordinator on ground",
];

export function FeatureStrip({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap bg-accent py-3 text-sm font-bold text-on-accent">
      <div className="inline-block animate-[marquee_28s_linear_infinite]">
        {doubled.map((item, i) => (
          <span key={i} className="mx-6">
            ✦ {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
