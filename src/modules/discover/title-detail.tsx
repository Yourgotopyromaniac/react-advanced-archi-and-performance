import { Link } from "react-router";
import { Routes } from "@/router/routes";

interface TitleDetailUIProps {
  poster: string | null;
  title: string;
  meta: (string | null)[];
  rating: number;
  voteCount: number;
  overview: string;
}

export function TitleDetailUI({
  poster,
  title,
  meta,
  rating,
  voteCount,
  overview,
}: TitleDetailUIProps) {
  return (
    <article className="space-y-6">
      <Link
        to={Routes.trending}
        className="text-sm text-neutral-500 hover:underline"
      >
        ← Back
      </Link>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-48 shrink-0">
          <div className="aspect-[2/3] bg-neutral-200 rounded-lg overflow-hidden">
            {poster && (
              <img src={poster} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-2xl text-black font-semibold">{title}</h1>
          <p className="text-sm text-neutral-500">
            {meta.filter(Boolean).join(" · ")}
          </p>
          <p className="text-sm">
            <span className="font-medium text-amber-500">★ {rating.toFixed(1)}</span>
            <span className="text-neutral-500">
              {" "}
              ({voteCount.toLocaleString()} votes)
            </span>
          </p>
          <p className="text-neutral-700 leading-relaxed">{overview}</p>
        </div>
      </div>
    </article>
  );
}

interface TitleDetailStatusProps {
  message: string;
  tone?: "muted" | "error";
}

export function TitleDetailStatus({
  message,
  tone = "muted",
}: TitleDetailStatusProps) {
  return (
    <p className={tone === "error" ? "text-red-600" : "text-neutral-500"}>
      {message}
    </p>
  );
}
