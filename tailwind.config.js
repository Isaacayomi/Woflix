/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      outfit: ["Outfit", "sans-serif"],
    },
    extend: {
      colors: {
        red: "#FC4747",
        darkBlue: "#10141E",
        grayishBlue: "#5A698F",
        semiDarkBlue: "#161D2F",
      },
    },
  },
  plugins: [],
};
