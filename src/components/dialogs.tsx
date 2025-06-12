import { VisuallyHidden, Dialog } from "radix-ui";
import { MediaType, RichTextFragment } from "../types";
import { JSX, useCallback, useState } from "react";
import Quill from "quill";
import {
  useAddFileFragmentToMemory,
  useAddRichTextFragmentToMemory,
  useCreateMemoryFromFile,
  useCreateMemoryFromRichText,
  useModifyRichTextFragment,
} from "../memory_service";
import { RichTextEditor, RichTextEditorToolbar } from "./RichTextEditor";
import { useAuth } from "../hooks/useAuth";
import { ToolbarLayout } from "./Toolbar/ToolbarLayout";
import {
  ArrowEnterLeft20Filled,
  Checkmark20Filled,
} from "@fluentui/react-icons";

type TextDialogProps = {
  memory_id: string | null;
  fragment?: RichTextFragment;
  button: JSX.Element;
};

type FileDialogProps = {
  type: MediaType;
  memory_id: string | null;
  button: JSX.Element;
};

export const TextDialog = ({
  memory_id,
  fragment,
  button,
}: TextDialogProps) => {
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);

  const { session } = useAuth();
  const addRichTextToMemory = useAddRichTextFragmentToMemory();
  const modifyRichTextFragment = useModifyRichTextFragment();
  const createMemoryFromRichText = useCreateMemoryFromRichText();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!quillInstance) {
        console.error("Rich text editor not initialized");
        return;
      }
      if (!session) {
        console.error("No session");
        return;
      }
      const ops = quillInstance.getContents().ops;
      if (memory_id && fragment) {
        // modifying an existing fragment
        console.log("Modifying existing fragment", fragment.id);
        modifyRichTextFragment.mutate({
          data: {
            content: ops || [],
            memory_id,
            fragment_id: fragment.id,
          },
        });
        setIsOpen(false);
      } else if (memory_id) {
        // adding to a memory
        addRichTextToMemory
          .mutateAsync({
            data: {
              memory_id,
              content: ops || [],
            },
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
          })
          .then(() => {
            setIsOpen(false);
          });
      }
    },
    [quillInstance, session, memory_id, fragment]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{button}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-100 bg-bg fixed inset-0 opacity-90" />
        <Dialog.Content className="z-100 fixed top-1/2 left-1/2 w-[90vw] md:w-4/5 rounded-md shadow-lg translate-x-[-50%] translate-y-[-50%]">
          <VisuallyHidden.Root>
            <Dialog.Title>Modify a memory with rich text.</Dialog.Title>
          </VisuallyHidden.Root>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-4">
              <ToolbarLayout>
                <Dialog.Close>
                  <ArrowEnterLeft20Filled className="cursor-pointer hover:opacity-80" />
                </Dialog.Close>
                <RichTextEditorToolbar quill={quillInstance} />
                <button
                  type="submit"
                  className="cursor-pointer hover:opacity-80"
                >
                  <Checkmark20Filled className="text-green" />
                </button>
              </ToolbarLayout>
              <div className="border p-2 bg-bg rounded-lg h-[200px] w-[90vw] md:w-4/5  max-h-[200px] overflow-y-auto">
                <RichTextEditor
                  setQuillInstance={setQuillInstance}
                  readOnly={false}
                  defaultOps={fragment?.content || null}
                />
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const FileDialog = ({ type, memory_id, button }: FileDialogProps) => {
  const { session } = useAuth();
  const addFileToMemory = useAddFileFragmentToMemory();
  const createMemoryFromFile = useCreateMemoryFromFile();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const file = formData.get("memory-form-file");
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
        addFileToMemory.mutateAsync({ data: toSendData }).then(() => {
          setIsOpen(false);
        });
      } else {
        // creating new memory
        toSendData.append("file", file as Blob);
        toSendData.append("memory_title", "blank_");
        toSendData.append("type", type);
        createMemoryFromFile.mutateAsync({ data: toSendData }).then(() => {
          setIsOpen(false);
        });
      }
    },
    [session, memory_id]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{button}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-100 bg-bg fixed inset-0 opacity-90" />
        <Dialog.Content className="z-100 fixed top-1/2 left-1/2 w-1/2 p-6 rounded-md shadow-lg translate-x-[-50%] translate-y-[-50%]">
          <VisuallyHidden.Root>
            <Dialog.Title>Create a memory with a {type}.</Dialog.Title>
          </VisuallyHidden.Root>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <ToolbarLayout>
                <Dialog.Close>
                  <ArrowEnterLeft20Filled className="cursor-pointer hover:opacity-80" />
                </Dialog.Close>
                <button
                  type="submit"
                  className="cursor-pointer hover:opacity-80"
                >
                  <Checkmark20Filled className="text-green" />
                </button>
              </ToolbarLayout>
              <input
                type="file"
                name="memory-form-file"
                className="border border-text bg-bg rounded-lg p-2 hover:cursor-pointer"
              />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
