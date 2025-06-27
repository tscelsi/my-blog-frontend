import { DropdownMenu } from "radix-ui";
import { Button } from "./Button";
import { AddFragmentButton } from "./Toolbar/AddFragmentButton";
import { Memory } from "../types";
import { usePinMemory, useSetMemoryPrivacy } from "../memory_service";

export const EditActions = ({ memory }: { memory: Memory }) => {
  const { mutateAsync: mutateMemoryPin, variables: pinVariables } =
    usePinMemory(memory.id);
  const { mutateAsync: mutateMemoryPrivacy, variables: privacyVariables } =
    useSetMemoryPrivacy(memory.id);
  const handlePinClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutateMemoryPin({
      pin: !memory.pinned,
      memory_id: memory.id,
    }).catch((error) => {
      console.error("Error toggling pin:", error);
    });
  };
  const togglePrivatePublic = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutateMemoryPrivacy({
      private_: !memory.private,
    }).catch((error) => {
      console.error("Error toggling privacy:", error);
    });
  };
  const isPrivate = privacyVariables?.private_ ?? memory.private;
  const isPinned = pinVariables?.pin ?? memory.pinned;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button aria-label="Open edit actions menu">[...]</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="min-w-[148px] bg-bg flex flex-col z-100 rounded-md border-dark-grey border"
        >
          <DropdownMenu.Item asChild>
            <AddFragmentButton
              memory={memory}
              trigger={
                <Button className="text-start border-b border-dark-grey px-2 py-1">
                  [new fragment]
                </Button>
              }
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Button
              onClick={handlePinClicked}
              className="text-start border-b border-dark-grey px-2 py-1"
              isSelected={isPinned}
            >
              {isPinned ? "[unpin]" : "[pin]"}
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Button
              className="text-start border-b border-dark-grey px-2 py-1"
              isSelected={!isPrivate}
              onClick={togglePrivatePublic}
            >
              {isPrivate ? "[make public]" : "[make private]"}
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Button
              className="px-2 py-1 text-start"
              variant="destructive"
              onClick={() => console.log("del clicked")}
            >
              [del]
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
