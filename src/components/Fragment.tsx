import {
  useDeleteFragment,
  useModifyRichTextFragment,
} from "../queries/memory_service";
import type {
  FileFragment,
  Memory as MemoryType,
  RichTextFragment,
  RssFeedFragment,
} from "../types";
import { Play16Filled, Pause16Filled } from "@fluentui/react-icons";
import { Del, Download } from "../actions";
import { useAudio } from "../hooks/useAudio";
import { useAuth } from "../hooks/useAuth";
import { RichTextEditor } from "../components/RichTextEditor";
import { useEffect, useRef, useState } from "react";
import Quill, { Op } from "quill";
import isEqual from "lodash.isequal";
import debounce from "lodash.debounce";
import { RssChannel, useGetRssFeed } from "../queries/rss_service";
import { Loader } from "./Loader";
import { Rss20Regular } from "@fluentui/react-icons";
import { CreateModifyRssFeedDialog } from "./dialogs";
import { Button } from "./Button";

type FragmentBaseProps = {
  memory: MemoryType;
  isEditing: boolean;
};

type FileFragmentProps = {
  fragment: FileFragment;
} & FragmentBaseProps;

type RichTextFragmentProps = {
  fragment: RichTextFragment;
} & FragmentBaseProps;

export const getFileFragment = (fragment: FileFragment) => {
  if (fragment.type === "file") {
    return File;
  } else if (fragment.type === "audio") {
    return Audio;
  } else if (fragment.type === "image") {
    return Image;
  } else {
    throw new Error(`Unknown fragment type: ${fragment.type}`);
  }
};

export const File = ({ fragment, memory, isEditing }: FileFragmentProps) => {
  const fileUrl = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/memories.develop/${memory.owner}/${
    fragment.name
  }?download=${fragment.name}`;
  const deleteFragmentMutation = useDeleteFragment();
  const isUploading = fragment.status === "uploading";
  const { session } = useAuth();
  return (
    <div className="flex gap-4" data-fragment-id={fragment.id}>
      <p>{fragment.name}</p>
      {!isEditing && !isUploading && <Download url={fileUrl} />}
      {isEditing && !isUploading && session && (
        <Del
          onClick={async () => {
            await deleteFragmentMutation.mutateAsync({
              memory_id: memory.id,
              fragment_ids: [fragment.id],
            });
          }}
        />
      )}
    </div>
  );
};

export const Audio = ({ memory, fragment, isEditing }: FileFragmentProps) => {
  const fileUrl = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/memories.develop/${memory.owner}/${fragment.name}`;
  const deleteFragmentMutation = useDeleteFragment();
  const { session } = useAuth();
  const isError = fragment.status === "error";
  const { play, pause, isPlaying, currentSrc } = useAudio();
  const isThisPlaying = isPlaying && currentSrc === fileUrl;

  const handlePlayPause = () => {
    if (isThisPlaying) {
      pause();
    } else {
      play(fileUrl, fragment.name);
    }
  };

  // Sync play/pause state with audio element

  return (
    <div className="flex items-center gap-3" data-fragment-id={fragment.id}>
      <button
        type="button"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        className="p-2"
      >
        {isThisPlaying ? (
          // Pause SVG
          <Pause16Filled className="cursor-pointer hover:opacity-80" />
        ) : (
          // Play SVG
          <Play16Filled className="cursor-pointer hover:opacity-80" />
        )}
      </button>
      <span>{fragment.name}</span>
      {!isEditing && !isError && (
        <Download url={`${fileUrl}?download=${fragment.name}`} />
      )}
      {isEditing && session && (
        <Del
          onClick={async () => {
            await deleteFragmentMutation.mutateAsync({
              memory_id: memory.id,
              fragment_ids: [fragment.id],
            });
          }}
        />
      )}
    </div>
  );
};

