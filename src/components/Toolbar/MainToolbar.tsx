import { Memory } from "../../types";
import { FileDialog, TextDialog } from "../dialogs";
import {
  TextT24Filled,
  Image24Filled,
  MusicNote224Filled,
  Document24Filled,
} from "@fluentui/react-icons";
import { ToolbarLayout } from "./ToolbarLayout";

type ToolbarProps = {
  memory?: Memory;
};

export const Toolbar = ({ memory }: ToolbarProps) => {
  const memoryId = memory?.id || null;
  return (
    <ToolbarLayout>
      <TextDialog
        memory_id={memoryId}
        button={<TextT24Filled className="cursor-pointer hover:opacity-80" />}
      />
      <FileDialog
        type="image"
        memory_id={memoryId}
        button={<Image24Filled className="cursor-pointer hover:opacity-80" />}
      />
      <FileDialog
        type="audio"
        memory_id={memoryId}
        button={
          <MusicNote224Filled className="cursor-pointer hover:opacity-80" />
        }
      />
      <FileDialog
        type="file"
        memory_id={memoryId}
        button={
          <Document24Filled className="cursor-pointer hover:opacity-80" />
        }
      />
    </ToolbarLayout>
  );
};
