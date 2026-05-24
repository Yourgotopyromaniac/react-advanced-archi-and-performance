import { useQuery } from "@tanstack/react-query";
import { getMovie } from "@/api/services/discover";
import { queryKeys } from "@/lib/query-keys";

export function useMovie(id: number) {
  return useQuery({
    queryKey: queryKeys.discover.movie(id),
    queryFn: () => getMovie(id),
    enabled: Number.isFinite(id),
  });
}
