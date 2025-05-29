import {
  ArrowEnterLeft24Filled,
  Checkmark24Filled,
} from "@fluentui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";

/**
 *
 * Should be used within a <form> element.
 * @returns
 */
export const DialogToolbar = () => {
  return (
    <div className="w-fit rounded-md bg-bg p-2 flex items-center gap-4 border">
      <Dialog.Close>
        <ArrowEnterLeft24Filled className="cursor-pointer hover:opacity-80" />
      </Dialog.Close>
      <button type="submit" className="cursor-pointer hover:opacity-80">
        <Checkmark24Filled />
      </button>
    </div>
  );
};
