import React, { createContext, useContext, useState } from "react";
import { Memory } from "../types";

type ActiveMemoryContextType = {
  activeMemory: Memory | undefined;
  setActiveMemory: React.Dispatch<React.SetStateAction<Memory | undefined>>;
};

const ActiveMemoryContext = createContext<ActiveMemoryContextType | undefined>(
  undefined
);

export const ActiveMemoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeMemory, setActiveMemory] = useState<Memory>();

  return (
    <ActiveMemoryContext.Provider value={{ activeMemory, setActiveMemory }}>
      {children}
    </ActiveMemoryContext.Provider>
  );
};

export const useActiveMemory = () => {
  const ctx = useContext(ActiveMemoryContext);
  if (!ctx)
    throw new Error(
      "useActiveMemory must be used within an ActiveMemoryProvider"
    );
  return ctx;
};
