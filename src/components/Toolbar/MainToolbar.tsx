import { Memory } from "../../types";
import { FileDialog, TextDialog } from "../dialogs";
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
      <TextDialog
        memory_id={memoryId}
        button={<TextT20Filled className="cursor-pointer hover:opacity-80" />}
      />
      <FileDialog
        type="image"
        memory_id={memoryId}
        button={<Image20Filled className="cursor-pointer hover:opacity-80" />}
      />
      <FileDialog
        type="audio"
        memory_id={memoryId}
        button={
          <MusicNote220Filled className="cursor-pointer hover:opacity-80" />
        }
      />
      <FileDialog
        type="file"
        memory_id={memoryId}
        button={
          <Document20Filled className="cursor-pointer hover:opacity-80" />
        }
      />
    </div>
  );
};
