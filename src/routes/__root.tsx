import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AudioProvider } from "../hooks/useAudio";
import { AuthProvider } from "../hooks/useAuth";
import { ActiveMemoryProvider } from "../hooks/useActiveMemory";

export const Route = createRootRoute({
  component: RootComponent,
});
const queryClient = new QueryClient();

function RootComponent() {
  return (
    <React.Fragment>
      <AuthProvider>
        <AudioProvider>
          <QueryClientProvider client={queryClient}>
            <ActiveMemoryProvider>
              <Outlet />
            </ActiveMemoryProvider>
          </QueryClientProvider>
        </AudioProvider>
      </AuthProvider>
    </React.Fragment>
  );
}
