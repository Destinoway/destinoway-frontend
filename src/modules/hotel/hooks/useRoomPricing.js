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

    // Price-check is a POST that creates an itinerary; React Query's default
    // retry (3x) would silently create extra itineraries on failure.
    retry: false,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
