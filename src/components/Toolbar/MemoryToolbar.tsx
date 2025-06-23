import { Link, useNavigate } from "@tanstack/react-router";
import { Del } from "../../actions";
import {
  useDeleteMemoryOrFragment,
  usePinMemory,
  useSetMemoryPrivacy,
} from "../../memory_service";
import { Memory } from "../../types";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useAuth } from "../../hooks/useAuth";

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
  const deleteMutation = useDeleteMemoryOrFragment();
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

  return (
    <div className="flex gap-3 border-b border-dark-grey py-1 px-6">
      {isSmallScreen && (
        <Link to="/" className="w-fit">
          <button className="hover:opacity-80 cursor-pointer">
            <p>[back]</p>
          </button>
        </Link>
      )}
      {isEditing &&
        (isPinned ? (
          <button
            onClick={handlePinClicked}
            className="hover:opacity-80 cursor-pointer"
          >
            <p>[unpin]</p>
          </button>
        ) : (
          <button
            onClick={handlePinClicked}
            className="hover:opacity-80 cursor-pointer"
          >
            <p>[pin]</p>
          </button>
        ))}
      {isEditing &&
        (isPrivate ? (
          <button
            onClick={togglePrivatePublic}
            className="hover:opacity-80 cursor-pointer"
          >
            <p>[make public]</p>
          </button>
        ) : (
          <button
            onClick={togglePrivatePublic}
            className="hover:opacity-80 cursor-pointer"
          >
            <p>[make private]</p>
          </button>
        ))}
      {session && (
        <p onClick={toggleEdit} className="cursor-pointer hover:opacity-80">
          {isEditing ? "[done]" : "[edit]"}
        </p>
      )}
      {isEditing && (
        <Del
          onClick={async () => {
            await deleteMutation
              .mutateAsync({
                memory_id: memory.id,
              })
              .then(() => {
                navigate({ to: "/" });
              });
          }}
        />
      )}
    </div>
  );
};
