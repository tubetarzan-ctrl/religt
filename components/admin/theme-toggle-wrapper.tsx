"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/** Wraps the admin panel and lets staff flip between dark/light — separate from
 * the public site's 10-theme system (Section 5.4), just a personal preference
 * saved to this browser via localStorage. */
export function AdminThemeWrapper({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLight(localStorage.getItem("admin-theme") === "light");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("admin-theme", light ? "light" : "dark");
  }, [light, mounted]);

  return (
    <div className={light ? "admin-theme-light flex min-h-screen bg-brand-bg" : "admin-theme flex min-h-screen bg-brand-bg"}>
      {children}
      <button
        type="button"
        onClick={() => setLight((v) => !v)}
        title={light ? "Switch to dark mode" : "Switch to light mode"}
        className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-brand-bg-elevated text-brand-text shadow-lg hover:opacity-90"
      >
        {light ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
    </div>
  );
}
