import { useSearchParams } from "react-router-dom";
import { useHomeMovies } from "../../hooks/useHomeMovies";
import { useTopRated } from "../../hooks/useTopRated";
import { useNewReleases } from "../../hooks/useNewReleases";
import Heading from "../../ui/Heading";
import MovieCard from "../../ui/MovieCard";
import TrendingMovies from "./TrendingMovie";
import MovieCardSkeleton from "../../ui/skeletons/MovieCardSkeleton";
import TrendingSkeleton from "../../ui/skeletons/TrendingSkeleton";

function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { allMovies, isPending, isFetching } = useHomeMovies(query);
  const { topMovies, isPending: topPending } = useTopRated();
  const { newMovies, isPending: newPending } = useNewReleases();

  return (
    <div className="h-screen">
      {!query && (
        <>
          {isPending ? (
            <div className="pb-6">
              <Heading>Trending</Heading>
              <TrendingSkeleton />
            </div>
          ) : (
            <>
              <Heading>Trending</Heading>
              <div className="flex pb-6">
                <TrendingMovies />
              </div>
            </>
          )}

          {topPending ? (
            <div className="pb-6">
              <Heading>Top Rated</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : topMovies.length > 0 ? (
            <div className="pb-6">
              <Heading>Top Rated</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topMovies.slice(0, 6).map((m) => (
                  <MovieCard movie={m} key={m.id} />
                ))}
              </div>
            </div>
          ) : null}

          {newPending ? (
            <div className="pb-6">
              <Heading>New Releases</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : newMovies.length > 0 ? (
            <div className="pb-6">
              <Heading>New Releases</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {newMovies.slice(0, 6).map((m) => (
                  <MovieCard movie={m} key={m.id} />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      <Heading>{`${query ? `Found ${allMovies?.length ?? 0} results for "${query}"` : "Recommended for you"}`}</Heading>

      {query && isFetching && (
        <p className="mb-4 text-sm text-grayishBlue">Updating results...</p>
      )}

      {isPending && !query && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allMovies?.length === 0 && !isPending && <p>No results found</p>}
        {allMovies
          ?.filter(Boolean)
          .map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
      </div>
    </div>
  );
}

export default Home;
