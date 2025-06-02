import { Link } from "@tanstack/react-router";
import { useActiveMemory } from "../hooks/useActiveMemory";
import { formatDate } from "../utils/date_stuff";
import { Memory } from "../types";

type MemoryListProps = {
  memories: Memory[];
};

export const MemoryList = ({ memories }: MemoryListProps) => {
  const { setActiveMemory } = useActiveMemory();

  return (
    <div className="flex flex-col">
      {memories.map((memory) => (
        <Link key={memory.id} to="/$memoryId" params={{ memoryId: memory.id }}>
          <div
            className="hover:opacity-80 cursor-pointer border-b border-dark-grey first:border-t"
            onClick={() => setActiveMemory(memory)}
          >
            <p className="mx-6 md:mx-8">
              {formatDate(memory.created_at)}: {memory.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
