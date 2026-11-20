"use client";

import { useQuery } from "@tanstack/react-query";
import { getItineraryPricing } from "../services/roomPricing.service";

// Runs after price-check returns an itineraryId; refetched after coupon changes.
export const useItineraryPricing = (itineraryId = "") => {
  return useQuery({
    queryKey: ["hotel-itinerary-pricing", itineraryId],
    queryFn: () => getItineraryPricing(itineraryId),
    enabled: Boolean(itineraryId),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
