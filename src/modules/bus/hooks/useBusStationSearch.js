import { useQuery } from "@tanstack/react-query";
import { searchBusStationsApi } from "../services/bus-stations.service";

export const useBusStationSearch = (searchText = "", type = "from") => {
  const trimmedSearch = searchText.trim();

  return useQuery({
    queryKey: ["bus-stations", trimmedSearch, type],

    queryFn: ({ signal }) => searchBusStationsApi(trimmedSearch, type, signal),

    enabled: trimmedSearch.length >= 2,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
