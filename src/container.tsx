import { Memory } from "./components/Memory";
import { useListMemories } from "./memory_service";
import { Toolbar } from "./components/Dialog/MainToolbar";
import { useEffect, useRef, useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { useAuth } from "./hooks/useAuth";

export default function Container() {
  const { session } = useAuth();
  const query = useListMemories();
  const ref = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{
    [id: string]: { top: number; left: number };
  }>({});

  useEffect(() => {
    if (query.isSuccess && Object.keys(positions).length === 0 && ref.current) {
      const container = ref.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const newPositions: { [id: string]: { top: number; left: number } } = {};
      query.data.forEach((memory) => {
        // 200x200 is a guess for Memory size, adjust as needed
        newPositions[memory.id] = {
          top: Math.random() * (height - 60) + 10,
          left: Math.random() * (width - 350) + 10,
        };
      });
      setPositions(newPositions);
    }
  }, [query.isSuccess, query.data, positions, ref]);

  return (
    <div className="w-full h-screen z-10" ref={ref}>
      <div className="flex justify-center items-center pt-4">
        <div className="fit-content flex flex-col items-start w-[132px]">
          {session && <Toolbar />}
          <AudioPlayer />
        </div>
      </div>
      {query.isSuccess && (
        <div className="h-full w-full">
          {query.data.map((memory) => (
            <Memory
              key={memory.id}
              containerRef={ref}
              memory={memory}
              position={positions[memory.id] || { top: 0, left: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
