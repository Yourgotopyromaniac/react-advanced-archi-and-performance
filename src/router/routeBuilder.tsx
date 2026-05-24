import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type ReactNode,
} from "react";
import type { PathRouteProps } from "react-router";
import { Navigate } from "react-router";
import Layout from "@/components/layout/layout";
import { TitleDetailSkeleton } from "@/components/skeletons/title-detail-skeleton";
import { TrendingGridSkeleton } from "@/components/skeletons/trending-grid-skeleton";
import { withErrorBoundary } from "@/lib/with-error-boundary";
import { Routes } from "./routes";

// Route-level code splitting via React.lazy.
// Each page becomes its own JS chunk fetched on demand. The HOC wraps
// the lazy import so a render error in the chunk doesn't crash the app.
const TrendingPage = withErrorBoundary(
  lazy(() =>
    import("@/pages/discover/trending").then((m) => ({ default: m.Trending })),
  ),
);

const TitleDetailPage = withErrorBoundary(
  lazy(() =>
    import("@/pages/discover/title-detail").then((m) => ({
      default: m.TitleDetail,
    })),
  ),
);

// <Suspense> is what tells React "while this lazy chunk loads (or any
// other suspending data source resolves), render this fallback." We
// reuse the skeletons we already built for in-page loading states so
// the chunk fetch and the data fetch share a visual treatment.
const withSuspense = (
  PageElement: ComponentType,
  fallback: ReactNode,
): ComponentType =>
  function SuspendedRoute() {
    return (
      <Suspense fallback={fallback}>
        <PageElement />
      </Suspense>
    );
  };

export interface RouteBuilderItem extends PathRouteProps {
  Layout?: ComponentType<{ children: ReactNode }>;
  Element: ComponentType;
  props?: Record<string, never>;
  isProtected?: boolean;
}

const NotFoundRedirect = () =>
  createElement(Navigate, { to: Routes.trending, replace: true });

export const RouteBuilder: RouteBuilderItem[] = [
  {
    path: Routes.trending,
    Element: withSuspense(TrendingPage, <TrendingGridSkeleton />),
    Layout,
  },
  {
    path: Routes.titleDetail,
    Element: withSuspense(TitleDetailPage, <TitleDetailSkeleton />),
    Layout,
  },
  { path: "*", Element: NotFoundRedirect },
];
