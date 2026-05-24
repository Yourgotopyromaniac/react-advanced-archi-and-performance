import { Link } from "react-router";
import type { TrendingItem } from "@/types/discover";
import { imageUrl } from "@/utils/discover";
import { Routes } from "@/router/routes";

interface TrendingGridProps {
  items: TrendingItem[];
}

export function TrendingGrid({ items }: TrendingGridProps) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <TrendingCard key={`${item.media_type}_${item.id}`} item={item} />
      ))}
    </ul>
  );
}

function TrendingCard({ item }: { item: TrendingItem }) {
  switch (item.media_type) {
    case "movie":
      return (
        <Card
          to={Routes.titleDetailPath("movie", item.id)}
          imgSrc={imageUrl(item.poster_path, "w300")}
          title={item.title}
          subtitle={`Movie · ${item.release_date?.slice(0, 4) ?? "—"}`}
        />
      );
    case "tv":
      return (
        <Card
          to={Routes.titleDetailPath("tv", item.id)}
          imgSrc={imageUrl(item.poster_path, "w300")}
          title={item.name}
          subtitle={`TV · ${item.first_air_date?.slice(0, 4) ?? "—"}`}
        />
      );
    case "person":
      return (
        <Card
          imgSrc={imageUrl(item.profile_path, "w300")}
          title={item.name}
          subtitle={`Person · ${item.known_for_department}`}
        />
      );
  }
}

interface CardProps {
  to?: string;
  imgSrc: string | null;
  title: string;
  subtitle: string;
}

function Card({ to, imgSrc, title, subtitle }: CardProps) {
  const body = (
    <>
      <div className="aspect-[2/3] bg-neutral-200">
        {imgSrc && (
          <img
            src={imgSrc}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-3">
        <p className="font-medium text-sm text-black leading-snug line-clamp-2">{title}</p>
        <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
      </div>
    </>
  );

  const shell =
    "block border bg-white rounded-lg overflow-hidden hover:shadow-sm transition";

  return (
    <li>
      {to ? (
        <Link to={to} className={shell}>
          {body}
        </Link>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </li>
  );
}
