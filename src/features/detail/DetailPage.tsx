import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDetail } from "../../hooks/useDetail";
import { useVideos } from "../../hooks/useVideos";
import { useCredits } from "../../hooks/useCredits";
import { useSimilar } from "../../hooks/useSimilar";
import { useRecommendations } from "../../hooks/useRecommendations";
import { imageUrl } from "../../lib/tmdb";
import { getStreamUrl } from "../../lib/streamProvider";
import MovieCard from "../../ui/MovieCard";
import Spinner from "../../ui/Spinner";
import CastRow from "./CastRow";
import VideoModal from "./VideoModal";

function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const mediaType = location.pathname.startsWith("/movie") ? "movie" : "tv";
  const tmdbId = Number(id);

  const { data: detail, isPending } = useDetail(tmdbId, mediaType);
  const { trailer } = useVideos(tmdbId, mediaType);
  const { cast } = useCredits(tmdbId, mediaType);
  const { similar } = useSimilar(tmdbId, mediaType);
  const { recommendations } = useRecommendations(tmdbId, mediaType);

  const [mode, setMode] = useState<"hero" | "watch">("hero");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [muted, setMuted] = useState(false);

  const trailerKey = trailer?.key;
  const backdropImage = detail?.backdrop_path
    ? imageUrl(detail.backdrop_path, "original")
    : "";

  const heroVideoUrl =
    trailerKey && mode === "hero"
      ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&controls=0&playlist=${trailerKey}&rel=0&showinfo=0`
      : null;

  const streamUrl = getStreamUrl(mediaType, tmdbId, season, episode);

  const maxSeasons = detail?.number_of_seasons ?? 1;
  const maxEpisodes = 24;

  if (isPending) return <Spinner />;
  if (!detail)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Content not found
      </div>
    );

  const title = detail.title || detail.name || "";
  const year = (detail.release_date || detail.first_air_date || "").slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-screen w-full overflow-hidden">
        {heroVideoUrl ? (
          <iframe
            key={String(muted)}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
            src={heroVideoUrl}
            title={title}
            allow="autoplay"
          />
        ) : (
          <img
            src={backdropImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue via-darkBlue/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-darkBlue/50 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end p-6 pb-16 md:p-12">
          <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            <span className="rounded bg-yellow-500 px-2 py-0.5 text-sm font-bold text-black">
              {detail.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span>{year}</span>
            {detail.runtime && <span>{detail.runtime} min</span>}
            {detail.number_of_seasons && (
              <span>{detail.number_of_seasons} seasons</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(detail.genres || []).map((g) => (
              <span
                key={g.id}
                className="rounded-full bg-white/10 px-3 py-1 text-xs md:text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            {detail.overview}
          </p>

          <CastRow cast={cast} />

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => setMode("watch")}
              className="flex items-center gap-2 rounded-full bg-red px-6 py-3 hover:bg-red/80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-sm font-medium">Watch Now</span>
            </button>
            {mediaType === "tv" && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={season}
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setEpisode(1);
                    }}
                    className="appearance-none rounded-full bg-white/10 py-2 pl-4 pr-10 text-sm hover:bg-white/20 focus:outline-none"
                  >
                    {Array.from({ length: maxSeasons }, (_, i) => i + 1).map((s) => (
                      <option
                        key={s}
                        value={s}
                        className="bg-darkBlue text-white"
                      >
                        Season {s}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="relative">
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    className="appearance-none rounded-full bg-white/10 py-2 pl-4 pr-10 text-sm hover:bg-white/20 focus:outline-none"
                  >
                    {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map((e) => (
                      <option key={e} value={e} className="bg-darkBlue text-white">
                        Ep. {e}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="px-6 pb-8 md:px-12">
          <h2 className="mb-4 text-xl font-semibold">More Like This</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {similar.map((m) => (
              <MovieCard movie={m} key={m.id} />
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="px-6 pb-12 md:px-12">
          <h2 className="mb-4 text-xl font-semibold">Recommendations</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recommendations.map((m) => (
              <MovieCard movie={m} key={m.id} />
            ))}
          </div>
        </section>
      )}

      {/* Sound toggle */}
      {mode === "hero" && trailerKey && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="fixed bottom-8 right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
        >
          {muted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      )}

      {/* Modals */}
      {mode === "watch" && (
        <VideoModal
          url={streamUrl}
          title={title}
          onClose={() => setMode("hero")}
        />
      )}
    </div>
  );
}

export default DetailPage;

