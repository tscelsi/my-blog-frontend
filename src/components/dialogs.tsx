import { VisuallyHidden, Dialog } from "radix-ui";
import { MediaType } from "../types";
import { JSX, useCallback, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import {
  useAddFileFragmentToMemory,
  useAddRssFragmentToMemory,
} from "../memory_service";
import { useAuth } from "../hooks/useAuth";
import { ToolbarLayout } from "./Toolbar/ToolbarLayout";
import {
  ArrowEnterLeft20Filled,
  Checkmark20Filled,
} from "@fluentui/react-icons";
import { Button } from "./Button";
import { useModifyRssFeed } from "../queries/rss_service";

type FileDialogProps = {
  type: MediaType;
  memory_id: string;
  button: JSX.Element;
};

export const FileDialog = ({ type, memory_id, button }: FileDialogProps) => {
  const { session } = useAuth();
  const addFileToMemory = useAddFileFragmentToMemory();
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
      // adding to a memory
      toSendData.append("file", file as Blob);
      toSendData.append("memory_id", memory_id);
      toSendData.append("type", type);
      addFileToMemory.mutateAsync({ data: toSendData }).then(() => {
        setIsOpen(false);
      });
    },
    [session, memory_id, addFileToMemory]
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

type CreateRssFeedDialogProps = {
  memory_id: string;
  button: JSX.Element;
};

type RssFeedInput = {
  rss_feeds: {
    url: string;
  }[];
};

export const CreateRssFeedDialog = ({
  memory_id,
  button,
}: CreateRssFeedDialogProps) => {
  const { session } = useAuth();
  const { control, handleSubmit, register } = useForm<RssFeedInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rss_feeds",
  });
  const addRssToMemory = useAddRssFragmentToMemory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onSubmit: SubmitHandler<RssFeedInput> = useCallback(
    (data) => {
      console.log(data);
      if (!session) {
        console.error("No session");
        return;
      }
      let urls = data.rss_feeds.map((feed) => feed.url.trim());
      urls = urls.filter((url) => url.trim() !== "");
      if (urls.length === 0) {
        console.error("No valid URLs provided");
        return;
      }
      addRssToMemory.mutateAsync({ urls, memory_id }).then(() => {
        setIsOpen(false);
      });
    },
    [session, memory_id, addRssToMemory]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{button}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-100 bg-bg fixed inset-0 opacity-90" />
        <Dialog.Content
          className="border bg-bg z-100 fixed top-1/2 left-1/2 w-1/2 p-6 rounded-md shadow-lg translate-x-[-50%] translate-y-[-50%]"
          aria-describedby="dialog-description"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>
              Enter the URL for an RSS feed to add to your memory.
            </Dialog.Title>
          </VisuallyHidden.Root>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`rss_feeds.${index}.url`)}
                    placeholder="Enter RSS feed URL"
                    className="border border-text bg-bg rounded-lg p-2 hover:cursor-pointer"
                  />
                  <Button onClick={() => remove(index)} className="text-error">
                    [remove]
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                onClick={() => append({ url: "" })}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                [add url]
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

type ModifyRssFeedDialogProps = {
  memory_id: string;
  fragment_id: string;
  urls: string[];
  button: JSX.Element;
};

export const ModifyRssFeedDialog = ({
  memory_id,
  fragment_id,
  urls,
  button,
}: ModifyRssFeedDialogProps) => {
  const { session } = useAuth();
  const { control, handleSubmit, register } = useForm<RssFeedInput>({
    defaultValues: {
      rss_feeds: urls.map((url) => ({ url })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rss_feeds",
  });
  const modifyRssFeed = useModifyRssFeed();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onSubmit: SubmitHandler<RssFeedInput> = useCallback(
    (data) => {
      console.log(data);
      if (!session) {
        console.error("No session");
        return;
      }
      let urls = data.rss_feeds.map((feed) => feed.url.trim());
      urls = urls.filter((url) => url.trim() !== "");
      if (urls.length === 0) {
        console.error("No valid URLs provided");
        return;
      }
      modifyRssFeed.mutateAsync({ memory_id, fragment_id, urls }).then(() => {
        setIsOpen(false);
      });
    },
    [session, memory_id, fragment_id, modifyRssFeed]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{button}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-100 bg-bg fixed inset-0 opacity-90" />
        <Dialog.Content
          className="border bg-bg z-100 fixed top-1/2 left-1/2 w-1/2 p-6 rounded-md shadow-lg translate-x-[-50%] translate-y-[-50%]"
          aria-describedby="dialog-description"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>
              Enter the URL for an RSS feed to add to your memory.
            </Dialog.Title>
          </VisuallyHidden.Root>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`rss_feeds.${index}.url`)}
                    placeholder="Enter RSS feed URL"
                    className="border border-text bg-bg rounded-lg p-2 hover:cursor-pointer"
                  />
                  <Button onClick={() => remove(index)} className="text-error">
                    [remove]
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                onClick={() => append({ url: "" })}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                [add url]
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
