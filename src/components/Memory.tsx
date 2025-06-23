import { useEffect, useState } from "react";
import { type Memory as MemoryType } from "../types";
import { Reorder } from "motion/react";
import { useUpdateMemory } from "../memory_service";
import { Toolbar } from "./Toolbar/MainToolbar";
import { Audio, Text, Image, File, RichText } from "./Fragment";
import { useAuth } from "../hooks/useAuth";
import { MemoryToolbar } from "./Toolbar/MemoryToolbar";
import { MemoryTitle } from "./MemoryTitle";

export const Memory = ({ memory }: { memory: MemoryType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fragments, setFragments] = useState(memory.fragments);
  const [updatedMemoryTitle, setUpdatedMemoryTitle] = useState(memory.title);
  const updateOrderingMutation = useUpdateMemory(memory.id);
  const { session } = useAuth();

  useEffect(() => {
    setFragments(memory.fragments);
    setUpdatedMemoryTitle(memory.title);
  }, [memory]);

  const toggleEdit = () => {
    if (isEditing && session) {
      if (
        memory.fragments.map((f) => f.id).join(",") !==
          fragments.map((f) => f.id).join(",") ||
        memory.title !== updatedMemoryTitle
      ) {
        // about to close - update fragment ordering
        updateOrderingMutation.mutateAsync({
          memory_id: memory.id,
          data: {
            memory_title: updatedMemoryTitle,
            fragment_ids: fragments.map((fragment) => fragment.id),
          },
        });
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col z-2 w-full">
        <div className="flex flex-col mb-4">
          <MemoryToolbar
            memory={memory}
            isEditing={isEditing}
            toggleEdit={toggleEdit}
          />
          <MemoryTitle
            originalMemoryTitle={memory.title}
            updatedMemoryTitle={updatedMemoryTitle}
            setUpdatedMemoryTitle={setUpdatedMemoryTitle}
            updatedAt={memory.updated_at}
            isEditing={isEditing}
          />
        </div>
        <div className="px-6">
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
                ) : item.type === "rich_text" ? (
                  <RichText
                    key={item.id}
                    fragment={item}
                    memory={memory}
                    isEditing={isEditing}
                  />
                ) : (
                  <p>unknown frag.</p>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
        {isEditing && (
          <div className="flex justify-center items-center">
            <Toolbar memory={memory} />
          </div>
        )}
      </div>
    </div>
  );
};
