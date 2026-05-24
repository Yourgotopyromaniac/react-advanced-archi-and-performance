import { create } from "zustand";

// Small app-shell store. Currently just tracks theme — extend with viewer
// preferences, recently-viewed titles, etc. as more features come online.
interface AppState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));
