import { useTrending } from "@/hooks/discover/use-trending";
import { TrendingUI } from "@/modules/discover/trending";

const Trending = () => {
  const { data, isLoading, isError, error } = useTrending("week");

  return (
    <TrendingUI
      items={data?.results ?? []}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : undefined}
    />
  );
};

export { Trending };
