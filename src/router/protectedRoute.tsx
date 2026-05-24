import type { ReactNode } from "react";

// TMDB browsing is unauthenticated, so this is a pass-through today.
// Kept in the router shell to preserve the `isProtected` route convention
// for future authenticated features.
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export { ProtectedRoute };
