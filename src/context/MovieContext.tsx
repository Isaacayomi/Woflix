import { createContext, useEffect, useState } from "react";
import { getAllMovies } from "../services/apiAllMovies";
import { useLocation } from "react-router-dom";
import { getMovies } from "../services/apiMovies";
import { getSeries } from "../services/apiSeries";
import { getBookmark } from "../services/apiBookmark";
import { Movie, MovieContextType } from "types";

type ProviderProps = {
  children: React.ReactNode;
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

function MovieProvider({ children }: ProviderProps) {
  const location = useLocation();
  const navigation = location.pathname;

  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [baseMovies, setBaseMovies] = useState<Movie[]>([]);

  const [series, setSeries] = useState<Movie[]>([]);
  const [bookmarked, setBookmarked] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      const data =
        navigation === "/"
          ? await getAllMovies()
          : navigation === "/movies"
            ? await getMovies()
            : navigation === "/series"
              ? await getSeries()
              : await getBookmark();

      setAllMovies(data);
      setSeries(data);
      setMovies(data);
      setBookmarked(data);
    }

    fetchMovies();
  }, [navigation]);

  const openPreview = (movie: Movie) => {
    setPreviewMovie(movie);
    setShowPreview(true);
  };

  const closePreview = () => {
    setPreviewMovie(null);
    setShowPreview(false);
  };

  return (
    <MovieContext.Provider
      value={{
        allMovies,
        movies,
        series,
        bookmarked,
        searchQuery,
        setSearchQuery,
        baseMovies,
        setBaseMovies,
        showPreview,
        setShowPreview,
        previewMovie,
        setPreviewMovie,
        openPreview,
        closePreview,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export { MovieContext, MovieProvider };
