import { createElement, type ComponentType, type ReactNode } from "react";
import type { PathRouteProps } from "react-router";
import { Navigate } from "react-router";
import Layout from "@/components/layout/layout";
import { Trending } from "@/pages/discover/trending";
import { TitleDetail } from "@/pages/discover/title-detail";
import { Routes } from "./routes";

export interface RouteBuilderItem extends PathRouteProps {
  Layout?: ComponentType<{ children: ReactNode }>;
  Element: ComponentType;
  props?: Record<string, never>;
  isProtected?: boolean;
}

const NotFoundRedirect = () =>
  createElement(Navigate, { to: Routes.trending, replace: true });

export const RouteBuilder: RouteBuilderItem[] = [
  { path: Routes.trending, Element: Trending, Layout },
  { path: Routes.titleDetail, Element: TitleDetail, Layout },
  { path: "*", Element: NotFoundRedirect },
];
