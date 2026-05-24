import { TrendingGridSkeleton } from "@/components/skeletons/trending-grid-skeleton";
import type { TrendingItem } from "@/types/discover";
import { TrendingGrid } from "./trending-grid";

interface TrendingUIProps {
  items: TrendingItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export function TrendingUI({
  items,
  isLoading,
  isError,
  errorMessage,
}: TrendingUIProps) {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-black">Trending this week</h1>

      {isLoading ? (
        <TrendingGridSkeleton />
      ) : isError ? (
        <p className="text-red-600">
          {errorMessage ?? "Failed to load trending."}
        </p>
      ) : items.length === 0 ? (
        <p className="text-neutral-500">No trending titles to show.</p>
      ) : (
        <TrendingGrid items={items} />
      )}
    </section>
  );
}
