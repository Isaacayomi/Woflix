function TrendingSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="aspect-[16/9] w-[300px] flex-shrink-0 rounded-lg bg-semiDarkBlue"
        />
      ))}
    </div>
  );
}

export default TrendingSkeleton;
