import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataGrid } from "./data-grid";

// COMPONENT TEST (unit-style): exercises the generic DataGrid in isolation
// without router/query/store dependencies. Verifies the render-prop API
// and the empty-state branch.

describe("DataGrid", () => {
  it("renders each item via the renderItem render prop, keyed by getKey", () => {
    type Item = { id: number; name: string };
    const items: Item[] = [
      { id: 1, name: "Alpha" },
      { id: 2, name: "Bravo" },
      { id: 3, name: "Charlie" },
    ];

    render(
      <DataGrid<Item>
        items={items}
        getKey={(item) => item.id}
        renderItem={(item) => <span>{item.name}</span>}
      />,
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bravo")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders the empty fallback when items is empty", () => {
    render(
      <DataGrid<number>
        items={[]}
        getKey={(n) => n}
        renderItem={(n) => <span>{n}</span>}
        empty={<p>Nothing here yet</p>}
      />,
    );

    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
