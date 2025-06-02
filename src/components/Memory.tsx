import { useEffect, useState } from "react";
import { type Memory as MemoryType } from "../types";
import { Reorder } from "motion/react";
import { Del } from "../actions";
import { useDeleteMemoryOrFragment, useUpdateMemory } from "../memory_service";
import { Toolbar } from "./Toolbar/MainToolbar";
import { Audio, Text, Image, File, RichText } from "./Fragment";
import { Input } from "./inputs";
import { formatDate } from "../utils/date_stuff";
import { useAuth } from "../hooks/useAuth";
import { useActiveMemory } from "../hooks/useActiveMemory";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ArrowEnterLeft20Filled } from "@fluentui/react-icons";
import { Link } from "@tanstack/react-router";

export const Memory = ({ memory }: { memory: MemoryType }) => {
  const { setActiveMemory } = useActiveMemory();
  const [isEditing, setIsEditing] = useState(false);
  const [fragments, setFragments] = useState(memory.fragments);
  const [updatedMemoryTitle, setUpdatedMemoryTitle] = useState(memory.title);
  const deleteMutation = useDeleteMemoryOrFragment();
  const updateOrderingMutation = useUpdateMemory();
  const isSmallScreen = useIsSmallScreen();
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
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 z-2 w-4/5">
        <div className="flex flex-col gap-2 mb-4">
          {isSmallScreen && (
            <Link to="/" className="w-fit">
              <ArrowEnterLeft20Filled />
            </Link>
          )}
          <div className="flex justify-between gap-2">
            <div className="flex gap-2 items-center">
              {!isEditing ? (
                <h3 className="text-2xl font-bold text-ellipsis overflow-hidden text-nowrap">
                  {updatedMemoryTitle}
                </h3>
              ) : (
                <Input
                  defaultValue={memory.title}
                  onChange={(e) => {
                    setUpdatedMemoryTitle(e.target.value);
                  }}
                />
              )}
            </div>
            <div className="flex gap-4 ">
              {session && (
                <p onClick={toggleEdit} className="cursor-pointer">
                  {isEditing ? "done" : "edit"}
                </p>
              )}
              <div>
                {isEditing && session && (
                  <Del
                    onClick={async () => {
                      await deleteMutation
                        .mutateAsync({
                          memory_id: memory.id,
                          session: session,
                        })
                        .then(() => {
                          setActiveMemory(undefined);
                        });
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <h6 className="font-bold">{formatDate(memory.created_at)}</h6>
        </div>
        <>
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
        </>
        {isEditing && (
          <div className="flex justify-center items-center">
            <Toolbar memory={memory} />
          </div>
        )}
      </div>
    </div>
  );
};
