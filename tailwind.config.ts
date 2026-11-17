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
        ivory: {
          50: "#FCFBF7",
          100: "#F8F6F0",
          200: "#F1EDE2",
          300: "#E8E2D2",
          400: "#DFD7C2",
          DEFAULT: "#FAF9F5",
        },
        boutique: {
          dark: "#141413",
          black: "#0D0D0D",
          charcoal: "#262626",
          muted: "#737373",
          border: "#E5E3DC",
          card: "#FFFFFF",
          cream: "#F7F5EE",
          emerald: "#0D3D2E",
          gold: "#C5A880",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        widest: ".25em",
        ultra: ".35em",
      },
    },
  },
  plugins: [],
};
export default config;
