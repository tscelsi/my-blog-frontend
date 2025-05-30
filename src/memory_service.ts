import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type Memory as MemoryType } from "./types";
import { Op } from "quill";

export const useListMemories = () => {
  const query = useQuery<MemoryType[]>({
    queryKey: ["list-memories"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/public/list-memories`
      );
      return response.data || [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: true,
  });
  return query;
};

export const useDeleteMemoryOrFragment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      memory_id,
      fragment_ids,
      session,
    }: {
      memory_id: string;
      fragment_ids?: string[];
      session: Session;
    }) => {
      const data = {
        memory_id,
        ...(fragment_ids && { fragment_ids }),
      };
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/memory/forget`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type CreateMemoryFromFileType = {
  data: FormData;
  session: Session;
};

export const useCreateMemoryFromFile = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: CreateMemoryFromFileType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/memory/from-file`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type CreateMemoryFromTextType = {
  data: { memory_title: string; text: string };
  session: Session;
};

export const useCreateMemoryFromText = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: CreateMemoryFromTextType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/memory/from-text`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type CreateMemoryFromRichTextType = {
  data: { memory_title: string; content: Op[] };
  session: Session;
};

export const useCreateMemoryFromRichText = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: CreateMemoryFromRichTextType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/memory/from-rich-text`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type AddFileFragmentToMemoryType = {
  data: FormData;
  session: Session;
};

export const useAddFileFragmentToMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: AddFileFragmentToMemoryType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/fragment/add-file`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type AddTextFragmentToMemoryType = {
  data: { text: string; memory_id: string };
  session: Session;
};

export const useAddTextFragmentToMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: AddTextFragmentToMemoryType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/fragment/add-text`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type ModifyTextFragmentType = {
  data: { text: string; memory_id: string; fragment_id: string };
  session: Session;
};

export const useModifyTextFragment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: ModifyTextFragmentType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/fragment/modify-text`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type AddRichTextFragmentToMemoryType = {
  data: { content: Op[]; memory_id: string };
  session: Session;
};

export const useAddRichTextFragmentToMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: AddRichTextFragmentToMemoryType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/fragment/add-rich-text`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type ModifyRichTextFragmentType = {
  data: { content: Op[]; memory_id: string; fragment_id: string };
  session: Session;
};

export const useModifyRichTextFragment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: ModifyRichTextFragmentType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/fragment/modify-rich-text`,
        args.data,
        {
          headers: {
            Authorization: `Bearer ${args.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      console.log("Modified rich text fragment successfully");
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};

type UpdateMemoryType = {
  data: {
    fragment_ids: string[];
    memory_id: string;
    memory_title: string;
  };
  session: Session;
};

export const useUpdateMemory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (options: UpdateMemoryType) => {
      return await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/memory/update`,
        options.data,
        {
          headers: {
            Authorization: `Bearer ${options.session.access_token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["list-memories"] });
    },
  });
  return mutation;
};
