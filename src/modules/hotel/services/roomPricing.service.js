import { api } from "@/services/axios";
import { normalizeRoomPriceCheckResponse } from "../utils/normalizeRoomPriceCheckResponse";

export const checkRoomPrice = async ({
  searchId,
  supplierHotelId,
  recommendationId,
  hotelDetailId = "",
}) => {
  if (!searchId || !supplierHotelId || !recommendationId) {
    throw new Error(
      "Hotel search and room recommendation details are required.",
    );
  }

  try {
    const path = `/hotelDetails/search/${encodeURIComponent(searchId)}/${encodeURIComponent(supplierHotelId)}/price-check`;
    const { data } = await api.post(path, { recommendationId });

    if (data?.success !== true || !data?.data) {
      throw new Error(data?.message || "Unable to verify room price.");
    }

    if (
      !Array.isArray(data?.data?.pricing?.rooms) ||
      !data.data.pricing.rooms.length
    ) {
      throw new Error("Price check did not return a selected room.");
    }

    return normalizeRoomPriceCheckResponse(data.data, {
      hotelDetailId,
      searchId,
      supplierHotelId,
      recommendationId,
    });
  } catch (error) {
    const message = error?.response?.data?.message || error?.message;
    throw new Error(message || "Unable to verify room price.");
  }
};
