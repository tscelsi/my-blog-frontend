import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { type Memory as MemoryType } from "./types";
import { Op } from "quill";
import { createAxiosClient } from "./utils/axios_interceptor";

export const listMemoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ["memory"],
    queryFn: async () => {
      const response =
        await createAxiosClient().get<MemoryType[]>("/public/memory");
      return response.data || [];
    },
  });
};

export const getMemoryQueryOptions = (memoryId: string) => {
  return queryOptions({
    queryKey: ["memory", memoryId],
    queryFn: async () => {
      const response = await createAxiosClient().get<MemoryType>(
        `/public/memory/${memoryId}`
      );
      return response.data || null;
    },
  });
};

export const useDeleteMemoryOrFragment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      memory_id,
      fragment_ids,
    }: {
      memory_id: string;
      fragment_ids?: string[];
    }) => {
      const data = {
        ...(fragment_ids && { fragment_ids }),
      };
      return await createAxiosClient().post(
        `/memory/${memory_id}/forget`,
        data
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type CreateMemoryFromFileType = {
  data: FormData;
};

export const useCreateMemoryFromFile = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: CreateMemoryFromFileType) => {
      return await createAxiosClient().post("/memory/from-file", args.data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type CreateMemoryFromTextType = {
  data: { memory_title: string; text: string };
};

export const useCreateMemoryFromText = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: CreateMemoryFromTextType) => {
      return await createAxiosClient().post("/memory/from-text", args.data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type CreateMemoryFromRichTextType = {
  data: { memory_title: string; content: Op[] };
};

export const useCreateMemoryFromRichText = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: CreateMemoryFromRichTextType) => {
      return await createAxiosClient().post(
        "/memory/from-rich-text",
        args.data
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type AddFileFragmentToMemoryType = {
  data: FormData;
};

export const useAddFileFragmentToMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: AddFileFragmentToMemoryType) => {
      return await createAxiosClient().post("/fragment/add-file", args.data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type AddTextFragmentToMemoryType = {
  data: { text: string; memory_id: string };
};

export const useAddTextFragmentToMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: AddTextFragmentToMemoryType) => {
      return await createAxiosClient().post("/fragment/add-text", args.data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type ModifyTextFragmentType = {
  data: { text: string; memory_id: string; fragment_id: string };
};

export const useModifyTextFragment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: ModifyTextFragmentType) => {
      return await createAxiosClient().post("/fragment/modify-text", args.data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type AddRichTextFragmentToMemoryType = {
  data: { content: Op[]; memory_id: string };
};

export const useAddRichTextFragmentToMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: AddRichTextFragmentToMemoryType) => {
      return await createAxiosClient().post(
        "/fragment/add-rich-text",
        args.data
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type ModifyRichTextFragmentType = {
  data: { content: Op[]; memory_id: string; fragment_id: string };
};

export const useModifyRichTextFragment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: ModifyRichTextFragmentType) => {
      return await createAxiosClient().post(
        "/fragment/modify-rich-text",
        args.data
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      console.log("Modified rich text fragment successfully");
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type UpdateMemoryType = {
  memory_id: string;
  data: {
    fragment_ids: string[];
    memory_title: string;
  };
};

export const useUpdateMemory = (memory_id: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (options: UpdateMemoryType) => {
      return await createAxiosClient().post(
        `/memory/${options.memory_id}/update`,
        options.data
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory", memory_id] });
    },
  });
  return mutation;
};

export const usePinMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      memory_id,
      pin,
    }: {
      memory_id: string;
      pin: boolean;
    }) => {
      return await createAxiosClient().put(`/memory/${memory_id}/set-pin`, {
        pin,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

export const useSetMemoryPrivacy = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      memory_id,
      private_,
    }: {
      memory_id: string;
      private_: boolean;
    }) => {
      return await createAxiosClient().put(`/memory/${memory_id}/set-private`, {
        private: private_,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};
