import { Add20Filled } from "@fluentui/react-icons";
import { useCreateEmptyMemory } from "../../queries/memory_service";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../Button";

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
    <Button
      onClick={handleAddClicked}
      className="cursor-pointer hover:opacity-80"
      whileTap={{ scale: 0.8, rotate: 100 }}
    >
      <Add20Filled />
    </Button>
  );
};
