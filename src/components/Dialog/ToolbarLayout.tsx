import { forwardRef } from "react";

export const ToolbarLayout = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{}>
>(({ children }, ref) => {
  return (
    <div
      className="w-fit rounded-md bg-bg p-2 flex items-center gap-4 border-2"
      ref={ref}
    >
      {children}
    </div>
  );
});
