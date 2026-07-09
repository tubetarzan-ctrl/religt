"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { THEME_IDS } from "@/lib/themes";

/**
 * Lets the Appearance admin preview a theme inside an iframe (`/?previewTheme=x`)
 * without touching site_settings — the server always renders the real active
 * theme; this just overrides body[data-theme] client-side when the param is
 * present, which only ever happens inside the admin preview iframe.
 */
export function ThemePreviewOverride() {
  const searchParams = useSearchParams();
  const previewTheme = searchParams.get("previewTheme");

  useEffect(() => {
    if (previewTheme && THEME_IDS.includes(previewTheme)) {
      document.body.setAttribute("data-theme", previewTheme);
    }
  }, [previewTheme]);

  return null;
}
