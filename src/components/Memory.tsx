import { useCallback, useMemo } from "react";
import { useEffect, useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import {
  getMemoryQueryOptions,
  useSetFragmentOrder,
  useSetMemoryTitle,
} from "../memory_service";
import { Audio, Image, File, RichText, RssFeed } from "./Fragment";
import { MemoryToolbar } from "./Toolbar/MemoryToolbar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDate } from "../utils/date_stuff";
import debounce from "lodash.debounce";
import { Fragment, Memory as MemoryType } from "../types";
import { ReOrderDotsVertical16Filled } from "@fluentui/react-icons";
import clsx from "clsx";

const Item = ({
  memory,
  fragment,
  isEditing,
}: {
  memory: MemoryType;
  fragment: Fragment;
  isEditing: boolean;
}) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      key={fragment.id}
      value={fragment}
      dragListener={false}
      dragControls={controls}
    >
      <div className="flex gap-1">
        {isEditing && (
          <ReOrderDotsVertical16Filled
            className="cursor-grab hover:opacity-80"
            onPointerDown={(e) => controls.start(e)}
          />
        )}
        <div className="flex-1">
          {fragment.type === "audio" ? (
            <Audio
              key={fragment.id}
              memory={memory}
              fragment={fragment}
              isEditing={isEditing}
            />
          ) : fragment.type === "image" ? (
            <Image
              key={fragment.id}
              memory={memory}
              fragment={fragment}
              isEditing={isEditing}
            />
          ) : fragment.type === "file" ? (
            <File
              key={fragment.id}
              memory={memory}
              fragment={fragment}
              isEditing={isEditing}
            />
          ) : fragment.type === "rich_text" ? (
            <RichText
              key={fragment.id}
              fragment={fragment}
              memory={memory}
              isEditing={isEditing}
            />
          ) : fragment.type === "rss_feed" ? (
            <RssFeed
              key={fragment.id}
              fragment={fragment}
              memory={memory}
              isEditing={isEditing}
            />
          ) : (
            <p>unknown frag.</p>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
};

export const Memory = ({ memoryId }: { memoryId: string }) => {
  const options = useMemo(() => getMemoryQueryOptions(memoryId), [memoryId]);
  const { data: memory } = useSuspenseQuery(options);
  const [isEditing, setIsEditing] = useState(false);
  const [orderedFragments, setOrderedFragments] = useState(memory.fragments);
  const [title, setTitle] = useState(memory.title);
  const updateOrderingMutation = useSetFragmentOrder();
  const setMemoryTitleMutation = useSetMemoryTitle();

  useEffect(() => {
    setOrderedFragments(memory.fragments);
  }, [memory]);

  useEffect(() => {
    setTitle(memory.title);
  }, [memory.title]);

  const handleTitleUpdate = useCallback(
    (e: React.FormEvent<HTMLHeadingElement>) => {
      const target = e.target as HTMLElement;
      if (title === target.innerText) return;
      setTitle(target.innerText);
      setMemoryTitleMutation.mutateAsync({
        memory_id: memory.id,
        data: {
          memory_title: target.innerText,
        },
      });
    },
    [title, memory.id, setMemoryTitleMutation]
  );

  const handleFragmentReorder = useCallback(
    (fragments: Fragment[]) => {
      const newOrder = fragments.map((fragment) => fragment.id);
      setOrderedFragments(fragments);
      updateOrderingMutation.mutateAsync({
        memory_id: memory.id,
        data: {
          fragment_ids: newOrder,
        },
      });
    },
    [memory.id, updateOrderingMutation]
  );

  const toggleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full">
        <div className="flex flex-col mb-4">
          <MemoryToolbar
            memory={memory}
            isEditing={isEditing}
            toggleEdit={toggleEdit}
          />
          <div className="border-b border-dark-grey py-2 px-6">
            <div>
              <h3
                className={clsx(
                  "text-2xl font-bold",
                  isEditing && "border border-light-grey rounded-sm"
                )}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onInput={debounce(handleTitleUpdate, 500)}
              >
                {title}
              </h3>
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
              <Item
                memory={memory}
                fragment={item}
                isEditing={isEditing}
                key={item.id}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
};
