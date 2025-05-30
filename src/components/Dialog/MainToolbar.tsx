import { Memory } from "../../types";
import InputDialog from "./InputDialog";
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
      <InputDialog
        type="rich_text"
        memory_id={memoryId}
        button={<TextT24Filled className="cursor-pointer hover:opacity-80" />}
      />
      <InputDialog
        type="image"
        memory_id={memoryId}
        button={<Image24Filled className="cursor-pointer hover:opacity-80" />}
      />
      <InputDialog
        type="audio"
        memory_id={memoryId}
        button={
          <MusicNote224Filled className="cursor-pointer hover:opacity-80" />
        }
      />
      <InputDialog
        type="file"
        memory_id={memoryId}
        button={
          <Document24Filled className="cursor-pointer hover:opacity-80" />
        }
      />
    </ToolbarLayout>
  );
};
