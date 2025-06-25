import { Button } from "./components/Button";

type DelProps = {
  onClick: () => void;
};

export const Del = ({ onClick }: DelProps) => {
  return (
    <Button onClick={onClick} variant="destructive">
      [del]
    </Button>
  );
};

export const Download = ({ url }: { url: string }) => {
  return (
    <a
      className="underline text-link hover:opacity-80"
      href={url}
      target="_blank"
    >
      [download]
    </a>
  );
};
