import { Link, useNavigate } from "@tanstack/react-router";
import { Del } from "../../actions";
import { useDeleteMemory, usePinMemory } from "../../queries/memory_service";
import { ShareMemoryDrawer } from "./ShareMemoryDrawer";
import { Memory } from "../../types";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useAuth } from "../../hooks/useAuth";
import clsx from "clsx";
import { Button } from "../Button";
import { EditActions } from "../EditActions";
import { AddFragmentButton } from "./AddFragmentButton";

export const MemoryToolbar = ({
  memory,
  toggleEdit,
  isEditing,
}: {
  memory: Memory;
  toggleEdit: () => void;
  isEditing: boolean;
}) => {
  const navigate = useNavigate();
  const { session, account } = useAuth();
  const canEdit =
    session?.user.id === memory.owner ||
    memory.editors.some((e) => e === session?.user.id);
  const isOwner = session?.user.id === memory.owner;
  const { mutateAsync: mutateMemoryPin, variables: pinVariables } =
    usePinMemory(memory.id);
  const deleteMemoryMutation = useDeleteMemory();
  const isSmallScreen = useIsSmallScreen();

  const handlePinClicked = () => {
    mutateMemoryPin({
      pin: !account?.memories_pinned.includes(memory.id),
      memory_id: memory.id,
    }).catch((error) => {
      console.error("Error toggling pin:", error);
    });
  };

  const isPinned =
    pinVariables?.pin ?? account?.memories_pinned.includes(memory.id);

  // Sharing logic moved into ShareMemoryDrawer
  if (isSmallScreen) {
    return (
      <div
        className={clsx(
          "flex justify-between gap-3 border-dark-grey px-6",
          session && "border-b py-1",
          isSmallScreen && "border-b"
        )}
      >
        <div className="flex gap-2">
          <Link to="/" className="w-fit">
            <Button>[back]</Button>
          </Link>
          {session && canEdit && (
            <Button
              onClick={toggleEdit}
              className="cursor-pointer hover:opacity-80"
            >
              {isEditing ? "[done]" : "[edit]"}
            </Button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {isEditing && <EditActions memory={memory} />}
          {isEditing && (
            <ShareMemoryDrawer
              memory={memory}
              trigger={<Button className="text-start">[sharing]</Button>}
            />
          )}
        </div>
      </div>
    );
  }
  if (!session || !canEdit) {
    return <div />; // empty div to pad
  }
  return (
    <div
      className={clsx(
        "flex gap-3 border-dark-grey px-6",
        session && "border-b py-1",
        isSmallScreen && "border-b"
      )}
    >
      {isSmallScreen && (
        <>
          <Link to="/" className="w-fit">
            <Button>[back]</Button>
          </Link>
        </>
      )}{" "}
      {isEditing && <AddFragmentButton memory={memory} />}
      {isEditing && isOwner && (
        <ShareMemoryDrawer
          memory={memory}
          trigger={<Button className="text-start">[sharing]</Button>}
        />
      )}
      {isEditing &&
        (isPinned ? (
          <Button isSelected onClick={handlePinClicked}>
            [unpin]
          </Button>
        ) : (
          <Button onClick={handlePinClicked}>[pin]</Button>
        ))}
      <Button onClick={toggleEdit} className="cursor-pointer hover:opacity-80">
        {isEditing ? "[done]" : "[edit]"}
      </Button>
      {isEditing && (
        <Del
          onClick={async () => {
            deleteMemoryMutation.mutateAsync(memory.id);
            navigate({ to: "/" });
          }}
        />
      )}
    </div>
  );
};
