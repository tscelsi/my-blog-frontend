import { forwardRef } from "react";

export const ToolbarLayout = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  return (
    <div
      className="w-fit bg-bg p-2 flex justify-start items-center gap-4 border rounded-md"
      ref={ref}
    >
      {children}
    </div>
  );
});
