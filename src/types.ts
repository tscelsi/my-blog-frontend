import { Op } from "quill";

export type FileType = "file" | "audio" | "image";
export type MediaType = "rich_text" | FileType | "rss_feed";

export interface BaseFragment {
  type: MediaType;
  id: string;
}

export interface RichTextFragment extends BaseFragment {
  type: "rich_text";
  content: Op[];
}

export interface RssFeedFragment extends BaseFragment {
  type: "rss_feed";
  urls: string[];
}

export interface FileFragment extends BaseFragment {
  type: "file" | "audio" | "image";
  name: string;
  upload_progress: number;
  status: "uploading" | "uploaded" | "error";
}

export type Fragment = FileFragment | RichTextFragment | RssFeedFragment;

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  fragments: Fragment[];
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

export type Tag = "music" | "software" | "thoughts" | "photos";
