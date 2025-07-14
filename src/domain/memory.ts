import { Fragment, Memory as MemoryType, Tag } from "../types";

class Memory {
  id: string;
  title: string;
  user_id: string;
  fragments: Fragment[];
  private: boolean;
  pinned: boolean;
  tags: Set<string>;
  updated_at: Date;

  constructor({ title, user_id, fragments = [] }: MemoryType) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.user_id = user_id;
    this.fragments = fragments;
    this.private = true;
    this.pinned = false;
    this.tags = new Set<Tag>();
    this.updated_at = new Date();
  }

  getFragment(fragmentId: string): Fragment {
    const fragment = this.fragments.find((f) => f.id === fragmentId);
    if (!fragment) {
      throw new Error(
        `Fragment with ID ${fragmentId} doesn't exist in memory ${this.id}`
      );
    }
    return fragment;
  }

  listFragments(fragmentIds: string[]): Fragment[] {
    return this.fragments.filter((f) => fragmentIds.includes(f.id));
  }

  forgetFragment(fragmentId: string): void {
    const fragment = this.getFragment(fragmentId);
    this.fragments = this.fragments.filter((f) => f.id !== fragment.id);
    this.updated_at = new Date();
  }

  updateFragmentOrdering(fragmentIds: string[]): void {
    this.fragments = fragmentIds.map((id) => this.getFragment(id));
    this.updated_at = new Date();
  }

  makePublic(): void {
    this.private = false;
    this.updated_at = new Date();
  }

  makePrivate(): void {
    this.private = true;
    this.updated_at = new Date();
  }

  pin(): void {
    this.pinned = true;
    this.updated_at = new Date();
  }

  unpin(): void {
    this.pinned = false;
    this.updated_at = new Date();
  }

  setTags(tags: Set<Tag>): void {
    this.tags = tags;
    this.updated_at = new Date();
  }
}

export default Memory;
