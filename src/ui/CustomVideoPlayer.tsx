import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const SUBTITLE_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Espa\u00f1ol" },
  { code: "fr", label: "Fran\u00e7ais" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Portugu\u00eas" },
  { code: "it", label: "Italiano" },
  { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" },
  { code: "hi", label: "\u0939\u093f\u0928\u094d\u0926\u0940" },
  { code: "ja", label: "\u65e5\u672c\u8a9e" },
  { code: "ko", label: "\ud55c\uad6d\uc5b4" },
  { code: "zh", label: "\u4e2d\u6587" },
  { code: "ru", label: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
];

type CustomVideoPlayerProps = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
  onClose: () => void;
};

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

export default function CustomVideoPlayer({
  tmdbId,
  mediaType,
  season = 1,
  episode = 1,
  title,
  onClose,
}: CustomVideoPlayerProps) {
  const { t } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [subtitleLang, setSubtitleLang] = useState("en");
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);

  const srcUrl =
    mediaType === "movie"
      ? `https://vidsrc.me/embed/movie/${tmdbId}`
      : `https://vidsrc.me/embed/tv/${tmdbId}/${season}/${episode}`;

  useEffect(() => {
    setLoaded(false);
    setIframeError(false);
  }, [srcUrl]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          return;
        }
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!langPickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setLangPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langPickerOpen]);

  const currentLang =
    SUBTITLE_LANGUAGES.find((l) => l.code === subtitleLang) || SUBTITLE_LANGUAGES[0];

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex flex-col bg-black select-none"
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
    >
      <div className="relative z-30 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          aria-label={t("videoPlayer.pause")}
        >
          <PauseIcon />
        </button>
        <span className="truncate text-sm font-medium text-white/80">{title}</span>

        <button
          onClick={toggleFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white ml-auto mr-2"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          )}
        </button>

        <div className="relative" ref={langPickerRef}>
          <button
            onClick={() => setLangPickerOpen((p) => !p)}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {currentLang.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {langPickerOpen && (
            <div className="absolute right-0 top-full mt-1 max-h-60 w-36 overflow-y-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl z-30">
              {SUBTITLE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSubtitleLang(lang.code);
                    setLangPickerOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs transition-colors hover:bg-white/10 ${
                    subtitleLang === lang.code ? "font-medium text-red" : "text-white/70"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {!loaded && !iframeError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-red" />
          </div>
        )}

        {iframeError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-white/50">{t("videoPlayer.failedToLoad")}</p>
            <button
              onClick={() => {
                setLoaded(false);
                setIframeError(false);
              }}
              className="rounded-full bg-white/10 px-5 py-2 text-sm text-white hover:bg-white/20"
            >
              {t("videoPlayer.retry")}
            </button>
            <button onClick={onClose} className="text-xs text-white/30 hover:text-white/60">
              {t("videoPlayer.close")}
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={srcUrl}
          title={title}
          className={`absolute inset-0 h-full w-full ${loaded ? "" : "invisible"}`}
          allow="autoplay; fullscreen"
          allowFullScreen={true}
          onLoad={() => setLoaded(true)}
          onError={() => setIframeError(true)}
        />
      </div>
    </div>
  );
}
