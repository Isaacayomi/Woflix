export const UNRELEASED_STATUSES = [
  "Planned",
  "Rumored",
  "In Production",
  "Post Production",
];

export function isUnreleased(
  status: string | undefined | null,
  releaseDate: string,
): boolean {
  if (releaseDate && new Date(releaseDate) > new Date()) return true;
  if (status && UNRELEASED_STATUSES.includes(status)) return true;
  if (!status && (!releaseDate || new Date(releaseDate) > new Date())) return true;
  return false;
}
