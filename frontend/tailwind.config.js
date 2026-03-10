/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      colors: {

        primary: "#6366F1",
        secondary: "#8B5CF6",
        accent: "#22C55E",

        darkbg: "#020617",

      },

      backdropBlur: {
        xs: "2px",
      },

      boxShadow: {
        glow: "0 0 15px rgba(99,102,241,0.6)",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },

    },
  },
  plugins: [],
};