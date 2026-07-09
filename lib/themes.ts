// Theme registry for the Appearance admin UI (Section 5.4). The full variable
// definitions per theme live in app/globals.css as body[data-theme="..."]
// blocks — this file only carries the id/name/swatch-preview metadata needed
// to render the picker grid.

export interface ThemeMeta {
  id: string;
  name: string;
  /** [primary, accent, background] — used to render the tri-color swatch button. */
  colors: [string, string, string];
}

export const THEMES: ThemeMeta[] = [
  { id: "emerald-gold", name: "Emerald & Gold", colors: ["#0E6B5C", "#C9A24B", "#FAF7F0"] },
  { id: "pure-light", name: "Pure Light", colors: ["#0F6FB8", "#E8A33D", "#F7F9FB"] },
  { id: "dark-emerald", name: "Dark Emerald", colors: ["#2FBFA0", "#D9B25C", "#0D1613"] },
  { id: "black-gold", name: "Black & Gold", colors: ["#C9A24B", "#E4C878", "#0B0B0B"] },
  { id: "royal-navy", name: "Royal Navy", colors: ["#1B2E5B", "#C9A24B", "#F5F7FA"] },
  { id: "karbala-maroon", name: "Karbala Maroon", colors: ["#7A1F2B", "#C9A24B", "#FBF6F3"] },
  { id: "desert-sand", name: "Desert Sand", colors: ["#8A6237", "#3E7C59", "#F6F1E7"] },
  { id: "midnight-silver", name: "Midnight Silver", colors: ["#8FA6D9", "#C8CEDC", "#0E1220"] },
  { id: "teal-coral", name: "Teal & Coral", colors: ["#0E7C7B", "#E4674E", "#F6FAF9"] },
  { id: "mono-slate", name: "Mono Slate", colors: ["#2E3B47", "#6B7B8C", "#F4F5F6"] },
  { id: "rose-quartz", name: "Rose Quartz", colors: ["#9C3A5B", "#C68A5D", "#FBF5F6"] },
  { id: "ottoman-turquoise", name: "Ottoman Turquoise", colors: ["#0D7A72", "#C87B3E", "#F3FAFA"] },
  { id: "amber-dusk", name: "Amber Dusk", colors: ["#D9762E", "#B69AE0", "#17110D"] },
  { id: "slate-jade", name: "Slate Jade", colors: ["#1F6B4A", "#A67C3D", "#F5F8F6"] },
];

export const DEFAULT_THEME = "emerald-gold";
export const THEME_IDS = THEMES.map((t) => t.id);
