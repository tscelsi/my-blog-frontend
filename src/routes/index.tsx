import { createFileRoute } from "@tanstack/react-router";
import { Menubar } from "../components/Toolbar/Menubar";
import { Memory2 } from "../components/Memory";
import { MemoryList } from "../components/MemoryList";
import { useActiveMemory } from "../hooks/useActiveMemory";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { activeMemory } = useActiveMemory();
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1">
          <Menubar audioPlayerEnabled addMediaEnabled />
          <MemoryList />
        </div>
        <div className="border-l"></div>
        <div className="flex-2 pb-4">
          <Menubar />
          {activeMemory ? (
            <Memory2 memory={activeMemory} />
          ) : (
            <div className="w-full flex items-center justify-center">
              <p className="opacity-40">{"<blank>"}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
