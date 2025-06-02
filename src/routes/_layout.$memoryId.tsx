import { createFileRoute } from "@tanstack/react-router";
import { Menubar } from "../components/Toolbar/Menubar";
import { Memory } from "../components/Memory";
import { getMemoryQueryOptions } from "../memory_service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/_layout/$memoryId")({
  component: DesktopMemory,
  loader: ({ context: { queryClient }, params: { memoryId } }) => {
    return queryClient.ensureQueryData(getMemoryQueryOptions(memoryId));
  },
});

export function DesktopMemory() {
  const memoryId = Route.useParams().memoryId;
  const { data: memory } = useSuspenseQuery(getMemoryQueryOptions(memoryId));
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className="h-full w-full flex flex-col">
      {/* a blank menu bar to pad */}
      <Menubar audioPlayerEnabled={isSmallScreen} />
      <div className="flex-1">
        <Memory memory={memory} />
      </div>
      {isSmallScreen && <Footer />}
    </div>
  );
}
