import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset jsdom + reset any persisted-store reads between tests so
// each test starts from a clean slate. Zustand's `persist` reads
// from localStorage on first store access; we clear it up front.
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Ensure env reads inside src/lib/env.ts don't throw under jsdom.
// (Vite handles `import.meta.env`, but defensively seed the token.)
if (!import.meta.env.VITE_TMDB_TOKEN) {
  Object.defineProperty(import.meta.env, "VITE_TMDB_TOKEN", {
    value: "test-token",
    writable: true,
  });
}
