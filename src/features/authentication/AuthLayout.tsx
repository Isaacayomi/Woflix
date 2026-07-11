import { useTrendingMovies } from "../../hooks/useTrendingMovie";
import { useTranslation } from "react-i18next";

function getImg(movie: any): string {
  return movie.thumbnail?.regular?.small ||
    movie.thumbnail?.regular?.medium ||
    movie.thumbnail?.trending?.small ||
    movie.thumbnail?.trending?.large ||
    "";
}

function PosterColumns({
  movies,
  isPending,
}: {
  movies: any[];
  isPending: boolean;
}) {
  const leftCol = movies.filter((_, i) => i % 2 === 0);
  const rightCol = movies.filter((_, i) => i % 2 !== 0);
  const left = [...leftCol, ...leftCol];
  const right = [...rightCol, ...rightCol];

  const skeleton = (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800" />
      ))}
    </div>
  );

  const column = (items: any[], dir: "up" | "down") => (
    <div className="flex-1 overflow-hidden">
      <div
        className={`flex flex-col gap-2 ${dir === "up" ? "animate-scroll-up" : "animate-scroll-down"}`}
        style={{ willChange: "transform" }}
      >
        {isPending || items.length === 0
          ? skeleton
          : items.map((movie, i) => (
              <div
                key={`${movie.id}-${i}`}
                className="aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg bg-gray-800"
              >
                {getImg(movie) && (
                  <img
                    src={getImg(movie)}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full gap-2 p-2">
      {column(left, "up")}
      {column(right, "down")}
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { trendingMovies, isPending } = useTrendingMovies();
  const movies = trendingMovies?.slice(0, 30) ?? [];

  return (
    <div className="relative min-h-screen bg-darkBlue font-outfit">
      {/* Mobile background */}
      <div className="absolute inset-0 sm:hidden">
        <PosterColumns movies={movies} isPending={isPending} />
        <div className="absolute inset-0 bg-darkBlue/80" />
      </div>

      {/* Desktop left banner */}
      <div className="absolute inset-y-0 left-0 hidden w-1/2 sm:block">
        <PosterColumns movies={movies} isPending={isPending} />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue via-darkBlue/60 to-darkBlue/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-darkBlue/65 via-darkBlue/25 to-transparent" />
        <div className="absolute bottom-10 left-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src="/favicon-32x32.svg" alt="" className="h-8 w-8" />
            <span className="text-2xl font-bold text-white">{t("authLayout.brand")}</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            {t("authLayout.tagline")}
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="relative flex min-h-screen w-full items-center justify-center sm:ml-auto sm:w-1/2">
        <div className="w-full px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
          <div className="mb-8 flex flex-col items-center sm:hidden">
            <div className="mb-2 flex items-center gap-2">
              <img src="/favicon-32x32.svg" alt="" className="h-7 w-7" />
              <span className="text-xl font-bold text-white">{t("authLayout.brand")}</span>
            </div>
            <p className="text-xs text-white/40">
              {t("authLayout.tagline")}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
