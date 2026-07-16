import { getTmdbLanguage } from "./i18n/config";

const TMDB_PROXY_BASE = "/api/tmdb";
export const IMG_BASE = "https://image.tmdb.org/t/p/";

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${TMDB_PROXY_BASE}${path}`, window.location.origin);
  url.searchParams.set("language", getTmdbLanguage());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
  return res.json();
}

export function imageUrl(path: string | null, size = "w500"): string {
  return path ? `${IMG_BASE}${size}${path}` : "";
}
