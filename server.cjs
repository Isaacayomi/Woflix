const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = parseInt(process.env.PORT, 10) || 3001;
const DIST_DIR = path.join(__dirname, "dist");

require("dotenv").config();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".vtt": "text/vtt",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
};

function getContentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function serveStatic(res, filePath) {
  const fullPath = path.join(DIST_DIR, filePath);
  const resolved = path.resolve(fullPath);
  if (!resolved.startsWith(path.resolve(DIST_DIR))) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }
  fs.readFile(resolved, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        serveIndexHtml(res);
      } else {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal Server Error");
      }
      return;
    }
    res.writeHead(200, { "Content-Type": getContentType(resolved) });
    res.end(data);
  });
}

function serveIndexHtml(res) {
  fs.readFile(path.join(DIST_DIR, "index.html"), (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Static build not found. Run `npm run build` first.");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(data);
  });
}

async function proxyTmdbRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const tmdbPath = parsedUrl.pathname.replace("/api/tmdb/", "");
  const apiKey = process.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "TMDB API key not configured" }));
    return;
  }

  const tmdbUrl = new URL(`https://api.themoviedb.org/3/${tmdbPath}`);

  // Forward query params from the client request
  for (const [key, value] of Object.entries(parsedUrl.query)) {
    if (typeof value === "string") {
      tmdbUrl.searchParams.set(key, value);
    }
  }

  // Always inject the API key server-side
  tmdbUrl.searchParams.set("api_key", apiKey);

  try {
    const response = await fetch(tmdbUrl.toString());

    if (!response.ok) {
      res.writeHead(response.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `TMDB API error: ${response.status}` }));
      return;
    }

    const data = await response.json();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to fetch from TMDB" }));
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  const pathname = req.url.indexOf("?") === -1 ? req.url : req.url.slice(0, req.url.indexOf("?"));

  // Handle TMDB proxy requests
  if (pathname.startsWith("/api/tmdb/")) {
    return proxyTmdbRequest(req, res);
  }

  const requestedFile = pathname === "/" ? "index.html" : pathname.slice(1);
  serveStatic(res, requestedFile);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
