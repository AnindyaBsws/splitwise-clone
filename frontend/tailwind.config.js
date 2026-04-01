/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#6366F1",
        accent: "#22C55E",

        darkbg: "#020617",
        card: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.1)",

        success: "#4ADE80",
        danger: "#F87171",
      },

      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px",
        lg: "20px",
      },

      boxShadow: {
        glow: "0 0 30px rgba(124,58,237,0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.37)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      backgroundImage: {
        "gradient-main":
          "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },

  plugins: [],
};