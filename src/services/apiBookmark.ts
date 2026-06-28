import { auth, db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Movie } from "types";

export async function getBookmark(): Promise<Movie[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const snapshot = await getDocs(
    collection(db, "users", user.uid, "bookmarks"),
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.tmdbId,
      title: data.title || "",
      year: data.year || "",
      category: data.mediaType === "movie" ? ("movie" as const) : ("tv series" as const),
      rating: data.rating || "N/A",
      thumbnail: {
        regular: {
          small: data.posterSmall || "",
          medium: data.posterMedium || "",
          large: data.posterLarge || data.backdropLarge || "",
        },
      },
      isBookmarked: true,
    };
  });
}
