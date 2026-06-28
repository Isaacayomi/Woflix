import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookmark } from "../../services/apiBookmark";
import MovieCard from "../../ui/MovieCard";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

function Bookmark() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: isBookmarked, isPending } = useQuery({
    queryKey: ["bookmarkedMovies"],
    queryFn: getBookmark,
  });

  const normalizedQuery = query.trim().toLowerCase();

  const displayedMovies = normalizedQuery
    ? (isBookmarked || []).filter((movie) =>
        movie.title.toLowerCase().includes(normalizedQuery),
      )
    : isBookmarked;

  return (
    <div className="h-screen">
      {isPending && <Spinner />}

      {!query ? (
        <Heading>Bookmarked TV Series</Heading>
      ) : (
        <Heading>{`Found ${displayedMovies?.length} results for "${query}"`}</Heading>
      )}

      <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedMovies
          ?.filter(
            (bookmarkedMovie) => bookmarkedMovie.category === "tv series",
          )
          .map((bookmarkedMovie) => (
            <MovieCard movie={bookmarkedMovie} key={bookmarkedMovie.id} />
          ))}
      </div>

      {!query && <Heading>Bookmarked Movie</Heading>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedMovies
          ?.filter((bookmarkedMovie) => bookmarkedMovie.category === "movie")
          .map((bookmarkedMovie) => (
            <MovieCard movie={bookmarkedMovie} key={bookmarkedMovie.id} />
          ))}
      </div>
    </div>
  );
}

export default Bookmark;
