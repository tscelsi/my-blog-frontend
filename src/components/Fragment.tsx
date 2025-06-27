import {
  useDeleteMemoryOrFragment,
  useModifyRichTextFragment,
} from "../memory_service";
import type {
  FileFragment,
  Memory as MemoryType,
  RichTextFragment,
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
  }/storage/v1/object/public/memories.develop/${memory.user_id}/${
    fragment.name
  }?download=${fragment.name}`;
  const deleteMutation = useDeleteMemoryOrFragment();
  const isUploading = fragment.status === "uploading";
  const { session } = useAuth();
  return (
    <div className="flex gap-4" data-fragment-id={fragment.id}>
      <p>{fragment.name}</p>
      {!isEditing && !isUploading && <Download url={fileUrl} />}
      {isEditing && !isUploading && session && (
        <Del
          onClick={async () => {
            await deleteMutation.mutateAsync({
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
  }/storage/v1/object/public/memories.develop/${memory.user_id}/${
    fragment.name
  }`;
  const deleteMutation = useDeleteMemoryOrFragment();
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
            await deleteMutation.mutateAsync({
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
  const fileStem = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/memories.develop/${memory.user_id}/${
    fragment.name
  }`;
  const imageUrl = `${fileStem}?quality=30&width=100&height=10`;
  const downloadUrl = `${fileStem}?download=${fragment.name}`;
  const deleteMutation = useDeleteMemoryOrFragment();
  const { session } = useAuth();
  return (
    <div
      className="flex flex-col gap-3 max-w-xl"
      data-fragment-id={fragment.id}
    >
      <img
        className="object-contain rounded-sm"
        src={imageUrl}
        alt={fragment.name}
      />
      <div className="flex gap-4">
        {!isEditing && <Download url={downloadUrl} />}
        {isEditing && session && (
          <Del
            onClick={async () => {
              await deleteMutation.mutateAsync({
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

  const deleteMutation = useDeleteMemoryOrFragment();
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
              deleteMutation.mutateAsync({
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
