import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogToolbar } from "./Toolbar";
import { MediaType } from "../../types";
import { JSX, useCallback, useRef, useState } from "react";
import Quill from "quill";
import {
  useAddFileFragmentToMemory,
  useAddRichTextFragmentToMemory,
  useCreateMemoryFromFile,
  useCreateMemoryFromRichText,
} from "../../memory_service";
import { RichTextEditor } from "../RichTextEditor";
import { useAuth } from "../../hooks/useAuth";

type DialogProps = {
  type: MediaType;
  memory_id: string | null;
  button: JSX.Element;
};

const InputDialog = ({ type, memory_id, button }: DialogProps) => {
  const richTextRef = useRef<Quill>(null);
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);

  const { session } = useAuth();
  const addFileToMemory = useAddFileFragmentToMemory();
  const addRichTextToMemory = useAddRichTextFragmentToMemory();
  const createMemoryFromFile = useCreateMemoryFromFile();
  const createMemoryFromRichText = useCreateMemoryFromRichText();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleTextSubmit = useCallback(() => {
    if (!richTextRef.current) {
      console.error("Rich text editor not initialized");
      return;
    }
    if (!session) {
      console.error("No session");
      return;
    }
    const ops = richTextRef.current?.getContents().ops;
    if (memory_id) {
      // adding to a memory
      addRichTextToMemory
        .mutateAsync({
          data: {
            memory_id,
            content: ops || [],
          },
          session,
        })
        .then(() => {
          setIsOpen(false);
        });
    } else {
      // creating new memory
      createMemoryFromRichText
        .mutateAsync({
          data: {
            memory_title: "blank_",
            content: ops || [],
          },
          session,
        })
        .then(() => {
          setIsOpen(false);
        });
    }
  }, [session, memory_id]);

  const handleFileSubmit = useCallback(
    (file: FormDataEntryValue) => {
      if (!file || !(file instanceof File)) {
        console.error("No file selected or invalid file type");
        return;
      }
      if (!session) {
        console.error("No session");
        return;
      }
      const toSendData = new FormData();
      if (memory_id) {
        // adding to a memory
        toSendData.append("file", file as Blob);
        toSendData.append("memory_id", memory_id);
        toSendData.append("type", type);
        addFileToMemory.mutateAsync({ data: toSendData, session }).then(() => {
          setIsOpen(false);
        });
      } else {
        // creating new memory
        toSendData.append("file", file as Blob);
        toSendData.append("memory_title", "blank_");
        toSendData.append("type", type);
        createMemoryFromFile
          .mutateAsync({ data: toSendData, session })
          .then(() => {
            setIsOpen(false);
          });
      }
    },
    [session, memory_id, type]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("memory-form-file");
    if (type === "rich_text") {
      handleTextSubmit();
    } else if (file) {
      handleFileSubmit(file);
    }
  };

  const handleRichTextRef = useCallback((node: Quill | null) => {
    richTextRef.current = node;
    setQuillInstance(node);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{button}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-100 bg-bg fixed inset-0 opacity-80" />
        <Dialog.Content className="z-100 fixed top-1/2 left-1/2 w-1/2 p-6 rounded-md shadow-lg translate-x-[-50%] translate-y-[-50%]">
          <VisuallyHidden>
            <Dialog.Title>Create a memory with a {type}.</Dialog.Title>
          </VisuallyHidden>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <DialogToolbar type={type} quill={quillInstance} />
              {type === "rich_text" ? (
                <div className="border p-2 bg-bg rounded-lg w-4xl h-[240px] max-h-[240px] overflow-y-auto">
                  <RichTextEditor
                    ref={handleRichTextRef}
                    readOnly={false}
                    defaultOps={null}
                  />
                </div>
              ) : (
                <input
                  type="file"
                  name="memory-form-file"
                  className="border border-text bg-bg rounded-lg p-2 hover:cursor-pointer"
                />
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InputDialog;
