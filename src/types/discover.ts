// TMDB's `/trending/all` endpoint returns mixed media types in one list,
// tagged with `media_type` — a server-provided discriminated union.

export type MediaType = "movie" | "tv";

export interface TrendingMovie {
  media_type: "movie";
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TrendingTv {
  media_type: "tv";
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
}

export interface TrendingPerson {
  media_type: "person";
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

export type TrendingItem = TrendingMovie | TrendingTv | TrendingPerson;

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
}

export interface TvDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
}
