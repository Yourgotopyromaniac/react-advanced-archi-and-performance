export function TitleDetailSkeleton() {
  return (
    <article
      aria-busy="true"
      aria-label="Loading title details"
      className="space-y-6"
    >
      <div className="h-4 w-16 animate-pulse rounded-full bg-neutral-200" />

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-48 shrink-0">
          <div className="aspect-[2/3] animate-pulse rounded-lg bg-neutral-200" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="h-7 w-3/4 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-3 w-40 animate-pulse rounded-full bg-neutral-200" />
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full animate-pulse rounded-full bg-neutral-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-neutral-200" />
            <div className="h-3 w-11/12 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>
    </article>
  );
}
