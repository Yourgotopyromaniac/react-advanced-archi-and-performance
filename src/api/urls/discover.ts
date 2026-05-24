export const discoverUrls = {
  trending: (window: "day" | "week") => `/trending/all/${window}`,
  movie: (id: number) => `/movie/${id}`,
  tv: (id: number) => `/tv/${id}`,
} as const;
