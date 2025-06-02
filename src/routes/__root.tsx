import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AudioProvider } from "../hooks/useAudio";
import { AuthProvider } from "../hooks/useAuth";
import { ActiveMemoryProvider } from "../hooks/useActiveMemory";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <AuthProvider>
        <AudioProvider>
          <ActiveMemoryProvider>
            <Outlet />
          </ActiveMemoryProvider>
        </AudioProvider>
      </AuthProvider>
    </React.Fragment>
  );
}
