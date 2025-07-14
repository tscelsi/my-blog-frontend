import { queryOptions, useQuery } from "@tanstack/react-query";
import { createAxiosClient } from "../utils/axios_interceptor";

export interface RssChannel {
  title: string;
  link: string;
  items: RssItem[];
}

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pub_date: string;
  source: string;
}

export const getRssFeedOptions = (memory_id: string, fragment_id: string) => {
  return queryOptions({
    queryKey: ["rss", memory_id, fragment_id],
    queryFn: async () => {
      const response = await createAxiosClient().get<RssItem[]>("/fragment/rss", {
        params: {
          memory_id,
          fragment_id,
        },
      });
      return response.data || null;
    },
  });
};

export const useGetRssFeed = (memory_id: string, fragment_id: string) => {
  const result = useQuery(getRssFeedOptions(memory_id, fragment_id));
  return {
    ...result,
    data: result.data || null,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
};
