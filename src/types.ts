import { Op } from "quill";

export type FileType = "file" | "audio" | "image";
export type MediaType = "rich_text" | FileType;

export interface BaseFragment {
  type: MediaType;
  id: string;
}

export interface RichTextFragment extends BaseFragment {
  type: "rich_text";
  content: Op[];
}

export interface FileFragment extends BaseFragment {
  type: "file" | "audio" | "image";
  name: string;
  upload_progress: number;
  status: "uploading" | "uploaded" | "error";
}

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  fragments: (FileFragment | RichTextFragment)[];
  private: boolean;
  pinned: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type ListMemoryItem = Pick<
  Memory,
  "id" | "title" | "pinned" | "private" | "created_at"
>;
