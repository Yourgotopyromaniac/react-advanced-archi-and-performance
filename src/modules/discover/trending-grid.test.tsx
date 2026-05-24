import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useWatchlistStore } from "@/store/watchlist-store";
import type { TrendingItem } from "@/types/discover";
import { TrendingGrid } from "./trending-grid";

// COMPONENT TEST (with collaborators): exercises TrendingGrid + Card + the
// watchlist IconButton through their real implementations, but stays
// scoped to one module — no router navigation, no network calls.

const items: TrendingItem[] = [
  {
    media_type: "movie",
    id: 100,
    title: "The Test",
    overview: "",
    poster_path: null,
    backdrop_path: null,
    release_date: "2026-01-01",
    vote_average: 7.2,
  },
  {
    media_type: "tv",
    id: 200,
    name: "The Show",
    overview: "",
    poster_path: null,
    backdrop_path: null,
    first_air_date: "2025-03-15",
    vote_average: 8.4,
  },
  {
    media_type: "person",
    id: 300,
    name: "Someone Famous",
    profile_path: null,
    known_for_department: "Acting",
  },
];

function renderWithRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("TrendingGrid", () => {
  it("renders one card per item, including the People branch of the discriminated union", () => {
    renderWithRouter(<TrendingGrid items={items} />);

    expect(screen.getByText("The Test")).toBeInTheDocument();
    expect(screen.getByText(/Movie · 2026/)).toBeInTheDocument();
    expect(screen.getByText("The Show")).toBeInTheDocument();
    expect(screen.getByText(/TV · 2025/)).toBeInTheDocument();
    expect(screen.getByText("Someone Famous")).toBeInTheDocument();
    expect(screen.getByText("Person · Acting")).toBeInTheDocument();
  });

  it("only shows watchlist buttons on movie/tv cards, not on person cards", () => {
    renderWithRouter(<TrendingGrid items={items} />);

    // Two watchlistable items → two toggle buttons.
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(2);
  });

  it("toggles a title into the watchlist store when the heart is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TrendingGrid items={items} />);

    const movieCard = screen.getByText("The Test").closest("li");
    if (!movieCard) throw new Error("Movie card missing");

    const toggle = within(movieCard).getByRole("button", {
      name: /Add to watchlist/i,
    });
    await user.click(toggle);

    const entries = useWatchlistStore.getState().entries;
    expect(entries["movie:100"]).toMatchObject({
      mediaType: "movie",
      id: 100,
      title: "The Test",
    });
  });
});
