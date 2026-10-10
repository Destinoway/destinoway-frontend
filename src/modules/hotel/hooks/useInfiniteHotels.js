// "use client";

// import { useCurrencyStore } from "@/modules/shared/store/currency.store";
// import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// import {
//   getHotelSearchResults,
//   startHotelSearch,
// } from "../services/hotel.service";

// const PAGE_SIZE = 20;
// const MAX_ATTEMPTS = 15;
// const RETRY_DELAY = 2000;

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// export const useInfiniteHotels = (params) => {
//   const currency = useCurrencyStore((state) => state.selectedCurrency.code);

//   const enabled = Boolean(
//     params?.locationId &&
//     params?.geoCode?.lat &&
//     params?.geoCode?.long &&
//     params?.checkIn &&
//     params?.checkOut,
//   );

//   // 1. Start the hotel search only once per query key.
//   const searchQuery = useQuery({
//     queryKey: ["hotelSearchStart", params, currency],

//     queryFn: async () => {
//       const response = await startHotelSearch({
//         ...params,
//         currency,
//       });

//       if (response?.success !== true || !response?.searchId) {
//         throw new Error("Failed to start hotel search.");
//       }

//       console.log("[Hotel Search] Started:", response.searchId);

//       return response;
//     },

//     enabled,
//     retry: false,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });

//   const searchId = searchQuery.data?.searchId;

//   // 2. Fetch hotel results with limited retries.
//   const hotelsQuery = useInfiniteQuery({
//     queryKey: ["hotels", searchId, currency],

//     enabled: Boolean(searchId),

//     initialPageParam: 1,

//     queryFn: async ({ pageParam }) => {
//       let response;

//       for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
//         console.log(`[Hotel Search] GET attempt ${attempt}/${MAX_ATTEMPTS}`, {
//           searchId,
//           page: pageParam,
//         });

//         response = await getHotelSearchResults(searchId, pageParam, PAGE_SIZE);

//         const result = response?.data;
//         const status = String(result?.status || "").toLowerCase();
//         const items = result?.items;

//         console.log("[Hotel Search] GET response:", {
//           status,
//           contentStatus: result?.contentStatus,
//           rateStatus: result?.rateStatus,
//           itemsCount: items?.length ?? 0,
//           page: result?.pagination?.page,
//           hasMore: result?.pagination?.hasMore,
//         });

//         // Return immediately when hotels are available,
//         // even if rate processing is still in progress.
//         if (Array.isArray(items) && items.length > 0) {
//           return response;
//         }

//         // Stop when the search reaches a terminal state.
//         if (["completed", "failed", "error"].includes(status)) {
//           return response;
//         }

//         // Retry only while the search is still processing.
//         const isProcessing = [
//           "processing",
//           "pending",
//           "inprogress",
//           "in_progress",
//         ].includes(status);

//         if (!isProcessing || attempt === MAX_ATTEMPTS) {
//           return response;
//         }

//         await delay(RETRY_DELAY);
//       }

//       return response;
//     },

//     getNextPageParam: (lastPage) => {
//       const pagination = lastPage?.data?.pagination;

//       if (!pagination?.hasMore) {
//         return undefined;
//       }

//       return Number(pagination.page) + 1;
//     },

//     retry: false,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });

//   // 3. Expose the existing query state to HotelList.
//   return {
//     ...hotelsQuery,

//     searchId,

//     isLoading: searchQuery.isPending || hotelsQuery.isLoading,

//     isError: searchQuery.isError || hotelsQuery.isError,

//     error: searchQuery.error || hotelsQuery.error,
//   };
// };

"use client";

import { useCurrencyStore } from "@/modules/shared/store/currency.store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getHotelSearchResults,
  startHotelSearch,
} from "../services/hotel.service";

const PAGE_SIZE = 20;

export const useInfiniteHotels = (params) => {
  const currency = useCurrencyStore((state) => state.selectedCurrency.code);

  const enabled = Boolean(
    params?.locationId &&
    params?.geoCode?.lat &&
    params?.geoCode?.long &&
    params?.checkIn &&
    params?.checkOut,
  );

  // 1. Start hotel search only once per query key.
  const searchQuery = useQuery({
    queryKey: ["hotelSearchStart", params, currency],

    queryFn: async () => {
      const response = await startHotelSearch({
        ...params,
        currency,
      });

      if (response?.success !== true || !response?.searchId) {
        throw new Error("Failed to start hotel search.");
      }

      console.log("[Hotel Search] Started:", response.searchId);

      return response;
    },

    enabled,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const searchId = searchQuery.data?.searchId;

  // 2. Fetch results once after searchId is available.
  const hotelsQuery = useInfiniteQuery({
    queryKey: ["hotels", searchId, currency],

    enabled: Boolean(searchId),

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      console.log("[Hotel Search] Fetching results:", {
        searchId,
        page: pageParam,
      });

      const response = await getHotelSearchResults(
        searchId,
        pageParam,
        PAGE_SIZE,
      );

      console.log("[Hotel Search] Results received:", {
        status: response?.data?.status,
        itemsCount: response?.data?.items?.length ?? 0,
        page: response?.data?.pagination?.page,
        hasMore: response?.data?.pagination?.hasMore,
      });

      return response;
    },

    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;

      if (!pagination?.hasMore) {
        return undefined;
      }

      return Number(pagination.page) + 1;
    },

    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...hotelsQuery,

    searchId,

    isLoading: searchQuery.isPending || hotelsQuery.isLoading,

    isError: searchQuery.isError || hotelsQuery.isError,

    error: searchQuery.error || hotelsQuery.error,
  };
};
