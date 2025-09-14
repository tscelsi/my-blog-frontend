import { Link } from "@tanstack/react-router";
import { formatDate } from "../utils/date_stuff";
import { ListMemoryItem } from "../types";
import { useAuth } from "../hooks/useAuth";
import { PinMemoryArgs, SetMemoryPrivacyArgs } from "../queries/memory_service";
import { useMutationState } from "@tanstack/react-query";
import { useMemo } from "react";
import { Loader } from "./Loader";

type MemoryListProps = {
  memories: ListMemoryItem[];
};

export const MemoryList = ({ memories }: MemoryListProps) => {
  const m = useMutationState({
    filters: { mutationKey: ["createEmptyMemory"] },
    select: (mutation) => mutation.state.status,
  });
  const latestIsPending = m[m.length - 1] === "pending";
  return (
    <div className="flex flex-col">
      {memories.map((memory) => (
        <MemoryListItem key={memory.id} memory={memory} />
      ))}
      {latestIsPending && (
        <div className="border-b border-dark-grey px-6 md:px-8 h-[20px]">
          <div className="w-fit">
            <Loader />
          </div>
        </div>
      )}
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
  const titleText = useMemo(() => {
    let titleText;
    if (session) {
      // logged in
      titleText = `${session && isPinned ? "[pinned] " : ""} ${
        session && isPrivate ? "[private] " : "[public] "
      } ${formatDate(memory.created_at)}: ${memory.title}`;
    } else {
      titleText = `${formatDate(memory.created_at)}: ${memory.title}`;
    }
    return titleText;
  }, [session, isPinned, isPrivate, memory.created_at, memory.title]);

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
