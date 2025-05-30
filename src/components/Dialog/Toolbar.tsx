import {
  ArrowEnterLeft24Filled,
  TextBold24Filled,
  TextItalic24Filled,
  Checkmark24Filled,
  Link24Filled,
} from "@fluentui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { MediaType } from "../../types";
import Quill from "quill";
import { ToolbarLayout } from "./ToolbarLayout";

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
      {type === "rich_text" && (
        <>
          <button
            type="button"
            aria-label="Bold"
            onClick={(e) => {
              e.preventDefault();
              quill?.format("bold", true);
            }}
            className="cursor-pointer hover:opacity-80"
          >
            <TextBold24Filled />
          </button>
          <button
            type="button"
            aria-label="Italic"
            onClick={(e) => {
              e.preventDefault();
              quill?.format("italic", true);
            }}
            className="cursor-pointer hover:opacity-80"
          >
            <TextItalic24Filled />
          </button>
          <button
            type="button"
            aria-label="Link"
            onClick={(e) => {
              e.preventDefault();
              const url = prompt("Enter the URL");
              if (url) {
                quill?.format("link", url);
              }
            }}
            className="cursor-pointer hover:opacity-80"
          >
            <Link24Filled />
          </button>
        </>
      )}
      <button type="submit" className="cursor-pointer hover:opacity-80">
        <Checkmark24Filled className="text-green" />
      </button>
    </ToolbarLayout>
  );
};
