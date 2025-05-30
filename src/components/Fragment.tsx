import {
  useDeleteMemoryOrFragment,
  useModifyRichTextFragment,
  useModifyTextFragment,
} from "../memory_service";
import type {
  FileFragment,
  Memory as MemoryType,
  RichTextFragment,
  TextFragment,
} from "../types";
import { Play16Filled, Pause16Filled } from "@fluentui/react-icons";
import { Del, Download } from "../actions";
import { TextArea } from "./inputs";
import { useAudio } from "../hooks/useAudio";
import { useAuth } from "../hooks/useAuth";
import { RichTextEditor } from "../components/RichTextEditor";
import { useRef } from "react";
import Quill, { Op } from "quill";
import { debounce } from "../utils/debounce";

type FragmentBaseProps = {
  memory: MemoryType;
  isEditing: boolean;
};

type FileFragmentProps = {
  fragment: FileFragment;
} & FragmentBaseProps;

type TextFragmentProps = {
  fragment: TextFragment;
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
    <div className="flex gap-4">
      <p>{fragment.name}</p>
      {!isEditing && !isUploading && <Download url={fileUrl} />}
      {isEditing && !isUploading && session && (
        <Del
          onClick={async () => {
            await deleteMutation.mutateAsync({
              memory_id: memory.id,
              fragment_ids: [fragment.id],
              session,
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
    <div className="flex items-center gap-3">
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
              session,
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
    <div className="flex flex-col gap-3">
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
                session,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export const Text = ({ fragment, isEditing, memory }: TextFragmentProps) => {
  const modifyMutation = useModifyTextFragment();
  const deleteMutation = useDeleteMemoryOrFragment();
  const { session } = useAuth();
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (!session) {
      console.error("No session");
      return;
    }
    if (newValue === fragment.content) {
      return;
    } else {
      modifyMutation.mutateAsync({
        data: {
          memory_id: memory.id,
          fragment_id: fragment.id,
          text: newValue,
        },
        session,
      });
    }
  };
  return (
    <div className="w-full">
      {fragment.href ? (
        <a href={fragment.href} target="_blank" rel="noopener noreferrer">
          {fragment.content}
        </a>
      ) : !isEditing ? (
        <p>{fragment.content}</p>
      ) : (
        <div>
          <TextArea onBlur={handleBlur} defaultValue={fragment.content} />
          {session && (
            <Del
              onClick={() => {
                deleteMutation.mutateAsync({
                  memory_id: memory.id,
                  fragment_ids: [fragment.id],
                  session,
                });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const RichText = ({
  fragment,
  memory,
  isEditing,
}: RichTextFragmentProps) => {
  const modifyMutation = useModifyRichTextFragment();
  const deleteMutation = useDeleteMemoryOrFragment();
  const { session } = useAuth();

  const onTextChange = (ops: Op[]) => {
    if (session) {
      modifyMutation.mutateAsync({
        data: {
          content: ops,
          memory_id: memory.id,
          fragment_id: fragment.id,
        },
        session,
      });
    }
  };
  const debouncedOnTextChange = debounce(onTextChange, 2000);
  const ref = useRef<Quill>(null);

  return (
    <div>
      <div className="">
        <RichTextEditor
          ref={ref}
          readOnly={!isEditing}
          defaultOps={fragment.content}
          onTextChange={() => {
            if (ref?.current) {
              debouncedOnTextChange(ref.current.getContents().ops);
            }
          }}
        ></RichTextEditor>
      </div>
      {session && isEditing && (
        <Del
          onClick={() => {
            deleteMutation.mutateAsync({
              memory_id: memory.id,
              fragment_ids: [fragment.id],
              session,
            });
          }}
        />
      )}
    </div>
  );
};
