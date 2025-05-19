export interface BaseFragment {
    type: "file" | "text" | "audio" | "image";
    id: string;
}

export interface TextFragment extends BaseFragment {
    type: "text";
    content: string;
    href: string | null;
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
    fragments: (FileFragment | TextFragment)[];
    created_at: string;
    updated_at: string;
}

export type FileType = "image" | "audio" | "file";