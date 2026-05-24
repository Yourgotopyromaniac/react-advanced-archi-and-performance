import { env } from "@/lib/env";
import type { MediaType } from "@/types/discover";

type ImageSize = "w200" | "w300" | "w500" | "w780" | "original";

/** Build a TMDB image URL. Pass `null` for missing paths → returns null. */
export function imageUrl(
  path: string | null,
  size: ImageSize = "w500",
): string | null {
  if (!path) return null;
  return `${env.tmdbImageBaseUrl}/${size}${path}`;
}

/** Type guard used by the router to validate the `:mediaType` URL param. */
export function isMediaType(value: string | undefined): value is MediaType {
  return value === "movie" || value === "tv";
}
