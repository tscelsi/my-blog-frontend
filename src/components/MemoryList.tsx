import { Link } from "@tanstack/react-router";
import { formatDate } from "../utils/date_stuff";
import { ListMemoryItem } from "../types";
import { useAuth } from "../hooks/useAuth";
import { PinMemoryArgs, SetMemoryPrivacyArgs } from "../memory_service";
import { useMutationState } from "@tanstack/react-query";

type MemoryListProps = {
  memories: ListMemoryItem[];
};

export const MemoryList = ({ memories }: MemoryListProps) => {
  return (
    <div className="flex flex-col">
      {memories.map((memory) => (
        <MemoryListItem key={memory.id} memory={memory} />
      ))}
    </div>
  );
};

const MemoryListItem = ({ memory }: { memory: ListMemoryItem }) => {
  const { session } = useAuth();
  const isPrivateVariables = useMutationState<SetMemoryPrivacyArgs>({
    filters: {
      mutationKey: ["setMemoryPrivacy", memory.id],
      status: "pending",
    },
    select: (mutation) => mutation.state.variables as SetMemoryPrivacyArgs,
  });

  const isPinnedVariables = useMutationState<PinMemoryArgs>({
    filters: {
      mutationKey: ["pinMemory", memory.id],
      status: "pending",
    },
    select: (mutation) => mutation.state.variables as PinMemoryArgs,
  });

  const latestPrivateVariables =
    isPrivateVariables[isPrivateVariables.length - 1];
  const latestPinnedVariables = isPinnedVariables[isPinnedVariables.length - 1];
  const isPrivate = latestPrivateVariables?.private_ ?? memory.private;
  const isPinned = latestPinnedVariables?.pin ?? memory.pinned;
  let titleText;
  if (session) {
    // logged in
    titleText = `${session && isPinned ? "[pinned] " : ""} ${
      session && isPrivate ? "[private] " : "[public] "
    } ${formatDate(memory.created_at)}: ${memory.title}`;
  } else {
    titleText = `${formatDate(memory.created_at)}: ${memory.title}`;
  }

  return (
    <Link
      className="hover:opacity-80 cursor-pointer border-b border-dark-grey"
      to="/$memoryId"
      params={{ memoryId: memory.id }}
    >
      <div className="mx-6 md:mx-8">{titleText}</div>
    </Link>
  );
};
