import { Activity, useCallback, useMemo, useState } from "react";
import { TrendingGridSkeleton } from "@/components/skeletons/trending-grid-skeleton";
import { Tabs } from "@/components/ui/tabs";
import { useTrending } from "@/hooks/discover/use-trending";
import type { TrendingItem } from "@/types/discover";
import { TrendingGrid } from "./trending-grid";

type MediaFilter = "all" | "movie" | "tv" | "person";
type WindowChoice = "day" | "week";

const filterLabels: Record<MediaFilter, string> = {
  all: "All",
  movie: "Movies",
  tv: "TV",
  person: "People",
};

export function TrendingUI() {
  // Top-level page state lives here so both tab panels can share it.
  const [window, setWindow] = useState<WindowChoice>("week");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");

  // useCallback gives the Tabs onValueChange a stable identity so the
  // Tabs context memo doesn't churn each render. Note: with the React
  // Compiler enabled, you wouldn't need this — see CONCEPTS.md.
  const handleWindowChange = useCallback((next: WindowChoice) => {
    setWindow(next);
  }, []);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-black">Trending</h1>
        <MediaFilterChips value={mediaFilter} onChange={setMediaFilter} />
      </header>

      <Tabs value={window} onValueChange={handleWindowChange}>
        <Tabs.List>
          <Tabs.Tab value="day">Today</Tabs.Tab>
          <Tabs.Tab value="week">This week</Tabs.Tab>
        </Tabs.List>

        {/* React 19.2 <Activity>: both panels stay mounted, but only the
            active one paints + runs effects. React Query keeps each
            window's data warm, so switching tabs is instant. */}
        <Tabs.Panel value="day" keepMounted>
          <Activity mode={window === "day" ? "visible" : "hidden"}>
            <TrendingWindowPanel window="day" mediaFilter={mediaFilter} />
          </Activity>
        </Tabs.Panel>

        <Tabs.Panel value="week" keepMounted>
          <Activity mode={window === "week" ? "visible" : "hidden"}>
            <TrendingWindowPanel window="week" mediaFilter={mediaFilter} />
          </Activity>
        </Tabs.Panel>
      </Tabs>
    </section>
  );
}

interface TrendingWindowPanelProps {
  window: WindowChoice;
  mediaFilter: MediaFilter;
}

function TrendingWindowPanel({
  window,
  mediaFilter,
}: TrendingWindowPanelProps) {
  const { data, isLoading, isError, error } = useTrending(window);

  // useMemo: filteredItems is O(n) in the result count but recomputes
  // each render unless we memoize it. The dependency list is what
  // signals to React when the value is actually stale.
  const filteredItems = useMemo<TrendingItem[]>(() => {
    const all = data?.results ?? [];
    if (mediaFilter === "all") return all;
    return all.filter((item) => item.media_type === mediaFilter);
  }, [data, mediaFilter]);

  if (isLoading) return <TrendingGridSkeleton />;
  if (isError) {
    return (
      <p className="text-red-600">
        {error instanceof Error ? error.message : "Failed to load trending."}
      </p>
    );
  }

  return (
    <TrendingGrid
      items={filteredItems}
      emptyMessage={`No ${filterLabels[mediaFilter].toLowerCase()} in this window.`}
    />
  );
}

interface MediaFilterChipsProps {
  value: MediaFilter;
  onChange: (next: MediaFilter) => void;
}

function MediaFilterChips({ value, onChange }: MediaFilterChipsProps) {
  // The options array is static — useMemo avoids re-allocating it
  // on every render. (A trivial example here to show the shape.)
  const options = useMemo<MediaFilter[]>(
    () => ["all", "movie", "tv", "person"],
    [],
  );

  return (
    <div className="inline-flex gap-1 rounded-full bg-neutral-100 p-1">
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              isActive
                ? "bg-white text-neutral-900 shadow-sm"
                : "hover:text-neutral-900"
            }`}
          >
            {filterLabels[option]}
          </button>
        );
      })}
    </div>
  );
}
