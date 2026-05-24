import {
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ApiError } from "./api-error";

const showErrorToast = (error: unknown, fallback: string) => {
  const message = error instanceof ApiError ? error.message : fallback;
  toast.error(message);
};

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Only toast on background refetches; initial loads render their own error UI.
        if (query.state.data !== undefined) {
          showErrorToast(error, "Failed to refresh data");
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        if (mutation.options.onError) return;
        showErrorToast(error, "Something went wrong");
      },
    }),
  });
