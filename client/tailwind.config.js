/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "system-ui", "sans-serif"],
        display: ['"Bebas Neue"', "system-ui", "sans-serif"],
      },
      colors: {
        neo: {
          bg: "#f7f7f7",
          ink: "#111111",
          yellow: "#ffffff",
          pink: "#e8e8e8",
          mint: "#dedede",
          blue: "#1a1a1a",
          lilac: "#d4d4d4",
          cream: "#efefef",
          paper: "#ffffff",
        },
      },
      boxShadow: {
        neo: "0 14px 30px -20px rgba(0, 0, 0, 0.55)",
        "neo-sm": "0 10px 22px -16px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
