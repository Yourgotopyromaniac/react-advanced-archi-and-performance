import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MediaType } from "@/types/discover";

// State management at scale, slice 1 of 2.
//
// Each slice (a) is a focused domain, (b) persists its own data to
// localStorage so it survives reloads, and (c) is consumed via small
// SELECTOR hooks rather than `useWatchlistStore()` returning the
// whole object. Selectors keep components from re-rendering when an
// unrelated field changes.

export interface WatchlistEntry {
  /** Stable identity = mediaType + id. */
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: number;
}

interface WatchlistState {
  entries: Record<string, WatchlistEntry>;
  toggle: (entry: Omit<WatchlistEntry, "addedAt">) => void;
  clear: () => void;
}

const keyOf = (mediaType: MediaType, id: number) => `${mediaType}:${id}`;

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      entries: {},
      toggle: (entry) =>
        set((state) => {
          const key = keyOf(entry.mediaType, entry.id);
          const next = { ...state.entries };
          if (next[key]) {
            delete next[key];
          } else {
            next[key] = { ...entry, addedAt: Date.now() };
          }
          return { entries: next };
        }),
      clear: () => set({ entries: {} }),
    }),
    {
      name: "raaap-watchlist",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

// Selector hooks — components subscribe only to the slice of state
// they actually use. The reference equality of the returned value
// determines whether the component re-renders.

export const useIsWatchlisted = (mediaType: MediaType, id: number) =>
  useWatchlistStore((state) => Boolean(state.entries[keyOf(mediaType, id)]));

export const useWatchlistCount = () =>
  useWatchlistStore((state) => Object.keys(state.entries).length);

export const useWatchlistEntries = () =>
  useWatchlistStore((state) => state.entries);
