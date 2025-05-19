export const TextArea = ({
  className,
  onMouseDown,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      onMouseDown={(e) => e.stopPropagation()}
      className="w-full h-full border-1"
      {...rest}
    />
  );
};

export const Input = ({
  className,
  onMouseDown,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      onMouseDown={(e) => e.stopPropagation()}
      className="w-full h-full border-1 resize-none"
      {...rest}
    />
  );
};
