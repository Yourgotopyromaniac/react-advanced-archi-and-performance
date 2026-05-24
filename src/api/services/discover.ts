import { getRequest } from "@/api/requestProcessor";
import { discoverUrls } from "@/api/urls/discover";
import type {
  MovieDetail,
  TrendingResponse,
  TvDetail,
} from "@/types/discover";

export type TrendingWindow = "day" | "week";

export const getTrending = (window: TrendingWindow = "week") =>
  getRequest<TrendingResponse>(discoverUrls.trending(window));

export const getMovie = (id: number) =>
  getRequest<MovieDetail>(discoverUrls.movie(id));

export const getTv = (id: number) =>
  getRequest<TvDetail>(discoverUrls.tv(id));
