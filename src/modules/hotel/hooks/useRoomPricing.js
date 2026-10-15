"use client";

import { useQuery } from "@tanstack/react-query";
import { checkRoomPrice } from "../services/roomPricing.service";

export const useRoomPricing = ({
  hotelDetailId = "",
  searchId = "",
  supplierHotelId = "",
  recommendationId = "",
}) => {
  return useQuery({
    queryKey: [
      "hotel-room-price-check",
      searchId,
      supplierHotelId,
      recommendationId,
    ],
    queryFn: () =>
      checkRoomPrice({
        hotelDetailId,
        searchId,
        supplierHotelId,
        recommendationId,
      }),

    enabled: Boolean(searchId && supplierHotelId && recommendationId),

    staleTime: 0,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
