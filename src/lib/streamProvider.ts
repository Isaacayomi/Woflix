type ProviderName = "vidsrc" | "twoEmbed";

type ProviderUrls = {
  movie: (id: number) => string;
  tv: (id: number, season: number, episode: number) => string;
};

const PROVIDERS: Record<ProviderName, ProviderUrls> = {
  vidsrc: {
    movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    tv: (id, season, episode) =>
      `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
  },
  twoEmbed: {
    movie: (id) => `https://2embed.cc/embed/movie/${id}`,
    tv: (id, season, episode) =>
      `https://2embed.cc/embed/tv/${id}&s=${season}&e=${episode}`,
  },
};

let activeProvider: ProviderName = "vidsrc";

export function setActiveProvider(provider: ProviderName) {
  activeProvider = provider;
}

export function getActiveProvider(): ProviderName {
  return activeProvider;
}

export function getStreamUrl(
  mediaType: "movie" | "tv",
  tmdbId: number,
  season = 1,
  episode = 1,
): string {
  return PROVIDERS[activeProvider][mediaType](tmdbId, season, episode);
}

export function getFallbackUrl(
  mediaType: "movie" | "tv",
  tmdbId: number,
  season = 1,
  episode = 1,
): string {
  const fallback: ProviderName =
    activeProvider === "vidsrc" ? "twoEmbed" : "vidsrc";
  return PROVIDERS[fallback][mediaType](tmdbId, season, episode);
}
