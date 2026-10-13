"use client";

import { useQuery } from "@tanstack/react-query";

import { HotelDetailApi } from "../services/hotelDetail.service";

export const useHotelDetails = (payload, page = 1, enabled = true) => {
  return useQuery({
    queryKey: [
      "hotel-details",
      payload?.searchId,
      payload?.supplierHotelId,
      page,
    ],

    queryFn: () => HotelDetailApi({ ...payload, page, limit: 20 }),

    enabled:
      enabled && Boolean(payload?.searchId) && Boolean(payload?.supplierHotelId),

    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
