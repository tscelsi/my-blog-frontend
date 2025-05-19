import {
  TextT20Filled,
  Image20Filled,
  MusicNote220Filled,
  Document20Filled,
  Checkmark20Filled,
  Dismiss20Filled,
} from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";
import { FileType } from "../types";
import {
  useAddFileFragmentToMemory,
  useAddTextFragmentToMemory,
  useCreateMemoryFromFile,
  useCreateMemoryFromText,
} from "../memory_service";

import { useAuth } from "../hooks/useAuth";

type CurrentlySelectedType = "text" | FileType;

export const Toolbar = ({ memory_id }: { memory_id?: string }) => {
  const [currentlySelected, setCurrentlySelected] =
    useState<CurrentlySelectedType | null>(null);
  const { session } = useAuth();
  const addFile = useAddFileFragmentToMemory();
  const addText = useAddTextFragmentToMemory();
  const createMemoryFromFile = useCreateMemoryFromFile();
  const createMemoryFromText = useCreateMemoryFromText();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) {
      console.error("No session");
      return;
    }
    const formData = new FormData(event.currentTarget);
    if (!currentlySelected) {
      console.error("No type selected");
      return;
    }
    if (currentlySelected === "text") {
      const text = formData.get("memory-form-text");
      if (text) {
        if (memory_id) {
          await addText.mutateAsync({
            data: {
              memory_id,
              text: text as string,
            },
            session,
          });
        } else {
          await createMemoryFromText.mutateAsync({
            data: {
              memory_title: "blank_",
              text: text as string,
            },
            session,
          });
        }
      }
    } else {
      const file = formData.get("memory-form-file");
      if (file) {
        const toSendData = new FormData();
        if (memory_id) {
          // updating
          console.log("updating...");
          toSendData.append("file", file as Blob);
          toSendData.append("memory_id", memory_id);
          toSendData.append("type", currentlySelected);
          await addFile.mutateAsync({ data: toSendData, session });
        } else {
          // creating new
          toSendData.append("file", file as Blob);
          toSendData.append("memory_title", "blank_");
          toSendData.append("type", currentlySelected);
          await createMemoryFromFile.mutateAsync({ data: toSendData, session });
        }
      }
    }
    setCurrentlySelected(null);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center items-center gap-2 w-full">
        <button>
          <Dismiss20Filled
            onClick={() => setCurrentlySelected(null)}
            className="cursor-pointer hover:opacity-80"
          />
        </button>
        <ToolbarText
          active={currentlySelected === "text"}
          setCurrentlySelected={setCurrentlySelected}
        />
        <ToolbarImage
          active={currentlySelected === "image"}
          setCurrentlySelected={setCurrentlySelected}
        />
        <ToolbarAudio
          active={currentlySelected === "audio"}
          setCurrentlySelected={setCurrentlySelected}
        />
        <ToolbarFile
          active={currentlySelected === "file"}
          setCurrentlySelected={setCurrentlySelected}
          type="file"
        />
        <button type="submit">
          <Checkmark20Filled className="cursor-pointer hover:opacity-80" />
        </button>
      </div>
    </form>
  );
};

const ToolbarText = ({
  active,
  setCurrentlySelected,
}: {
  active: boolean;
  setCurrentlySelected: (val: CurrentlySelectedType) => void;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus();
    }
  }, [active]);

  if (active) {
    return (
      <textarea
        ref={ref}
        name="memory-form-text"
        className="border border-text flex-1"
        placeholder="Enter text"
      />
    );
  } else {
    return (
      <TextT20Filled
        onClick={() => setCurrentlySelected("text")}
        className="cursor-pointer hover:opacity-80"
      />
    );
  }
};

const ToolbarFile = ({
  active,
  setCurrentlySelected,
  type,
}: {
  active: boolean;
  setCurrentlySelected: (val: CurrentlySelectedType) => void;
  type: FileType;
}) => {
  const Component =
    type === "audio"
      ? MusicNote220Filled
      : type === "image"
      ? Image20Filled
      : Document20Filled;
  if (active) {
    return (
      <input
        type="file"
        name="memory-form-file"
        className="border border-text  flex-1"
      />
    );
  } else {
    return (
      <Component
        onClick={() => setCurrentlySelected(type)}
        className="cursor-pointer hover:opacity-80"
      />
    );
  }
};

const ToolbarImage = (props: {
  active: boolean;
  setCurrentlySelected: (val: CurrentlySelectedType) => void;
}) => {
  return <ToolbarFile {...props} type="image" />;
};

const ToolbarAudio = (props: {
  active: boolean;
  setCurrentlySelected: (val: CurrentlySelectedType) => void;
}) => {
  return <ToolbarFile {...props} type="audio" />;
};
