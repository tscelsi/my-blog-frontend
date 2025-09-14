/**
 * @module queries/sharing_service
 * @description This module provides functions to interact with the sharing service API.
 * It includes functions to:
 * 1. add an editor by email
 * 2. remove an editor by id
 * 3. add a reader by email
 * 4. remove a reader by id
 * 5. make a memory public
 * 6. make a memory private
 * 7. retrieve sharing information for a memory
 */

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createAxiosClient } from "../utils/axios_interceptor";
import type { Memory } from "../types";

interface MemorySharingPermissions {
  id: string;
  owner: string;
  readers: Array<{ id: string; email: string }>;
  editors: Array<{ id: string; email: string }>;
  private: boolean;
}

// Types
export type SharingInfo = Pick<Memory, "readers" | "editors" | "private">;

export type ModifyCollaboratorArgs = {
  memory_id: string;
  user_id: string;
};

export type AddCollaboratorByEmailArgs = {
  memory_id: string;
  email: string;
};

// Query: fetch sharing info for a memory
export const getSharingInfoQueryOptions = (memory_id: string) => {
  return queryOptions({
    queryKey: ["sharing", memory_id],
    queryFn: async () => {
      const res = await createAxiosClient().get<MemorySharingPermissions>(
        `/sharing/${memory_id}/permissions`
      );
      return res.data;
    },
  });
};

// Mutations: editors
export const useAddEditor = (memory_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
    }: Omit<AddCollaboratorByEmailArgs, "memory_id">) => {
      return await createAxiosClient().put(
        `/sharing/${memory_id}/editors/add`,
        { email }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["memory", memory_id] });
      queryClient.invalidateQueries({ queryKey: ["sharing", memory_id] });
    },
    mutationKey: ["addEditor", memory_id],
  });
};

export const useRemoveEditor = (memory_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user_id,
    }: Omit<ModifyCollaboratorArgs, "memory_id">) => {
      return await createAxiosClient().put(
        `/sharing/${memory_id}/editors/remove`,
        { user_id }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["memory", memory_id] });
      queryClient.invalidateQueries({ queryKey: ["sharing", memory_id] });
    },
    mutationKey: ["removeEditor", memory_id],
  });
};

// Mutations: readers
export const useAddReader = (memory_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
    }: Omit<AddCollaboratorByEmailArgs, "memory_id">) => {
      return await createAxiosClient().put(
        `/sharing/${memory_id}/readers/add`,
        { email }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["memory", memory_id] });
      queryClient.invalidateQueries({ queryKey: ["sharing", memory_id] });
    },
    mutationKey: ["addReader", memory_id],
  });
};

export const useRemoveReader = (memory_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user_id,
    }: Omit<ModifyCollaboratorArgs, "memory_id">) => {
      return await createAxiosClient().put(
        `/sharing/${memory_id}/readers/remove`,
        { user_id }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["memory", memory_id] });
      queryClient.invalidateQueries({ queryKey: ["sharing", memory_id] });
    },
    mutationKey: ["removeReader", memory_id],
  });
};

// Mutations: public/private
export const useMakeMemoryPublic = (memory_id: string, isPublic: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await createAxiosClient().put(`/sharing/${memory_id}/set-public`, {
        is_public: isPublic,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["memory", memory_id] });
      queryClient.invalidateQueries({ queryKey: ["sharing", memory_id] });
    },
    mutationKey: ["makeMemoryPublic", memory_id],
  });
};

// Public Memory: fetch public memory payload (no auth) for the share page
export const getPublicMemoryQueryOptions = (memory_id: string) => {
  return queryOptions({
    queryKey: ["public-memory", memory_id],
    queryFn: async () => {
      const res = await createAxiosClient().get<Memory>(
        `/public/memory/${memory_id}`
      );
      return res.data;
    },
  });
};
