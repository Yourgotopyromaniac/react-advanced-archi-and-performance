// Central registry of query keys, one factory per resource.
// See: https://tkdodo.eu/blog/effective-react-query-keys
export const queryKeys = {
  discover: {
    all: ["discover"] as const,
    trendings: () => [...queryKeys.discover.all, "trending"] as const,
    trending: (window: "day" | "week") =>
      [...queryKeys.discover.trendings(), window] as const,
    movies: () => [...queryKeys.discover.all, "movie"] as const,
    movie: (id: number) => [...queryKeys.discover.movies(), id] as const,
    tvShows: () => [...queryKeys.discover.all, "tv"] as const,
    tv: (id: number) => [...queryKeys.discover.tvShows(), id] as const,
  },
} as const;
