import type { Config } from "tailwindcss";

// We want to export the base config so apps can extend it
export const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF", 
        secondary: "#5856D6",
        background: "#000000",
        surface: "#1C1C1E",
      }
    },
  },
  plugins: [],
};
export default config;
