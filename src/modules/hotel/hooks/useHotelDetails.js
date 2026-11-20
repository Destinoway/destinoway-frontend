"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { HotelContentApi, HotelRoomsApi } from "../services/hotelDetail.service";

const isValidPayload = (payload) =>
  Boolean(payload?.searchId && payload?.supplierHotelId);

const queryOptions = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export const useHotelContent = (payload, enabled = true) =>
  useQuery({
    queryKey: ["hotel-content", payload?.searchId, payload?.supplierHotelId],
    queryFn: () => HotelContentApi(payload),
    enabled: enabled && isValidPayload(payload),
    ...queryOptions,
  });

export const useHotelRooms = (payload, enabled = true) =>
  useInfiniteQuery({
    queryKey: ["hotel-rooms", payload?.searchId, payload?.supplierHotelId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      HotelRoomsApi({
        ...payload,
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.rooms?.pagination || {};
      const currentPage = Number(pagination.page || 1);
      const hasMore = Boolean(pagination.hasMore);

      if (!hasMore) {
        return undefined;
      }

      return currentPage + 1;
    },
    enabled: enabled && isValidPayload(payload),
    ...queryOptions,
  });
