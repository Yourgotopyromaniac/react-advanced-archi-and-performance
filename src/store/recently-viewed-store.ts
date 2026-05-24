import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MediaType } from "@/types/discover";

// State management at scale, slice 2 of 2.
//
// Tracks the last N titles the user opened. `record()` is called
// from TitleDetail via useEffectEvent, so the action sees the latest
// store state without making the effect re-run on store changes.

const MAX_ENTRIES = 8;

export interface RecentlyViewedEntry {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  viewedAt: number;
}

interface RecentlyViewedState {
  entries: RecentlyViewedEntry[];
  record: (entry: Omit<RecentlyViewedEntry, "viewedAt">) => void;
  clear: () => void;
}

const keyOf = (mediaType: MediaType, id: number) => `${mediaType}:${id}`;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      entries: [],
      record: (entry) =>
        set((state) => {
          const key = keyOf(entry.mediaType, entry.id);
          // Dedup, move-to-front, cap length.
          const without = state.entries.filter(
            (existing) => keyOf(existing.mediaType, existing.id) !== key,
          );
          const next = [{ ...entry, viewedAt: Date.now() }, ...without].slice(
            0,
            MAX_ENTRIES,
          );
          return { entries: next };
        }),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "raaap-recently-viewed",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export const useRecentlyViewedEntries = () =>
  useRecentlyViewedStore((state) => state.entries);

export const useRecentlyViewedCount = () =>
  useRecentlyViewedStore((state) => state.entries.length);
