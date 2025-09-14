import { Menubar } from "../components/Toolbar/Menubar";
import { Memory } from "../components/Memory";
import { getPublicMemoryQueryOptions } from "../queries/sharing_service";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { Footer } from "../components/Footer";
import { Loader } from "../components/Loader";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/public/$memoryId")({
  component: PublicMemoryPage,
  loader: ({ context: { queryClient }, params: { memoryId } }) => {
    return queryClient.ensureQueryData(getPublicMemoryQueryOptions(memoryId));
  },
  pendingComponent: () => <Loader />,
  errorComponent: PublicMemoryErrorComponent,
  pendingMs: 100,
  pendingMinMs: 1000,
});

export function PublicMemoryErrorComponent() {
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  React.useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div>
      This memory isn't public!
      {/* <ErrorComponent error={error} /> */}
    </div>
  );
}

export function PublicMemoryPage() {
  const memoryId = Route.useParams().memoryId;
  const isSmallScreen = useIsSmallScreen();

  // Ensure the memory query is hydrated for the Memory component to consume
  useSuspenseQuery(getPublicMemoryQueryOptions(memoryId));

  return (
    <div className="h-full w-full flex flex-col">
      <Menubar audioPlayerEnabled={isSmallScreen} />
      <div className="flex-1 pb-4">
        <Memory memoryId={memoryId} isPublic />
      </div>
      {isSmallScreen && <Footer />}
    </div>
  );
}
