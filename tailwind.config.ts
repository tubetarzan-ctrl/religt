import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          dark: "var(--primary-dark)",
          soft: "var(--primary-soft)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          soft: "var(--accent-soft)",
          ink: "var(--accent-ink)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        // Religious Tours brand tokens (Section 5 design system) — back-compat
        // aliases pointing at the active theme, see app/globals.css.
        brand: {
          bg: "var(--rt-bg)",
          "bg-elevated": "var(--rt-bg-elevated)",
          primary: "var(--rt-primary)",
          accent: "var(--rt-accent)",
          text: "var(--rt-text)",
          "text-muted": "var(--rt-text-muted)",
        },
        // Section 5.4 theme-engine tokens, used directly by the hero carousel,
        // footer, and anywhere else that needs the prototype's exact palette.
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        line: "var(--line)",
        hero: {
          g1: "var(--hero-g1)",
          g2: "var(--hero-g2)",
          g3: "var(--hero-g3)",
          text: "var(--hero-text)",
          muted: "var(--hero-muted)",
        },
        footer: {
          bg: "var(--footer-bg)",
          text: "var(--footer-text)",
        },
        on: {
          primary: "var(--on-primary)",
          accent: "var(--on-accent)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        brand: "var(--rt-radius)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "var(--rt-shadow-card)",
        "card-lg": "var(--shadow-lg-brand)",
      },
    },
  },
  plugins: [],
};
export default config;
