import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TrendingResponse } from "@/types/discover";

// INTEGRATION TEST: the page is rendered with its real hooks, real
// react-query, real Zustand stores, real router. We mock at the
// service boundary so the request orchestration runs for real but
// no network is involved. That's the level where "useEffect → hook
// → service → component" wiring bugs typically appear.

vi.mock("@/api/services/discover", () => ({
  getTrending: vi.fn(),
  getMovie: vi.fn(),
  getTv: vi.fn(),
}));

import { getTrending } from "@/api/services/discover";
import { Trending } from "./trending";

const mockedGetTrending = vi.mocked(getTrending);

const fakeResponse = (window: "day" | "week"): TrendingResponse => ({
  page: 1,
  total_pages: 1,
  total_results: 2,
  results: [
    {
      media_type: "movie",
      id: window === "week" ? 1 : 10,
      title: window === "week" ? "Weekly Movie" : "Daily Movie",
      overview: "",
      poster_path: null,
      backdrop_path: null,
      release_date: "2026-01-01",
      vote_average: 7,
    },
    {
      media_type: "tv",
      id: 2,
      name: "Shared Show",
      overview: "",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "2025-06-01",
      vote_average: 8,
    },
  ],
});

function renderTrending() {
  // Fresh QueryClient per test → no cache leakage between cases.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Trending />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  mockedGetTrending.mockImplementation((win) =>
    Promise.resolve(fakeResponse(win ?? "week")),
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Trending (integration)", () => {
  it("loads + renders the week-trending list on initial mount", async () => {
    renderTrending();

    expect(await screen.findByText("Weekly Movie")).toBeInTheDocument();
    expect(screen.getByText("Shared Show")).toBeInTheDocument();
  });

  it("switches between Day and Week tabs and shows each window's data", async () => {
    const user = userEvent.setup();
    renderTrending();

    // Week is visible on mount.
    expect(await screen.findByText("Weekly Movie")).toBeInTheDocument();
    await waitFor(() =>
      expect(mockedGetTrending).toHaveBeenCalledWith("week"),
    );

    // Switching tabs reveals the day panel, which kicks off its fetch.
    await user.click(screen.getByRole("tab", { name: /Today/i }));
    expect(await screen.findByText("Daily Movie")).toBeInTheDocument();
    await waitFor(() => expect(mockedGetTrending).toHaveBeenCalledWith("day"));
  });

  it("filters by media type without re-fetching", async () => {
    const user = userEvent.setup();
    renderTrending();

    await screen.findByText("Weekly Movie");
    const callsBefore = mockedGetTrending.mock.calls.length;

    await user.click(screen.getByRole("button", { name: "TV" }));

    // Movie card is filtered out, TV card remains.
    await waitFor(() => {
      expect(screen.queryByText("Weekly Movie")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Shared Show")).toBeInTheDocument();

    // Filtering is pure client-side — no new network call.
    expect(mockedGetTrending.mock.calls.length).toBe(callsBefore);
  });
});
