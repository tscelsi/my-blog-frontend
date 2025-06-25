import { createFileRoute } from "@tanstack/react-router";
import { Menubar } from "../components/Toolbar/Menubar";
import { Memory } from "../components/Memory";
import { getMemoryQueryOptions } from "../memory_service";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { Footer } from "../components/Footer";
import { Loader } from "../components/Loader";

export const Route = createFileRoute("/_layout/$memoryId")({
  component: MemoryPage,
  loader: ({ context: { queryClient }, params: { memoryId } }) => {
    return queryClient.ensureQueryData(getMemoryQueryOptions(memoryId));
  },
  pendingComponent: () => <Loader />,
  pendingMs: 100,
  pendingMinMs: 1000,
});

export function MemoryPage() {
  const memoryId = Route.useParams().memoryId;
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className="h-full w-full flex flex-col">
      {/* a blank menu bar to pad */}
      <Menubar audioPlayerEnabled={isSmallScreen} />
      <div className="flex-1 pb-4">
        <Memory memoryId={memoryId} />
      </div>
      {isSmallScreen && <Footer />}
    </div>
  );
}
