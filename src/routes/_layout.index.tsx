import { createFileRoute } from "@tanstack/react-router";
import { Menubar } from "../components/Toolbar/Menubar";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { listMemoriesQueryOptions } from "../memory_service";
import { useAuth } from "../hooks/useAuth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MemoryList } from "../components/MemoryList";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/_layout/")({
  component: HomePage,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(listMemoriesQueryOptions());
  },
});

function HomePage() {
  const { session } = useAuth();
  const isSmallScreen = useIsSmallScreen();
  const { data: memories } = useSuspenseQuery(listMemoriesQueryOptions());
  if (isSmallScreen) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="flex flex-1">
          <div className="flex-1">
            <Menubar audioPlayerEnabled addMediaEnabled={session !== null} />
            <MemoryList memories={memories} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1">
          <Menubar />
          <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-4/5">
              <p className="opacity-40">{"<blank>"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
