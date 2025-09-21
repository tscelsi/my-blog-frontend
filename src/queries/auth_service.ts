/**
 * @module queries/sharing_service
 * @description This module provides functions to interact with the auth API.
 * It includes functions to:
 * 1. retrieve an authenticated user's account information
 */

import { queryOptions } from "@tanstack/react-query";
import { createAxiosClient } from "../utils/axios_interceptor";
import type { Account } from "../types";

// Query: fetch account info for an authed user
export const getAccountQueryOptions = () => {
  return queryOptions({
    queryKey: ["auth", "account"],
    queryFn: async () => {
      const res = await createAxiosClient().get<Account>(`/auth/account`);
      return res.data;
    },
  });
};