export const Image = ({ memory, fragment, isEditing }: FileFragmentProps) => {
  const deleteFragmentMutation = useDeleteFragment();
  const { session } = useAuth();

  return (
    <div
      className="flex flex-col gap-3 max-w-xl"
      data-fragment-id={fragment.id}
    >
      <img
        className="object-contain rounded-sm"
        src={fragment.url}
        alt={fragment.name}
      />
      <div className="flex gap-4">
        {/* {!isEditing && <Download url={fileUrl} />} */}
        {isEditing && session && (
          <Del
            onClick={async () => {
              await deleteFragmentMutation.mutateAsync({
                memory_id: memory.id,
                fragment_ids: [fragment.id],
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export const RichText = ({
  fragment,
  memory,
  isEditing,
}: RichTextFragmentProps) => {
  const quillRef = useRef<Quill>(null);
  const [defaultContent] = useState<Op[]>(fragment.content || []);

  const deleteFragmentMutation = useDeleteFragment();
  const modifyRichTextFragment = useModifyRichTextFragment();

  // Store the latest fragment and memory in refs so the debounced function always has the latest values
  const fragmentRef = useRef(fragment);
  const memoryRef = useRef(memory);

  useEffect(() => {
    fragmentRef.current = fragment;
    memoryRef.current = memory;
  }, [fragment, memory]);

  const debouncedMutateRef = useRef(
    debounce(() => {
      const quill = quillRef.current;
      const currentFragment = fragmentRef.current;
      const currentMemory = memoryRef.current;
      if (!quill || !currentFragment || !currentMemory) return;
      if (isEqual(quill.getContents().ops, currentFragment.content)) {
        return;
      }
      modifyRichTextFragment.mutateAsync({
        data: {
          content: quill.getContents().ops || [],
          memory_id: currentMemory.id,
          fragment_id: currentFragment.id,
        },
      });
    }, 700)
  );

  const handleTextChange = () => {
    debouncedMutateRef.current();
  };

  return (
    <div className="flex flex-col gap-3" data-fragment-id={fragment.id}>
      <RichTextEditor
        ref={quillRef}
        readOnly={!isEditing}
        defaultOps={defaultContent}
        onTextChange={handleTextChange}
      ></RichTextEditor>
      {isEditing && (
        <div className="flex items-center gap-4">
          <Del
            onClick={() => {
              deleteFragmentMutation.mutateAsync({
                memory_id: memory.id,
                fragment_ids: [fragment.id],
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

type RssFeedFragmentProps = {
  fragment: RssFeedFragment;
} & FragmentBaseProps;

export const RssFeed = ({
  fragment,
  memory,
  isEditing,
}: RssFeedFragmentProps) => {
  const deleteFragmentMutation = useDeleteFragment();
  const { data, isLoading, isError } = useGetRssFeed(memory.id, fragment.id);
  if (isLoading) {
    return (
      <div className="flex justify-start w-fit">
        <Loader />
      </div>
    );
  }
  let content;
  if (!isLoading && isError) {
    content = (
      <div className="flex justify-start w-fit">
        <p>Error loading RSS feed</p>
      </div>
    );
  } else {
    content = (
      <div
        className="flex border px-2 py-1 rounded-sm border-dark-grey"
        data-fragment-id={fragment.id}
      >
        <div className="flex-1">
          {data?.map((item, index) => (
            <RssFeedItem item={item} key={`${fragment.id}-item-${index}`} />
          ))}
        </div>
        <Rss20Regular className="opacity-20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {content}
      <div className="flex items-center gap-3">
        {isEditing && (
          <>
            <CreateModifyRssFeedDialog
              memory_id={memory.id}
              fragment_id={fragment.id}
              defaultUrls={fragment.urls}
              button={<Button>[edit]</Button>}
            />
            <Del
              onClick={() => {
                deleteFragmentMutation.mutateAsync({
                  memory_id: memory.id,
                  fragment_ids: [fragment.id],
                });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

const RssFeedItem = ({ item }: { item: RssChannel["items"][number] }) => {
  return (
    <div className="flex flex-col mb-2 last:mb-0">
      <a
        className="text-link hover:underline"
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        [{item.source}] {item.title}
      </a>
      {/* <p>{item.description}</p> */}
      <p className="text-sm text-dark-grey">
        Published: {new Date(item.pub_date).toLocaleString()}
      </p>
    </div>
  );
};
