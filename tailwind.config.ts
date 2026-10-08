import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { background: "#FAFAF8", foreground: "#1A1A1A", accent: "#F97316", dark: "#0A0A0A", emerald: "#0F5132", gold: "#D4AF37", sand: "#E8D5B7" },
      fontFamily: { amiri: ["var(--font-amiri)"], cairo: ["var(--font-cairo)"] }
    },
  },
  plugins: [],
};
export default config;