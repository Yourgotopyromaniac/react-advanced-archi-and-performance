interface TrendingGridSkeletonProps {
  count?: number;
}

export function TrendingGridSkeleton({ count = 10 }: TrendingGridSkeletonProps) {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading trending titles"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <li
          key={idx}
          className="block border bg-white rounded-lg overflow-hidden"
        >
          <div className="aspect-[2/3] animate-pulse bg-neutral-200" />
          <div className="p-3 space-y-2">
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-3 w-2/5 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}
