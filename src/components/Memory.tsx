import { useEffect, useState } from "react";
import { Reorder } from "motion/react";
import {
  getMemoryQueryOptions,
  useSetFragmentOrder,
  useSetMemoryTitle,
} from "../memory_service";
import { Audio, Image, File, RichText } from "./Fragment";
import { MemoryToolbar } from "./Toolbar/MemoryToolbar";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { Input } from "./inputs";
import { formatDate } from "../utils/date_stuff";
import debounce from "lodash.debounce";
import { Fragment } from "../types";

export const Memory = ({ memoryId }: { memoryId: string }) => {
  const { data: memory } = useSuspenseQuery(getMemoryQueryOptions(memoryId));
  const [isEditing, setIsEditing] = useState(false);
  const [orderedFragments, setOrderedFragments] = useState(memory.fragments);
  const updateOrderingMutation = useSetFragmentOrder(memory.id);
  const setMemoryTitleMutation = useSetMemoryTitle(memory.id);

  useEffect(() => {
    setOrderedFragments(memory.fragments);
  }, [memory]);

  const handleTitleUpdate = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (memory.title === e.target.value) return;
      setMemoryTitleMutation.mutateAsync({
        memory_id: memory.id,
        data: {
          memory_title: e.target.value,
        },
      });
    },
    []
  );

  const handleFragmentReorder = React.useCallback((fragments: Fragment[]) => {
    const newOrder = fragments.map((fragment) => fragment.id);
    setOrderedFragments(fragments);
    updateOrderingMutation.mutateAsync({
      memory_id: memory.id,
      data: {
        fragment_ids: newOrder,
      },
    });
  }, []);

  const toggleEdit = React.useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col z-2 w-full">
        <div className="flex flex-col mb-4">
          <MemoryToolbar
            memory={memory}
            isEditing={isEditing}
            toggleEdit={toggleEdit}
          />
          <div className="border-b border-dark-grey py-2 px-6">
            <div>
              {!isEditing ? (
                <h3 className="text-2xl font-bold">{memory.title}</h3>
              ) : (
                <Input
                  defaultValue={memory.title}
                  onChange={debounce(handleTitleUpdate, 700)}
                />
              )}
            </div>
            <h6>last updated: {formatDate(memory.updated_at, true)}</h6>
          </div>
        </div>
        <div className="px-6">
          <Reorder.Group
            className="flex flex-col gap-4"
            axis="y"
            values={orderedFragments}
            onReorder={handleFragmentReorder}
          >
            {orderedFragments.map((item) => (
              <Reorder.Item key={item.id} value={item} drag={isEditing}>
                {item.type === "audio" ? (
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
      </div>
    </div>
  );
};
