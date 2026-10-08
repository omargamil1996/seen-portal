import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF8",
        foreground: "#1A1A1A",
        accent: "#F97316",
        dark: "#0A0A0A",
        emerald: { DEFAULT: "#0F5132", light: "#1a7a4c", dark: "#0a3d25" },
        gold: { DEFAULT: "#D4AF37", light: "#e8c94a", dark: "#b8962e" },
        sand: "#E8D5B7",
        cream: "#FFF8E7",
        card: "#FFFFFF",
        muted: "#F5F5F4",
        border: "#E7E5E4",
      },
      fontFamily: {
        amiri: ["var(--font-amiri)", "serif"],
        cairo: ["var(--font-cairo)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "glow": "0 0 20px rgba(249,115,22,0.15)",
        "card": "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        "elevated": "0 4px 6px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "count-up": "countUp 1s ease-out forwards",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideIn: { "0%": { opacity: "0", transform: "translateX(-10px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.4)" }, "50%": { boxShadow: "0 0 20px 4px rgba(212,175,55,0.15)" } },
        countUp: { "0%": { opacity: "0", transform: "scale(0.8)" }, "100%": { opacity: "1", transform: "scale(1)" } },
      }
    },
  },
  plugins: [],
};
export default config;