import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ListMemoryItem, type Memory as MemoryType } from "./types";
import { Op } from "quill";
import { createAxiosClient } from "./utils/axios_interceptor";
import { MemoryList } from "./domain/memoryList";

export const listMemoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ["memory"],
    queryFn: async () => {
      const response =
        await createAxiosClient().get<ListMemoryItem[]>("/memory");
      return response.data || [];
    },
  });
};

export const getMemoryQueryOptions = (memoryId: string) => {
  return queryOptions({
    queryKey: ["memory", memoryId],
    queryFn: async () => {
      const response = await createAxiosClient().get<MemoryType>(
        `/memory/${memoryId}`
      );
      return response.data || null;
    },
  });
};

export const useDeleteMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (memory_id: string) => {
      return await createAxiosClient().post(`/memory/${memory_id}/forget`);
    },
    onMutate: async (memory_id) => {
      await queryClient.cancelQueries({ queryKey: ["memory"] });
      const previousMemories = queryClient.getQueryData<ListMemoryItem[]>([
        "memory",
      ]);
      queryClient.setQueryData<ListMemoryItem[]>(["memory"], (old) => {
        if (!old) return [];
        const memoryList = new MemoryList([...old]);
        memoryList.remove(memory_id);
        return memoryList.getMemories();
      });
      return previousMemories;
    },
    onError: (_error, _variables, previousMemories) => {
      queryClient.setQueryData<ListMemoryItem[]>(["memory"], previousMemories);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memory"] }),
  });
  return mutation;
};

export const useDeleteFragment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      memory_id,
      fragment_ids,
    }: {
      memory_id: string;
      fragment_ids: string[];
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

export const useCreateEmptyMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      return await createAxiosClient().post<{ id: string }>("/memory");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memory"] }),
    mutationKey: ["createEmptyMemory"],
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
      return await createAxiosClient().post("/fragment/file", args.data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  return mutation;
};

type AddRssFragmentToMemoryType = {
  urls: string[];
  memory_id: string;
};

export const useAddRssFragmentToMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: AddRssFragmentToMemoryType) => {
      return await createAxiosClient().post("/fragment/rss", data);
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

export const useAddRichTextFragmentToMemory = (memoryId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: AddRichTextFragmentToMemoryType) => {
      return (await createAxiosClient().post)<{ fragment_id: string }>(
        "/fragment/rich-text",
        args.data
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["memory", memoryId] }),
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
      return await createAxiosClient().put("/fragment/rich-text", args.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memory"] }),
  });
  return mutation;
};

type SetMemoryTitleType = {
  memory_id: string;
  data: {
    memory_title: string;
  };
};

export const useSetMemoryTitle = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (options: SetMemoryTitleType) => {
      return await createAxiosClient().put(
        `/memory/${options.memory_id}/set-memory-title`,
        options.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["memory"],
      });
    },
  });
  return mutation;
};

type SetFragmentOrderType = {
  memory_id: string;
  data: {
    fragment_ids: string[];
  };
};

export const useSetFragmentOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (options: SetFragmentOrderType) => {
      return await createAxiosClient().put(
        `/memory/${options.memory_id}/set-fragment-order`,
        options.data
      );
    },
    onSuccess: (_res, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["memory", variables.memory_id],
      }),
  });
  return mutation;
};

export type PinMemoryArgs = {
  pin: boolean;
  memory_id: string;
};

export const usePinMemory = (memory_id: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ pin, memory_id }: PinMemoryArgs) => {
      return await createAxiosClient().put<null>(
        `/memory/${memory_id}/set-pin`,
        {
          pin,
        }
      );
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["memory"] });
      const previousMemories = queryClient.getQueryData<ListMemoryItem[]>([
        "memory",
      ]);
      queryClient.setQueryData<ListMemoryItem[]>(["memory"], (old) => {
        if (!old) return [];
        const memoryList = new MemoryList([...old]);
        memoryList.pin(variables.memory_id, variables.pin);
        return memoryList.getMemories();
      });
      return previousMemories;
    },
    onError: (_error, _variables, previousMemories) => {
      queryClient.setQueryData<ListMemoryItem[]>(["memory"], previousMemories);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["memory"] }),
    mutationKey: ["pinMemory", memory_id],
  });
  return mutation;
};

export type SetMemoryPrivacyArgs = {
  private_: boolean;
};

export const useSetMemoryPrivacy = (memory_id: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ private_ }: SetMemoryPrivacyArgs) => {
      return await createAxiosClient().put(`/memory/${memory_id}/set-private`, {
        private: private_,
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["memory"] }),
    mutationKey: ["setMemoryPrivacy", memory_id],
  });
  return mutation;
};
