import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDiscoverMovies } from "../../hooks/useDiscoverMovies";
import Heading from "../../ui/Heading";
import MovieCard from "../../ui/MovieCard";
import Spinner from "../../ui/Spinner";
import MovieCardSkeleton from "../../ui/skeletons/MovieCardSkeleton";

function DecadeResults() {
  const { year } = useParams<{ year: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || `${year}s`;

  const decadeStart = year ? `${year}-01-01` : undefined;
  const decadeEnd = year ? `${Number(year) + 9}-12-31` : undefined;

  const {
    movies,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverMovies({ yearGte: decadeStart, yearLte: decadeEnd });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="px-6 pb-12 pt-6 md:px-12">
      <Heading>{name}</Heading>
      <p className="mb-6 text-sm text-white/60">{movies.length} titles</p>

      {isPending && !movies.length && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && movies.length === 0 && <p>No results found</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetchingNextPage && <Spinner />}
        </div>
      )}
    </div>
  );
}

export default DecadeResults;
