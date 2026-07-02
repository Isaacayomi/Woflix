export const RELEASED_STATUSES = [
  "Released",
  "Returning Series",
  "Ended",
  "Canceled",
];

export function isUnreleased(
  status: string | undefined | null,
  releaseDate: string,
): boolean {
  if (!status) return false;
  return RELEASED_STATUSES.includes(status)
    ? releaseDate
      ? new Date(releaseDate) > new Date()
      : false
    : true;
}
