import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { Menubar } from "../components/Toolbar/Menubar";
import { MemoryList } from "../components/MemoryList";
import { Footer } from "../components/Footer";
import { listMemoriesQueryOptions } from "../memory_service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { useRef } from "react";
import { motion } from "motion/react";

export const Route = createFileRoute("/_layout")({
  component: Layout,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(listMemoriesQueryOptions());
  },
});

export function Layout() {
  const { session } = useAuth();
  const isSmallScreen = useIsSmallScreen();
  const { data: memories } = useSuspenseQuery(listMemoriesQueryOptions());
  const constraintsRef = useRef(null);

  if (isSmallScreen) return <Outlet />;
  return (
    <div ref={constraintsRef} className="h-full w-full flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1">
          <Menubar audioPlayerEnabled addMediaEnabled={session !== null} />
          <MemoryList memories={memories} />
        </div>
        <div className="border-l border-light-grey"></div>
        <div className="flex-2 pb-4">
          <Outlet />
        </div>
      </div>
      <Footer />
      <motion.img
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        className="object-none absolute top-1/2 left-1/2 w-1/5 h-32 rounded-xs z-3"
        src="/sunrise.png"
      ></motion.img>
    </div>
  );
}
