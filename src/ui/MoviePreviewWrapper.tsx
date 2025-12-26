import { useMoviesContext } from "../context/useMoviesContext";
import MoviePreview from "./MoviePreview";

export default function MoviePreviewWrapper() {
  const { showPreview, previewMovie, closePreview } = useMoviesContext();

  if (!showPreview || !previewMovie) return null;

  return <MoviePreview movie={previewMovie} onClose={closePreview} />;
}
