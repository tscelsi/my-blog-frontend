import { Memory } from "../../types";
import { FileDialog, CreateModifyRssFeedDialog } from "../dialogs";
import { Drawer } from "vaul";
import {
  TextT20Filled,
  Image20Filled,
  MusicNote220Filled,
  Document20Filled,
  Rss20Filled,
} from "@fluentui/react-icons";
import { useAddRichTextFragmentToMemory } from "../../memory_service";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "../Button";

type ToolbarProps = {
  memory: Memory;
  trigger?: React.ReactNode;
};

export const AddFragmentButton = ({ memory, trigger }: ToolbarProps) => {
  const [open, setOpen] = useState(false);
  const addRichTextMutation = useAddRichTextFragmentToMemory(memory.id);

  const handleTextClicked = () => {
    addRichTextMutation
      .mutateAsync({
        data: {
          memory_id: memory.id,
          content: [],
        },
      })
      .then(() => {
        setOpen(false);
      });
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="text-start">[new fragment]</Button>
        )}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-dark-grey/10" />
        <Drawer.Content
          className={clsx(
            "bg-bg h-fit fixed bottom-0 left-0 right-0 outline-none border-t border-dark-grey",
            addRichTextMutation.isPending &&
              "pointer-events-none text-dark-grey"
          )}
        >
          <div className="flex flex-col">
            <button
              onClick={handleTextClicked}
              disabled={addRichTextMutation.isPending}
              className="p-4 border-b border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10"
            >
              <div className="flex items-center gap-2 items-end">
                <TextT20Filled />
                <p>Text</p>
              </div>
            </button>
            <div className="p-4 border-b border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10">
              <FileDialog
                type="image"
                memory_id={memory.id}
                button={
                  <div className="flex items-center gap-2 items-end">
                    <Image20Filled />
                    <p>Image</p>
                  </div>
                }
              />
            </div>
            <div className="p-4 border-b border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10">
              <FileDialog
                type="audio"
                memory_id={memory.id}
                button={
                  <div className="flex items-center gap-2 items-end">
                    <MusicNote220Filled />
                    <p>Audio</p>
                  </div>
                }
              />
            </div>
            <div className="p-4 border-b border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10">
              <FileDialog
                type="file"
                memory_id={memory.id}
                button={
                  <div className="flex items-center gap-2 items-end">
                    <Document20Filled />
                    <p>File</p>
                  </div>
                }
              />
            </div>
            <div className="p-4 border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10">
              <CreateModifyRssFeedDialog
                memory_id={memory.id}
                button={
                  <div className="flex items-center gap-2 items-end">
                    <Rss20Filled />
                    <p>RSS Feed</p>
                  </div>
                }
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
