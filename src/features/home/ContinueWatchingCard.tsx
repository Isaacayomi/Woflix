import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../lib/tmdb";
import type { WatchHistoryEntry } from "../../services/apiWatchHistory";

type Props = {
  entry: WatchHistoryEntry;
};

function ContinueWatchingCard({ entry }: Props) {
  const navigate = useNavigate();
  const route =
    entry.category === "tv series"
      ? `/tv/${entry.tmdbId}`
      : `/movie/${entry.tmdbId}`;

  return (
    <div
      onClick={() => navigate(route)}
      className="group relative z-10 flex aspect-[16/9] w-full cursor-pointer flex-col rounded-lg bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${imageUrl(entry.backdropPath, "w780")})`,
      }}
    >
      <div className="absolute inset-0 z-0 rounded-lg bg-black opacity-0 transition duration-300 group-hover:opacity-50" />

      <div className="relative z-20 mt-auto p-4">
        <p className="font-outfit text-sm font-medium text-white lg:text-lg">
          {entry.title}
        </p>
        <p className="mt-1 text-xs text-white/60">
          {entry.category}
          {entry.season && ` - S${entry.season}:E${entry.episode}`}
        </p>
      </div>

      <div className="relative z-20 h-1 w-full bg-white/20">
        <div
          className="h-full bg-red transition-all"
          style={{ width: `${entry.progress}%` }}
        />
      </div>
    </div>
  );
}

export default ContinueWatchingCard;
