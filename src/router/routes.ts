import type { MediaType } from "@/types/discover";

export const Routes = {
  trending: "/",
  titleDetail: "/title/:mediaType/:id",
  titleDetailPath: (mediaType: MediaType, id: number | string) =>
    `/title/${mediaType}/${id}`,
} as const;
