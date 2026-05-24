import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { createQueryClient } from "@/lib/query-client";

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: "400",
          },
          success: {
            style: {
              background: "#22C55D",
              color: "#FFFFFF",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#FFFFFF",
            },
          },
          loading: {
            style: {
              background: "#374151",
              color: "#FFFFFF",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default Providers;
