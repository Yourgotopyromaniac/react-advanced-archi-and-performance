import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Flame } from "lucide-react";
import { Routes } from "@/router/routes";

const navLinks = [{ label: "Trending", path: Routes.trending, Icon: Flame }];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const current =
    navLinks.find(
      (link) =>
        location.pathname === link.path ||
        location.pathname.startsWith(`${link.path === "/" ? "/title/" : `${link.path}/`}`),
    ) ?? navLinks[0];

  return (
    <div className="flex h-screen bg-neutral-50">
      <aside className="w-[240px] h-full flex flex-col bg-white border-r border-neutral-200">
        <div className="px-6 pt-6 pb-8">
          <p className="text-lg font-semibold text-neutral-900">RAAAP with a Movie Database App</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-auto">
          {navLinks.map(({ label, path, Icon }) => {
            const isActive = current.path === path;
            return (
              <Link
                key={path}
                to={path}
                className={`py-3 pr-4 pl-5 text-sm flex items-center gap-3 transition border-l-4 ${
                  isActive
                    ? "bg-neutral-100/30 text-neutral-900 font-medium border-neutral-900"
                    : "text-neutral-500 border-transparent hover:bg-neutral-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[64px] shrink-0 bg-white border-b border-neutral-200 flex items-center px-8">
          <h1 className="text-lg font-semibold text-neutral-900">
            {current.label}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
