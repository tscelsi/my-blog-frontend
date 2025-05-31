import { forwardRef } from "react";

export const ToolbarLayout = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{}>
>(({ children }, ref) => {
  return (
    <div
      className="w-fit bg-bg py-2 flex justify-start items-center gap-2"
      ref={ref}
    >
      {children}
    </div>
  );
});
