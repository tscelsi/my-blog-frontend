import {
  ArrowEnterLeft24Filled,
  Checkmark24Filled,
} from "@fluentui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { MediaType } from "../../types";
import Quill from "quill";
import { ToolbarLayout } from "./ToolbarLayout";
import { RichTextEditorToolbar } from "../RichTextEditor";
/**
 *
 * Should be used within a <form> element.
 * @returns
 */
export const DialogToolbar = ({
  type,
  quill,
}: {
  type: MediaType;
  quill: Quill | null;
}) => {
  return (
    <ToolbarLayout>
      <Dialog.Close>
        <ArrowEnterLeft24Filled className="cursor-pointer hover:opacity-80" />
      </Dialog.Close>
      {type === "rich_text" && <RichTextEditorToolbar quill={quill} />}
      <button type="submit" className="cursor-pointer hover:opacity-80">
        <Checkmark24Filled className="text-green" />
      </button>
    </ToolbarLayout>
  );
};
