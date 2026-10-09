// import { useQuery } from "@tanstack/react-query";
// import { searchDestinationApi } from "../services/search.api";

// export const useDestinationSearch = (searchText = "") => {
//   const trimmedSearch = searchText.trim();

//   return useQuery({
//     queryKey: ["destination-search", trimmedSearch],
//     queryFn: () => searchDestinationApi(trimmedSearch),
//     enabled: trimmedSearch.length >= 2,
//     staleTime: 1000 * 60 * 5,

//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: false,
//   });
// };



import { useQuery } from "@tanstack/react-query";
import { searchDestinationApi } from "../services/search.api";

export const useDestinationSearch = (searchText = "") => {
  const trimmedSearch = searchText.trim();

  return useQuery({
    queryKey: ["destination-search", trimmedSearch],

    queryFn: ({ signal }) =>
      searchDestinationApi(trimmedSearch, signal),

    enabled: trimmedSearch.length >= 2,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
