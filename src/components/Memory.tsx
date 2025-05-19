import { useEffect, useState } from "react";
import { type Memory as MemoryType } from "../types";
import { motion, Reorder } from "motion/react";
import { Del } from "../actions";
import { useDeleteMemoryOrFragment, useUpdateMemory } from "../memory_service";
import { Toolbar } from "./Toolbar";
import { Audio, Text, Image, File } from "./Fragment";
import { Input } from "./inputs";
import { formatDate } from "../utils/date_stuff";
import { useAuth } from "../hooks/useAuth";

export const Memory = ({
  memory,
  containerRef,
  position,
}: {
  memory: MemoryType;
  containerRef: React.RefObject<HTMLDivElement | null>;
  position: { top: number; left: number };
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fragments, setFragments] = useState(memory.fragments);
  const [updatedMemoryTitle, setUpdatedMemoryTitle] = useState(memory.title);
  const deleteMutation = useDeleteMemoryOrFragment();
  const updateOrderingMutation = useUpdateMemory();
  const { session } = useAuth();

  useEffect(() => {
    setFragments(memory.fragments);
    setUpdatedMemoryTitle(memory.title);
  }, [memory]);

  const toggleOpen = () => {
    if (isOpen && isEditing) {
      setIsEditing(false);
    }
    setIsOpen(!isOpen);
  };

  const toggleEdit = () => {
    if (!isOpen && !isEditing) {
      setIsOpen(true);
    }
    if (isEditing && session) {
      if (
        memory.fragments.map((f) => f.id).join(",") !==
          fragments.map((f) => f.id).join(",") ||
        memory.title !== updatedMemoryTitle
      ) {
        // about to close - update fragment ordering
        updateOrderingMutation.mutateAsync({
          data: {
            memory_id: memory.id,
            memory_title: updatedMemoryTitle,
            fragment_ids: fragments.map((fragment) => fragment.id),
          },
          session: session,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      drag={!isEditing}
      dragMomentum={false}
      dragConstraints={containerRef}
      className="absolute border p-4 min-w-xs w-max rounded-md flex flex-col gap-4 max-w-md z-2 max-h-[80vh] overflow-y-auto hover:cursor-grab active:cursor-grabbing"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          {!isEditing ? (
            <h3 className="font-bold text-ellipsis overflow-hidden text-nowrap bg-[url('/sunrise.png')] bg-clip-text text-transparent bg-[center_left_60%]">
              {memory.title}
            </h3>
          ) : (
            <Input
              defaultValue={memory.title}
              onChange={(e) => {
                setUpdatedMemoryTitle(e.target.value);
              }}
            />
          )}
          <div className="flex gap-4 ">
            {session && (
              <p onClick={toggleEdit} className="cursor-pointer">
                {isEditing ? "done" : "edit"}
              </p>
            )}
            <div>
              {isOpen && isEditing && session ? (
                <Del
                  onClick={async () => {
                    await deleteMutation.mutateAsync({
                      memory_id: memory.id,
                      session: session,
                    });
                  }}
                />
              ) : isOpen ? (
                <p className="cursor-pointer" onClick={toggleOpen}>
                  close
                </p>
              ) : (
                <p className="cursor-pointer" onClick={toggleOpen}>
                  open
                </p>
              )}
            </div>
          </div>
        </div>
        <p>{formatDate(memory.created_at)}</p>
      </div>
      {isOpen && (
        <Reorder.Group
          className="flex flex-col gap-4"
          axis="y"
          values={fragments}
          onReorder={setFragments}
        >
          {fragments.map((item) => (
            <Reorder.Item key={item.id} value={item} drag={isEditing}>
              {item.type === "text" ? (
                <Text
                  key={item.id}
                  memory={memory}
                  fragment={item}
                  isEditing={isEditing}
                />
              ) : item.type === "audio" ? (
                <Audio
                  key={item.id}
                  memory={memory}
                  fragment={item}
                  isEditing={isEditing}
                />
              ) : item.type === "image" ? (
                <Image
                  key={item.id}
                  memory={memory}
                  fragment={item}
                  isEditing={isEditing}
                />
              ) : item.type === "file" ? (
                <File
                  key={item.id}
                  memory={memory}
                  fragment={item}
                  isEditing={isEditing}
                />
              ) : (
                <p>unknown frag.</p>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
      {isEditing && <Toolbar memory_id={memory.id} />}
    </motion.div>
  );
};
