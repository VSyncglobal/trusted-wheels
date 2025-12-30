import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        "off-white": "#f5f5f5",
        "subtle-black": "#1a1a1a",
        "strong-black": "#000000",
      },
    },
  },
  plugins: [],
};
export default config;