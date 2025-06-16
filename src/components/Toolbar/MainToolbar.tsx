import { Memory } from "../../types";
import { FileDialog, TextDialog } from "../dialogs";
import { Add20Filled } from "@fluentui/react-icons";
import { Drawer } from "vaul";
import {
  TextT20Filled,
  Image20Filled,
  MusicNote220Filled,
  Document20Filled,
} from "@fluentui/react-icons";

type ToolbarProps = {
  memory?: Memory;
};

export const Toolbar = ({ memory }: ToolbarProps) => {
  const memoryId = memory?.id || null;
  return (
    <div className="w-fit bg-bg py-2 flex justify-start items-center gap-2">
      <Drawer.Root>
        <Drawer.Trigger>
          <Add20Filled className="cursor-pointer hover:opacity-80 stroke-20" />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-dark-grey/10" />
          <Drawer.Content className="bg-bg h-fit fixed bottom-0 left-0 right-0 outline-none border-t border-dark-grey">
            <div className="flex flex-col">
              <div className="p-4 border-b border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10">
                <TextDialog
                  memory_id={memoryId}
                  button={
                    <div className="flex items-center gap-2 items-end">
                      <TextT20Filled />
                      <p>Text</p>
                    </div>
                  }
                />
              </div>
              <div className="p-4 border-b border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10">
                <FileDialog
                  type="image"
                  memory_id={memoryId}
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
                  memory_id={memoryId}
                  button={
                    <div className="flex items-center gap-2 items-end">
                      <MusicNote220Filled />
                      <p>Audio</p>
                    </div>
                  }
                />
              </div>
              <div className="p-4 border-dark-grey cursor-pointer hover:opacity-80 hover:bg-dark-grey/10">
                <FileDialog
                  type="file"
                  memory_id={memoryId}
                  button={
                    <div className="flex items-center gap-2 items-end">
                      <Document20Filled />
                      <p>File</p>
                    </div>
                  }
                />
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};
