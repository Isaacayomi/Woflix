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
      keyframes: {
        "scroll-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "scroll-down": {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "scroll-up": "scroll-up 40s linear infinite",
        "scroll-down": "scroll-down 40s linear infinite",
      },
    },
  },
  plugins: [],
};
