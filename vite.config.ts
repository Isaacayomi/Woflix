import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-32x32.svg", "favicon-32x321.png"],
      manifest: {
        name: "Woflix",
        short_name: "Woflix",
        description: "A streaming platform for movies and TV shows.",
        theme_color: "#10141E",
        background_color: "#10141E",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "favicon-32x321.png",
            sizes: "32x32",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,gif,woff2}"],
      },
    }),
  ],
});
