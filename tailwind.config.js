/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141A2E",
        gold: "#FFD23F",
        paper: "#F7F5EF",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
