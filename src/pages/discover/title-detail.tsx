import { useEffect } from "react";
import { useEffectEvent } from "react";
import { Navigate, useParams } from "react-router";
import { TitleDetailSkeleton } from "@/components/skeletons/title-detail-skeleton";
import { useMovie } from "@/hooks/discover/use-movie";
import { useTv } from "@/hooks/discover/use-tv";
import {
  TitleDetailStatus,
  TitleDetailUI,
} from "@/modules/discover/title-detail";
import { Routes } from "@/router/routes";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import type { MediaType } from "@/types/discover";
import { isMediaType } from "@/utils/discover";

const TitleDetail = () => {
  const { mediaType, id } = useParams();

  if (!isMediaType(mediaType)) return <Navigate to={Routes.trending} replace />;
  const titleId = Number(id);
  if (!Number.isFinite(titleId))
    return <Navigate to={Routes.trending} replace />;

  return mediaType === "movie" ? (
    <MovieDetail id={titleId} />
  ) : (
    <TvDetail id={titleId} />
  );
};

export { TitleDetail };

function MovieDetail({ id }: { id: number }) {
  const { data, isLoading, isError, error } = useMovie(id);
  useRecordVisit({
    mediaType: "movie",
    id,
    title: data?.title,
    posterPath: data?.poster_path ?? null,
  });

  if (isLoading) return <TitleDetailSkeleton />;
  if (isError || !data) {
    return (
      <TitleDetailStatus
        tone="error"
        message={error instanceof Error ? error.message : "Not found."}
      />
    );
  }

  return (
    <TitleDetailUI
      mediaType="movie"
      id={data.id}
      posterPath={data.poster_path}
      title={data.title}
      meta={[
        `${data.release_date?.slice(0, 4) ?? "—"}`,
        data.runtime ? `${data.runtime} min` : null,
        ...data.genres.map((g) => g.name),
      ]}
      rating={data.vote_average}
      voteCount={data.vote_count}
      overview={data.overview}
    />
  );
}

function TvDetail({ id }: { id: number }) {
  const { data, isLoading, isError, error } = useTv(id);
  useRecordVisit({
    mediaType: "tv",
    id,
    title: data?.name,
    posterPath: data?.poster_path ?? null,
  });

  if (isLoading) return <TitleDetailSkeleton />;
  if (isError || !data) {
    return (
      <TitleDetailStatus
        tone="error"
        message={error instanceof Error ? error.message : "Not found."}
      />
    );
  }

  return (
    <TitleDetailUI
      mediaType="tv"
      id={data.id}
      posterPath={data.poster_path}
      title={data.name}
      meta={[
        `${data.first_air_date?.slice(0, 4) ?? "—"}`,
        `${data.number_of_seasons} season${data.number_of_seasons === 1 ? "" : "s"}`,
        `${data.number_of_episodes} episodes`,
        ...data.genres.map((g) => g.name),
      ]}
      rating={data.vote_average}
      voteCount={data.vote_count}
      overview={data.overview}
    />
  );
}

interface VisitInput {
  mediaType: MediaType;
  id: number;
  title: string | undefined;
  posterPath: string | null;
}

/**
 * Records a "recently viewed" entry for the current title.
 *
 * The interesting bit is `useEffectEvent`: we want the effect to fire
 * once per (mediaType, id) pair — that's the REACTIVE dependency.
 * But the action also reads `title` and `posterPath`, which can change
 * later when the query resolves. If we depended on those too, the
 * effect would fire again and double-record the visit. If we omitted
 * them from the deps list, ESLint would (correctly) flag a stale-closure
 * bug.
 *
 * `useEffectEvent` is the escape hatch designed for exactly this: it
 * captures the latest values from each render WITHOUT participating
 * in the effect's dependency list.
 */
function useRecordVisit({ mediaType, id, title, posterPath }: VisitInput) {
  const record = useRecentlyViewedStore((state) => state.record);

  const onTitleViewed = useEffectEvent(() => {
    if (!title) return;
    record({ mediaType, id, title, posterPath });
  });

  useEffect(() => {
    onTitleViewed();
    // Deliberately only the navigation identity. `title` and
    // `posterPath` resolve after the query and shouldn't refire the
    // effect — `useEffectEvent` reads their latest values for us.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType, id]);
}
