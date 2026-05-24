import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { IconButton } from "@/components/ui/icon-button";
import { Routes } from "@/router/routes";
import {
  useIsWatchlisted,
  useWatchlistStore,
} from "@/store/watchlist-store";
import type { TrendingItem } from "@/types/discover";
import { imageUrl } from "@/utils/discover";

interface TrendingGridProps {
  items: TrendingItem[];
  emptyMessage?: string;
}

export function TrendingGrid({ items, emptyMessage }: TrendingGridProps) {
  // Generic <DataGrid<T>> + render-prop API. TS infers `item: TrendingItem`
  // for the renderItem callback from the items prop's element type — no
  // casts, no `any`.
  return (
    <DataGrid
      items={items}
      getKey={(item) => `${item.media_type}_${item.id}`}
      renderItem={(item) => <TrendingCard item={item} />}
      empty={
        <p className="text-neutral-500">
          {emptyMessage ?? "No titles to show."}
        </p>
      }
    />
  );
}

function TrendingCard({ item }: { item: TrendingItem }) {
  // Exhaustive switch over the discriminated union — TS narrows
  // `item` in each branch to the concrete shape, so `item.title` /
  // `item.name` / `item.known_for_department` are all type-safe.
  switch (item.media_type) {
    case "movie":
      return (
        <LinkedCard
          to={Routes.titleDetailPath("movie", item.id)}
          mediaType="movie"
          id={item.id}
          title={item.title}
          posterPath={item.poster_path}
          subtitle={`Movie · ${item.release_date?.slice(0, 4) ?? "—"}`}
        />
      );
    case "tv":
      return (
        <LinkedCard
          to={Routes.titleDetailPath("tv", item.id)}
          mediaType="tv"
          id={item.id}
          title={item.name}
          posterPath={item.poster_path}
          subtitle={`TV · ${item.first_air_date?.slice(0, 4) ?? "—"}`}
        />
      );
    case "person":
      // People aren't watchlistable (no detail page), use static Card.Root.
      return (
        <Card>
          <Card.Image src={imageUrl(item.profile_path, "w300")} />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Subtitle>{`Person · ${item.known_for_department}`}</Card.Subtitle>
          </Card.Body>
        </Card>
      
      );
  }
}

interface LinkedCardProps {
  to: string;
  mediaType: "movie" | "tv";
  id: number;
  title: string;
  posterPath: string | null;
  subtitle: string;
}

function LinkedCard({
  to,
  mediaType,
  id,
  title,
  posterPath,
  subtitle,
}: LinkedCardProps) {
  return (
    <div className="relative">
      <Card.Link to={to} ariaLabel={`${title} — open details`}>
        <Card.Image src={imageUrl(posterPath, "w300")} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle>{subtitle}</Card.Subtitle>
        </Card.Body>
      </Card.Link>

      {/* Card.Corner-style overlay button. Lives OUTSIDE the <Link>
          so toggling the watchlist doesn't navigate. */}
      <div className="absolute top-2 right-2">
        <WatchlistButton
          mediaType={mediaType}
          id={id}
          title={title}
          posterPath={posterPath}
        />
      </div>
    </div>
  );
}

interface WatchlistButtonProps {
  mediaType: "movie" | "tv";
  id: number;
  title: string;
  posterPath: string | null;
}

function WatchlistButton({
  mediaType,
  id,
  title,
  posterPath,
}: WatchlistButtonProps) {
  // Two selector hooks: one for the "is this one watchlisted?" bit,
  // one for the action. The action selector returns a stable function
  // reference, so we don't re-render when other entries change.
  const isActive = useIsWatchlisted(mediaType, id);
  const toggle = useWatchlistStore((state) => state.toggle);

  return (
    <IconButton
      tone="toggle"
      isActive={isActive}
      onClick={() => toggle({ mediaType, id, title, posterPath })}
    >
      <Heart size={14} fill={isActive ? "currentColor" : "none"} />
    </IconButton>
  );
}
