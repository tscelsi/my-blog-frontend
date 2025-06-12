import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { formatDate } from "../utils/date_stuff";
import { ListMemoryItem } from "../types";
import { useAuth } from "../hooks/useAuth";

type MemoryListProps = {
  memories: ListMemoryItem[];
};

export const MemoryList = ({ memories }: MemoryListProps) => {
  const { session } = useAuth();
  return (
    <div className="flex flex-col">
      {memories.map((memory) => (
        <Link
          className={clsx(
            "hover:opacity-80 cursor-pointer border-b border-dark-grey first:border-t"
          )}
          key={memory.id}
          to="/$memoryId"
          params={{ memoryId: memory.id }}
        >
          <div>
            <p className="mx-6 md:mx-8">
              {session && memory.pinned && "[pinned] "}
              {session && (memory.private ? "[private] " : "[public] ")}
              {formatDate(memory.created_at)}: {memory.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
