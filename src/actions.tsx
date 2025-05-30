type DelProps = {
  onClick: () => void;
};

export const Del = ({ onClick }: DelProps) => {
  return (
    <div
      className="cursor-pointer text-error hover:opacity-80 w-fit"
      onClick={onClick}
    >
      <p>del</p>
    </div>
  );
};

export const Download = ({ url }: { url: string }) => {
  return (
    <a
      className="underline text-link hover:opacity-80"
      href={url}
      target="_blank"
    >
      download
    </a>
  );
};
