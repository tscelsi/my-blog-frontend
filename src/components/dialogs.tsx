import { VisuallyHidden, Dialog } from "radix-ui";
import { MediaType } from "../types";
import { JSX, useCallback, useState } from "react";
import {
  useAddFileFragmentToMemory,
  useCreateMemoryFromFile,
} from "../memory_service";
import { useAuth } from "../hooks/useAuth";
import { ToolbarLayout } from "./Toolbar/ToolbarLayout";
import {
  ArrowEnterLeft20Filled,
  Checkmark20Filled,
} from "@fluentui/react-icons";

type FileDialogProps = {
  type: MediaType;
  memory_id: string | null;
  button: JSX.Element;
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
        <Dialog.Content
          className="z-100 fixed top-1/2 left-1/2 w-1/2 p-6 rounded-md shadow-lg translate-x-[-50%] translate-y-[-50%]"
          aria-describedby="dialog-description"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>
              Choose a file of type {type} to add to your memory.
            </Dialog.Title>
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
