import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb) / <alpha-value>)", foreground: "#1A1A1A", accent: "#F97316",
        emerald: { DEFAULT: "rgb(var(--emerald-rgb) / <alpha-value>)", light: "rgb(var(--emerald-light-rgb) / <alpha-value>)", dark: "rgb(var(--emerald-dark-rgb) / <alpha-value>)" },
        gold: { DEFAULT: "rgb(var(--gold-rgb) / <alpha-value>)", light: "rgb(var(--gold-light-rgb) / <alpha-value>)", dark: "rgb(var(--gold-dark-rgb) / <alpha-value>)" },
        sand: "#E8D5B7", cream: "#FFF8E7", card: "#FFFFFF", muted: "#F5F5F4", border: "#E7E5E4",
        dark: { bg: "#0A0A0A", card: "#171717", border: "#2A2A2A", muted: "#1F1F1F" },
      },
      fontFamily: { amiri: ["var(--font-amiri)", "serif"], cairo: ["var(--font-cairo)", "sans-serif"], inter: ["var(--font-inter)", "sans-serif"] },
      boxShadow: { glow: "0 0 20px rgba(249,115,22,0.15)", "glow-gold": "0 0 20px rgba(212,175,55,0.2)", card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" },
      animation: { "fade-up": "fadeUp 0.5s ease-out forwards", "pulse-gold": "pulseGold 2s ease-in-out infinite" },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.4)" }, "50%": { boxShadow: "0 0 25px 5px rgba(212,175,55,0.2)" } },
      }
    },
  },
  plugins: [],
};
export default config;