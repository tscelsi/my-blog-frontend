import { Add20Filled } from "@fluentui/react-icons";
import { useCreateEmptyMemory } from "../../memory_service";
import { useNavigate } from "@tanstack/react-router";

export const CreateMemoryButton = () => {
  const navigate = useNavigate();
  const createMemoryMutation = useCreateEmptyMemory();

  const handleAddClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createMemoryMutation.mutateAsync().then((res) => {
      res.data.id && navigate({ to: `/${res.data.id}`, replace: true });
    });
  };

  return (
    <button
      onClick={handleAddClicked}
      className="cursor-pointer hover:opacity-80"
    >
      <Add20Filled />
    </button>
  );
};
