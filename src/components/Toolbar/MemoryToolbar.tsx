import { Link, useNavigate } from "@tanstack/react-router";
import { Del } from "../../actions";
import {
  useDeleteMemory,
  usePinMemory,
  useSetMemoryPrivacy,
} from "../../memory_service";
import { Memory } from "../../types";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useAuth } from "../../hooks/useAuth";
import clsx from "clsx";
import { AddFragmentButton } from "./AddFragmentButton";
import { Button } from "../Button";
import { EditActions } from "../EditActions";

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
  const { session } = useAuth();
  const { mutateAsync: mutateMemoryPin, variables: pinVariables } =
    usePinMemory(memory.id);
  const deleteMemoryMutation = useDeleteMemory();
  const { mutateAsync: mutateMemoryPrivacy, variables: privacyVariables } =
    useSetMemoryPrivacy(memory.id);
  const isSmallScreen = useIsSmallScreen();

  const handlePinClicked = () => {
    mutateMemoryPin({
      pin: !memory.pinned,
      memory_id: memory.id,
    }).catch((error) => {
      console.error("Error toggling pin:", error);
    });
  };

  const isPrivate = privacyVariables?.private_ ?? memory.private;
  const isPinned = pinVariables?.pin ?? memory.pinned;

  const togglePrivatePublic = () => {
    mutateMemoryPrivacy({
      private_: !memory.private,
    }).catch((error) => {
      console.error("Error toggling privacy:", error);
    });
  };
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
          {session && (
            <Button
              onClick={toggleEdit}
              className="cursor-pointer hover:opacity-80"
            >
              {isEditing ? "[done]" : "[edit]"}
            </Button>
          )}
        </div>
        {isEditing && <EditActions memory={memory} />}
      </div>
    );
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
      )}
      {isEditing && <AddFragmentButton memory={memory} />}
      {isEditing &&
        (isPinned ? (
          <Button isSelected onClick={handlePinClicked}>
            [unpin]
          </Button>
        ) : (
          <Button onClick={handlePinClicked}>[pin]</Button>
        ))}
      {isEditing &&
        (isPrivate ? (
          <Button onClick={togglePrivatePublic}>[make public]</Button>
        ) : (
          <Button isSelected onClick={togglePrivatePublic}>
            [make private]
          </Button>
        ))}
      {session && (
        <Button
          onClick={toggleEdit}
          className="cursor-pointer hover:opacity-80"
        >
          {isEditing ? "[done]" : "[edit]"}
        </Button>
      )}
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
