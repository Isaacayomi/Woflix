import { auth, db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Movie } from "types";

function normalizeBookmarkCategory(data: {
  category?: string;
  mediaType?: string;
}): "movie" | "tv series" {
  const rawType = (data.category || data.mediaType || "").toLowerCase();
  return rawType === "movie" ? "movie" : "tv series";
}

export async function getBookmarkedIds(): Promise<Set<number>> {
  const user = auth.currentUser;
  if (!user) return new Set();
  const snapshot = await getDocs(
    collection(db, "users", user.uid, "bookmarks"),
  );
  return new Set(snapshot.docs.map((doc) => Number(doc.id)));
}

export async function getBookmark(): Promise<Movie[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const snapshot = await getDocs(
    collection(db, "users", user.uid, "bookmarks"),
  );

  return snapshot.docs.map((doc) => {
    try {
      const data = doc.data();
      const category = normalizeBookmarkCategory(data);
      return {
        id: Number(data.tmdbId || doc.id),
        title: data.title || "",
        year: data.year || "",
        category,
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
    } catch {
      console.warn("Failed to map bookmark document", doc.id);
      return {
        id: Number(doc.id) || 0,
        title: "Unknown",
        year: "",
        category: "tv series" as const,
        rating: "N/A",
        thumbnail: { regular: { small: "", medium: "", large: "" } },
        isBookmarked: true,
      };
    }
  });
}
