"use client";

import { useQuery } from "@tanstack/react-query";

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

export const useHotelRooms = (payload, page = 1, enabled = true) =>
  useQuery({
    queryKey: [
      "hotel-rooms",
      payload?.searchId,
      payload?.supplierHotelId,
      page,
    ],
    queryFn: () => HotelRoomsApi({ ...payload, page, limit: 20 }),
    enabled: enabled && isValidPayload(payload),
    placeholderData: (previousData) => previousData,
    ...queryOptions,
  });
