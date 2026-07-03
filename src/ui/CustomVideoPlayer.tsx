import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

const PROVIDERS = [
  {
    name: "VidSrc",
    url: (tmdbId: number, mediaType: string, season: number, episode: number) =>
      `https://vidsrc.me/embed/${mediaType === "movie" ? "movie" : "tv"}?tmdb=${tmdbId}${mediaType === "tv" ? `&season=${season}&episode=${episode}` : ""}`,
  },
  {
    name: "2Embed",
    url: (tmdbId: number, mediaType: string, season: number, episode: number) =>
      `https://2embed.cc/embed/${mediaType === "movie" ? "movie" : "tv"}/${tmdbId}${mediaType === "tv" ? `&s=${season}&e=${episode}` : ""}`,
  },
];

type CustomVideoPlayerProps = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
  onClose: () => void;
};

const PROVIDER_NAMES = ["VidSrc", "2Embed"];

export default function CustomVideoPlayer({
  tmdbId,
  mediaType,
  season = 1,
  episode = 1,
  title,
  onClose,
}: CustomVideoPlayerProps) {
  const { t } = useTranslation();
  const [providerIndex, setProviderIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const retryKey = useRef(0);

  const currentProvider = PROVIDERS[providerIndex];
  const src = currentProvider.url(tmdbId, mediaType, season, episode);

  const switchProvider = useCallback(() => {
    const next = (providerIndex + 1) % PROVIDERS.length;
    setProviderIndex(next);
    setLoaded(false);
    setIframeError(false);
    retryKey.current += 1;
  }, [providerIndex]);

  const retry = useCallback(() => {
    setLoaded(false);
    setIframeError(false);
    retryKey.current += 1;
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      {/* Header bar */}
      <div className="relative z-20 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          aria-label={t("videoPlayer.close")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span className="truncate text-sm font-medium text-white/80">{title}</span>

        <div className="flex-1" />

        <span className="hidden rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/50 md:inline">
          {t(`videoPlayer.provider${PROVIDER_NAMES[providerIndex]}`)}
        </span>

        <button
          onClick={switchProvider}
          className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/20 hover:text-white"
          title={t("videoPlayer.switchProvider")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span className="hidden md:inline">{t("videoPlayer.switch")}</span>
        </button>
      </div>

      {/* Iframe area */}
      <div className="relative flex-1">
        {!loaded && !iframeError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-red" />
          </div>
        )}

        {iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-white/50">
              {t("videoPlayer.failedToLoad")}<span className="font-medium text-white/70">{t(`videoPlayer.provider${PROVIDER_NAMES[providerIndex]}`)}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={retry}
                className="rounded-full bg-white/10 px-5 py-2 text-sm text-white hover:bg-white/20"
              >
                {t("videoPlayer.retry")}
              </button>
              <button
                onClick={switchProvider}
                className="rounded-full bg-red px-5 py-2 text-sm font-medium hover:bg-red/80"
              >
                {t("videoPlayer.tryProvider", { name: t(`videoPlayer.provider${PROVIDER_NAMES[(providerIndex + 1) % PROVIDERS.length]}`) })}
              </button>
            </div>
            <button onClick={onClose} className="text-xs text-white/30 hover:text-white/60">
              {t("videoPlayer.close")}
            </button>
          </div>
        )}

        <iframe
          key={`${providerIndex}-${retryKey.current}`}
          ref={iframeRef}
          src={src}
          title={title}
          className={`h-full w-full ${loaded ? "" : "invisible absolute"}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          onError={() => setIframeError(true)}
        />
      </div>
    </div>
  );
}
