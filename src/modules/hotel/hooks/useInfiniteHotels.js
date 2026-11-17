"use client";

import { useCurrencyStore } from "@/modules/shared/store/currency.store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getHotelSearchResults,
  startHotelSearch,
} from "../services/hotel.service";

const PAGE_SIZE = 20;

const FILTER_KEYS = [
  "hotelId",
  "hotelName",
  "minPrice",
  "maxPrice",
  "starRatings",
  "starRating",
  "amenities",
  "minReviewRating",
  "propertyType",
  "availableOnly",
  "isRecommended",
  "freeCancellation",
  "freeBreakfast",
  "search",
  "starCategory",
  "facility",
  "chainProperties",
  "sortBy",
  "sortOrder",
];

const removeFilters = (params = {}) => {
  const result = { ...params };

  FILTER_KEYS.forEach((key) => {
    delete result[key];
  });

  return result;
};

export const useInfiniteHotels = (params, filters = {}, sorting = {}) => {
  const currency = useCurrencyStore((state) => state.selectedCurrency.code);

  const searchParams = removeFilters(params);

  const enabled = Boolean(
    searchParams?.locationId &&
    searchParams?.geoCode?.lat &&
    searchParams?.geoCode?.long &&
    searchParams?.checkIn &&
    searchParams?.checkOut,
  );

  const resolvedFilters = {
    hotelName: filters.search ?? params?.hotelName,
    minPrice: filters.minPrice ?? params?.minPrice,
    maxPrice: filters.maxPrice ?? params?.maxPrice,
    starRatings:
      filters.starRatings ?? params?.starRatings ?? params?.starCategory,
    starRating: filters.starRating ?? params?.starRating,
    amenities: filters.amenities ?? params?.amenities ?? params?.facility,
    chainProperties: filters.chainProperties,
    minReviewRating: filters.minReviewRating,
    propertyType: filters.propertyType,
    availableOnly: filters.availableOnly,
    isRecommended: filters.isRecommended,
    freeCancellation: filters.freeCancellation,
    freeBreakfast: filters.freeBreakfast,
  };

  const resolvedSorting = {
    sortBy: sorting?.sortBy ?? params?.sortBy,
    sortOrder: sorting?.sortOrder ?? params?.sortOrder,
  };

  // POST: searchId generation only.
  const searchQuery = useQuery({
    queryKey: ["hotelSearchStart", searchParams, currency],

    queryFn: async () => {
      const response = await startHotelSearch({
        ...searchParams,
        currency,
      });

      if (!response?.success || !response?.searchId) {
        throw new Error("Failed to start hotel search.");
      }

      return response;
    },

    enabled,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const searchId = searchQuery.data?.searchId;

  // GET: filters and sorting.
  const hotelsQuery = useInfiniteQuery({
    queryKey: ["hotels", searchId, currency, resolvedFilters, resolvedSorting],

    enabled: Boolean(searchId),
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getHotelSearchResults(
        searchId,
        pageParam,
        PAGE_SIZE,
        resolvedFilters,
        resolvedSorting,
      ),

    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;

      return pagination?.hasMore ? Number(pagination.page) + 1 : undefined;
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
