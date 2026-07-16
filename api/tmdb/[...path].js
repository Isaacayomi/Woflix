export default async function handler(req, res) {
  // Set CORS and security headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { path } = req.query;
  const tmdbPath = Array.isArray(path) ? path.join("/") : path;

  const apiKey = process.env.VITE_TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB API key not configured" });
  }

  const tmdbUrl = new URL(`https://api.themoviedb.org/3/${tmdbPath}`);

  // Forward query params from the client request
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== "path" && typeof value === "string") {
      tmdbUrl.searchParams.set(key, value);
    }
  }

  // Always inject the API key server-side
  tmdbUrl.searchParams.set("api_key", apiKey);

  try {
    const response = await fetch(tmdbUrl.toString());

    if (!response.ok) {
      return res.status(response.status).json({
        error: `TMDB API error: ${response.status} ${response.statusText}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
}
