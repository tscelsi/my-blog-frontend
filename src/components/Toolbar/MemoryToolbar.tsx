import { useNavigate } from "@tanstack/react-router";
import { Del } from "../../actions";
import {
  useDeleteMemoryOrFragment,
  usePinMemory,
  useSetMemoryPrivacy,
} from "../../memory_service";
import { Memory } from "../../types";

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
  const togglePinMutation = usePinMemory();
  const deleteMutation = useDeleteMemoryOrFragment();
  const togglePrivatePublicMutation = useSetMemoryPrivacy();
  const handlePinClicked = () => {
    togglePinMutation
      .mutateAsync({
        memory_id: memory.id,
        pin: !memory.pinned,
      })
      .catch((error) => {
        console.error("Error toggling pin:", error);
      });
  };

  const togglePrivatePublic = () => {
    togglePrivatePublicMutation
      .mutateAsync({
        memory_id: memory.id,
        private_: !memory.private,
      })
      .catch((error) => {
        console.error("Error toggling privacy:", error);
      });
  };

  return (
    <>
      {isEditing &&
        (memory.pinned ? (
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
        (memory.private ? (
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
      <p onClick={toggleEdit} className="cursor-pointer hover:opacity-80">
        {isEditing ? "[done]" : "[edit]"}
      </p>
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
    </>
  );
};
