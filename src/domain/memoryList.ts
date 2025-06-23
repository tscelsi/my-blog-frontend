import { ListMemoryItem } from "../types";

export class MemoryList {
  private memories: ListMemoryItem[];
  constructor(memories: ListMemoryItem[]) {
    this.memories = memories;
  }

  pin(memoryId: string, pin: boolean) {
    const memory = this.memories.find((m) => m.id === memoryId);
    if (memory) {
      memory.pinned = pin;
    }
  }

  getMemories() {
    this.memories.sort((a, b) => {
      // sort by pinned first, then date
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
    return this.memories;
  }

  addNew() {
    const newMemory: ListMemoryItem = {
      id: crypto.randomUUID(),
      title: "blank_",
      created_at: new Date().toISOString(),
      pinned: false,
      private: false,
    };
    this.memories.push(newMemory);
    return newMemory;
  }
}
