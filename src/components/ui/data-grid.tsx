import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Generic component (component generics in React + TypeScript).
//
// Two well-known design patterns coexist here:
//   1. Render prop: `renderItem` is a function passed as a prop that
//      decides how each item is displayed. The grid owns layout +
//      keying; the consumer owns the item visuals.
//   2. Component generics: `<DataGrid<T>>` flows the item type through
//      to `renderItem(item: T)`, so the consumer gets a fully typed
//      callback with zero `any` casts.
//
// The `getKey` prop is also generic — TS infers it from the same `T`.

export interface DataGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string | number;
  empty?: ReactNode;
  className?: string;
}

export function DataGrid<T>({
  items,
  renderItem,
  getKey,
  empty,
  className,
}: DataGridProps<T>) {
  if (items.length === 0 && empty) return <>{empty}</>;

  return (
    <ul
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4",
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={getKey(item, index)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}
