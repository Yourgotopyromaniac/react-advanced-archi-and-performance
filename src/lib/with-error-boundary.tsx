import type { ComponentType } from "react";
import { ErrorBoundary } from "./errorBoundary";

// Higher-order component (HOC).
//
// Takes a component and returns a new component that wraps it in
// <ErrorBoundary>. The HOC is just a function from "component" to
// "component" — every prop the inner component accepts is preserved
// via the generic `P`.
//
// In modern React most cases that previously used HOCs are better
// expressed as wrapper components or hooks; this one earns its keep
// because we want to compose it into the route definitions (where we
// have a `ComponentType`, not JSX) without ad-hoc inline wrappers.

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
) {
  function Wrapped(props: P) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  }

  // Preserve a useful display name for React DevTools.
  Wrapped.displayName = `withErrorBoundary(${Component.displayName ?? Component.name ?? "Component"})`;

  return Wrapped;
}
