/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: We need to include the path to the shared UI package
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}" 
  ],
  presets: [require("nativewind/preset")],
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
