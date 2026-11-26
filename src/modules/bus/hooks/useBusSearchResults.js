import { useQuery } from "@tanstack/react-query";
import { fetchBusSearchResultsApi } from "../services/bus-search-results.service";

export const useBusSearchResults = (tui, enabled = false) => {
  return useQuery({
    queryKey: ["bus-search-results", tui],

    queryFn: ({ signal }) => fetchBusSearchResultsApi(tui, signal),

    enabled: Boolean(tui) && enabled,

    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes

    retry: 2,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    // Poll every 1.5 seconds if search not completed, with exponential backoff
    refetchInterval: (data, query) => {
      if (!data?.completed) {
        return 1500; // 1.5 seconds
      }
      return false; // Stop polling once completed
    },

    refetchIntervalInBackground: true,
  });
};

