import { Op } from "quill";

export type FileType = "file" | "audio" | "image";
export type MediaType = "text" | "rich_text" | FileType;

export interface BaseFragment {
  type: MediaType;
  id: string;
}

export interface TextFragment extends BaseFragment {
  type: "text";
  content: string;
  href: string | null;
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
  fragments: (FileFragment | TextFragment | RichTextFragment)[];
  created_at: string;
  updated_at: string;
}
