import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Merge: keep your CSS-var hooks, add the full palette
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: {
          50: "#E7F0FF",
          100: "#C9DCFF",
          200: "#A4C3FF",
          300: "#7EA9FF",
          400: "#4D8AFF",
          500: "#2563EB", // main brand blue
          600: "#1E4ECB",
          700: "#1A3E9E",
          800: "#152F77",
          900: "#10214F",
        },
        accent: {
          50: "#E9FBF0",
          100: "#C6F6D5",
          200: "#9AE6B4",
          300: "#68D391",
          400: "#48BB78",
          500: "#22C55E", // lab green
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        highlight: "#F97316",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
