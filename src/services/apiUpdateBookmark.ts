import { auth, db } from "../lib/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { tmdbFetch, imageUrl } from "../lib/tmdb";

type BookmarkMediaType = "movie" | "tv";

type UpdateBookmarkArgs = {
  newValue: boolean;
  id: number;
  mediaType?: BookmarkMediaType;
};

async function fetchBookmarkDetails(tmdbId: number, mediaType?: BookmarkMediaType) {
  const endpoint = mediaType ? `/${mediaType}/${tmdbId}` : null;

  if (endpoint) {
    return tmdbFetch<{
      title?: string;
      name?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path: string | null;
      backdrop_path: string | null;
      vote_average: number;
    }>(endpoint);
  }

  return tmdbFetch<{
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
  }>(`/movie/${tmdbId}`).catch(async () => {
    return tmdbFetch<{
      title?: string;
      name?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path: string | null;
      backdrop_path: string | null;
      vote_average: number;
    }>(`/tv/${tmdbId}`);
  });
}

export async function updateBookmark({
  newValue,
  id: tmdbId,
  mediaType,
}: UpdateBookmarkArgs) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const ref = doc(collection(db, "users", user.uid, "bookmarks"), String(tmdbId));

  if (newValue) {
    const details = await fetchBookmarkDetails(tmdbId, mediaType);

    const title = details.title || details.name || "Unknown";
    const year = (details.release_date || details.first_air_date || "").slice(
      0,
      4,
    );
    const resolvedMediaType = mediaType ?? (details.title ? "movie" : "tv");
    const category = resolvedMediaType === "movie" ? "movie" : "tv series";

    await setDoc(ref, {
      tmdbId,
      title,
      year,
      category,
      mediaType: resolvedMediaType,
      rating: details.vote_average ? details.vote_average.toFixed(1) : "N/A",
      posterSmall: imageUrl(details.poster_path, "w185"),
      posterMedium: imageUrl(details.poster_path, "w342"),
      posterLarge: imageUrl(details.poster_path, "w500"),
      backdropLarge: imageUrl(details.backdrop_path, "w1280"),
      addedAt: Date.now(),
    });
  } else {
    await deleteDoc(ref);
  }
}
