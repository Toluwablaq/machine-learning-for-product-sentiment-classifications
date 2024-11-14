/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#282928",
        secondary: "#239463",
        tertiary: "#24211f",
        offWhite: "#f2f2f3",
        footerText: "#888889",
        overlay: "rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};
