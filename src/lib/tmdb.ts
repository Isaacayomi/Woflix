const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const IMG_BASE = "https://image.tmdb.org/t/p/";

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
  return res.json();
}

export function imageUrl(path: string | null, size = "w500"): string {
  return path ? `${IMG_BASE}${size}${path}` : "";
}
