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
        //  IMMUTABLE PALETTE
        // Overriding default palette to ensure strict adherence
        white: "#FFFFFF",
        "off-white": "#F9FAFB", // Slate-50 equivalent
        
        // Grey Spectrum (Light to Dark)
        grey: {
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
        },

        // Strict Blacks 
        "subtle-black": "#1a1a1a", 
        black: "#000000",
      },
      fontFamily: {
        // Ensuring typography-first layouts 
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;