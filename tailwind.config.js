/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "offer-gradient":
          "linear-gradient(180deg, #72C0F0 0%, #4FA3C2 50%, #0F6A75 100%)",
      },

      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
        jost: ["var(--font-jost)", "sans-serif"],
        geist: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      /* Standardized Type Scale */
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "44px" }],
        "5xl": ["48px", { lineHeight: "56px" }],
      },

      /* Standardized Border Radius */
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },

      /* Theme Colors */
      colors: {
        primary: {
          50: "#f0f9fc",
          100: "#e0f2f9",
          200: "#c0e5f3",
          300: "#a1d8ed",
          400: "#72c0e0",
          500: "#2d9bf0",
          600: "#0ea5e9",
          700: "#0097b2",
          800: "#0f6a75",
          900: "#064e56",
        },
        secondary: {
          50: "#f8f9fa",
          100: "#e9ecf1",
          200: "#d4dbe6",
          300: "#bcc7d8",
          400: "#8fa2b8",
          500: "#5a7a94",
          600: "#3b5a7a",
          700: "#2d4563",
          800: "#1a2a3e",
          900: "#0f1419",
        },
      },
    },
  },
  plugins: [],
};
