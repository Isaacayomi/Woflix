import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getWatchHistory, removeFromHistory } from "../../services/apiWatchHistory";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import SEO from "../../ui/SEO";
import { imageUrl } from "../../lib/tmdb";

function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: entries, isPending } = useQuery({
    queryKey: ["watchHistory"],
    queryFn: () => getWatchHistory(),
  });

  const handleRemove = async (e: React.MouseEvent, tmdbId: number) => {
    e.stopPropagation();
    await removeFromHistory(tmdbId);
    queryClient.invalidateQueries({ queryKey: ["watchHistory"] });
  };

  return (
    <div className="min-h-full px-6 md:px-12">
      <SEO title="Watch History" description="Your recently watched movies and TV shows." />
      <Heading>{t("history.heading")}</Heading>

      {isPending && <Spinner />}

      {!isPending && (!entries || entries.length === 0) && (
        <p className="mt-8 text-center text-grayishBlue">
          {t("history.empty")}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {entries?.map((entry) => {
          const route = `/${entry.category === "movie" ? "movie" : "tv"}/${entry.tmdbId}`;
          return (
            <div
              key={entry.tmdbId}
              onClick={() => navigate(route)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <img
                  src={
                    entry.posterPath
                      ? imageUrl(entry.posterPath, "w342")
                      : ""
                  }
                  alt={entry.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect fill='%235A698F' width='200' height='300'/%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <button
                  onClick={(e) => handleRemove(e, entry.tmdbId)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-darkBlue/70 text-white/60 opacity-0 transition-opacity hover:text-red group-hover:opacity-100"
                  title={t("history.removeTitle")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {entry.season && (
                  <span className="absolute bottom-2 left-2 z-10 rounded bg-darkBlue/70 px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    S{entry.season} E{entry.episode}
                  </span>
                )}
              </div>

              <p className="mt-2 truncate text-sm font-medium">
                {entry.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
