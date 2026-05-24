import { Navigate, useParams } from "react-router";
import { TitleDetailSkeleton } from "@/components/skeletons/title-detail-skeleton";
import { useMovie } from "@/hooks/discover/use-movie";
import { useTv } from "@/hooks/discover/use-tv";
import {
  TitleDetailStatus,
  TitleDetailUI,
} from "@/modules/discover/title-detail";
import { Routes } from "@/router/routes";
import { imageUrl, isMediaType } from "@/utils/discover";

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
      poster={imageUrl(data.poster_path, "w500")}
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
      poster={imageUrl(data.poster_path, "w500")}
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
