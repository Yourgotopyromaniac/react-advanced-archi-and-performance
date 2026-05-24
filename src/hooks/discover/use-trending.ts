import { useQuery } from "@tanstack/react-query";
import { getTrending, type TrendingWindow } from "@/api/services/discover";
import { queryKeys } from "@/lib/query-keys";

export function useTrending(window: TrendingWindow = "week") {
  return useQuery({
    queryKey: queryKeys.discover.trending(window),
    queryFn: () => getTrending(window),
  });
}
