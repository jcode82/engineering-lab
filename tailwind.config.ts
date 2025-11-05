import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
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
      fontSize: {
        'xs':  ['0.75rem', { lineHeight: '1rem' }],
        'sm':  ['0.875rem', { lineHeight: '1.25rem' }],
        'base':['1rem', { lineHeight: '1.6' }],
        'lg':  ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':  ['1.25rem', { lineHeight: '1.8' }],
        '2xl': ['1.5rem', { lineHeight: '1.9' }],
        '3xl': ['1.875rem', { lineHeight: '2.1rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.4rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      fontWeight: {
        thin: "100",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
