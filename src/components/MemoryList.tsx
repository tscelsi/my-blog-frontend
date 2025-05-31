import { useActiveMemory } from "../hooks/useActiveMemory";
import { useListMemories } from "../memory_service";
import { formatDate } from "../utils/date_stuff";

export const MemoryList = () => {
  const query = useListMemories();
  const { setActiveMemory } = useActiveMemory();

  return (
    <div className="flex flex-col">
      {query.isLoading && (
        <div className="border-y">
          <p className="opacity-40 mx-6 md:mx-8">{"<blank>"}</p>
        </div>
      )}
      {query.isSuccess &&
        query.data.map((memory) => (
          <div
            key={memory.id}
            className="hover:opacity-80 cursor-pointer border-b first:border-t"
            onClick={() => setActiveMemory(memory)}
          >
            <p className="mx-6 md:mx-8">
              {formatDate(memory.created_at)}: {memory.title}
            </p>
          </div>
        ))}
    </div>
  );
};
