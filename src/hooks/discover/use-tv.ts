import { useQuery } from "@tanstack/react-query";
import { getTv } from "@/api/services/discover";
import { queryKeys } from "@/lib/query-keys";

export function useTv(id: number) {
  return useQuery({
    queryKey: queryKeys.discover.tv(id),
    queryFn: () => getTv(id),
    enabled: Number.isFinite(id),
  });
}
