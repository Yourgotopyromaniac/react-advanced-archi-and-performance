const tmdbToken = import.meta.env.VITE_TMDB_TOKEN;

if (!tmdbToken) {
  throw new Error(
    "Missing VITE_TMDB_TOKEN — copy .env.example to .env and add your TMDB v4 read access token.",
  );
}

const tmdbBaseUrl =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const tmdbImageBaseUrl =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

export const env = {
  tmdbToken: tmdbToken as string,
  tmdbBaseUrl: tmdbBaseUrl as string,
  tmdbImageBaseUrl: tmdbImageBaseUrl as string,
} as const;
