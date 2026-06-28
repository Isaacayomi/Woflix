import { db, auth } from "../lib/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDoc,
  getDocs,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { Movie } from "types";
export type WatchHistoryEntry = {
  tmdbId: number;
  title: string;
  category: "movie" | "tv series";
  posterPath: string | null;
  backdropPath: string | null;
  season?: number;
  episode?: number;
  progress: number;
  watchedAt: Timestamp;
};

export async function updateWatchProgress(
  tmdbId: number,
  data: {
    title: string;
    category: "movie" | "tv series";
    posterPath: string | null;
    backdropPath: string | null;
    season?: number;
    episode?: number;
    progress: number;
  },
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const ref = doc(db, "users", uid, "history", String(tmdbId));
  await setDoc(ref, { ...data, watchedAt: Timestamp.now() });
}

export async function getWatchHistory(
  limitCount = 20,
): Promise<WatchHistoryEntry[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  const ref = collection(db, "users", uid, "history");
  const q = query(ref, orderBy("watchedAt", "desc"), limit(limitCount));
  const snap = await getDocs(q);

  return snap.docs.map((d) => d.data() as WatchHistoryEntry);
}

export async function removeFromHistory(tmdbId: number): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const ref = doc(db, "users", uid, "history", String(tmdbId));
  await deleteDoc(ref);
}
