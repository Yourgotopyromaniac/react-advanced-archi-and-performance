import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Clock, Flame, Heart } from "lucide-react";
import { Routes } from "@/router/routes";
import {
  useRecentlyViewedEntries,
} from "@/store/recently-viewed-store";
import { useWatchlistCount } from "@/store/watchlist-store";
import { imageUrl } from "@/utils/discover";

const navLinks = [{ label: "Trending", path: Routes.trending, Icon: Flame }];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const current =
    navLinks.find(
      (link) =>
        location.pathname === link.path ||
        location.pathname.startsWith(
          `${link.path === "/" ? "/title/" : `${link.path}/`}`,
        ),
    ) ?? navLinks[0];

  return (
    <div className="flex h-screen bg-neutral-50">
      <aside className="w-[280px] h-full flex flex-col bg-white border-r border-neutral-200">
        <div className="px-6 pt-6 pb-8">
          <p className="text-lg font-semibold text-neutral-900">
            RAAAP with a Movie Database App
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {navLinks.map(({ label, path, Icon }) => {
            const isActive = current.path === path;
            return (
              <Link
                key={path}
                to={path}
                className={`py-3 pr-4 pl-5 text-sm flex items-center gap-3 transition border-l-4 ${
                  isActive
                    ? "bg-neutral-100/30 text-neutral-900 font-medium border-neutral-900"
                    : "text-neutral-500 border-transparent hover:bg-neutral-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <WatchlistRow />
        <RecentlyViewedList />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[64px] shrink-0 bg-white border-b border-neutral-200 flex items-center px-8">
          <h1 className="text-lg font-semibold text-neutral-900">
            {current.label}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

function WatchlistRow() {
  // Subscribed via a narrow selector — only re-renders when the count
  // actually changes, not when any other watchlist field is touched.
  const count = useWatchlistCount();

  return (
    <div className="py-3 pr-4 pl-5 text-sm flex items-center gap-3 text-neutral-500 border-l-4 border-transparent">
      <Heart size={18} fill={count > 0 ? "currentColor" : "none"} />
      <span>Watchlist</span>
      <span className="ml-auto text-xs font-medium text-white bg-neutral-100 rounded-full px-2 py-0.5">
        {count}
      </span>
    </div>
  );
}

function RecentlyViewedList() {
  const entries = useRecentlyViewedEntries();

  return (
    <div className="mt-4 pt-4 border-t border-neutral-200 px-4 flex-1 overflow-y-auto">
      <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3 px-1">
        <Clock size={14} />
        Recently viewed
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-neutral-400 px-1">
          Open a title to start populating this list.
        </p>
      ) : (
        <ul className="space-y-1">
          {entries.map((entry) => (
            <li key={`${entry.mediaType}_${entry.id}`}>
              <Link
                to={Routes.titleDetailPath(entry.mediaType, entry.id)}
                className="flex items-center gap-2 p-1 rounded hover:bg-neutral-100"
              >
                <div className="w-8 h-12 rounded bg-neutral-200 overflow-hidden shrink-0">
                  {entry.posterPath && (
                    <img
                      src={imageUrl(entry.posterPath, "w200") ?? undefined}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="text-xs text-neutral-700 line-clamp-2">
                  {entry.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
