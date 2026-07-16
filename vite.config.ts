import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

function tmdbProxyPlugin(): Plugin {
  return {
    name: "tmdb-proxy",
    configureServer(server) {
      server.middlewares.use("/api/tmdb", async (req, res) => {
        const apiKey = server.config.env.VITE_TMDB_API_KEY;
        if (!apiKey) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "TMDB API key not configured" }));
          return;
        }

        const tmdbPath = req.url?.replace(/^\//, "") || "";
        const fullUrl = new URL(
          `https://api.themoviedb.org/3/${tmdbPath}`,
        );

        const rawParams = req.url?.split("?")[1] || "";
        const searchParams = new URLSearchParams(rawParams);
        for (const [key, value] of searchParams.entries()) {
          fullUrl.searchParams.set(key, value);
        }
        fullUrl.searchParams.set("api_key", apiKey);

        try {
          const response = await fetch(fullUrl.toString());
          if (!response.ok) {
            res.writeHead(response.status, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: `TMDB error ${response.status}` }));
            return;
          }
          const data = await response.json();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(data));
        } catch {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to fetch from TMDB" }));
        }
      });
    },
  };
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "framer-motion": ["framer-motion"],
          swiper: ["swiper"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          "tanstack-query": ["@tanstack/react-query"],
        },
      },
    },
  },
  plugins: [
    tmdbProxyPlugin(),
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
