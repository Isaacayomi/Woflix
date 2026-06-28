function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-screen w-full bg-semiDarkBlue" />
      <div className="space-y-4 p-12">
        <div className="h-8 w-1/3 rounded bg-semiDarkBlue" />
        <div className="h-4 w-1/2 rounded bg-semiDarkBlue" />
        <div className="h-4 w-full rounded bg-semiDarkBlue" />
        <div className="h-4 w-2/3 rounded bg-semiDarkBlue" />
      </div>
    </div>
  );
}

export default DetailSkeleton;
