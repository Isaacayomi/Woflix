function MovieCardSkeleton() {
  return (
    <div className="mb-4 flex animate-pulse flex-col">
      <div className="aspect-[16/9] w-full rounded-lg bg-semiDarkBlue" />
      <div className="mt-2 flex flex-col gap-2">
        <div className="h-3 w-2/3 rounded bg-semiDarkBlue" />
        <div className="h-4 w-3/4 rounded bg-semiDarkBlue" />
      </div>
    </div>
  );
}

export default MovieCardSkeleton;
