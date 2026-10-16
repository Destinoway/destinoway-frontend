import { api } from "@/services/axios";

export const createBooking = async (payload) => {
  const { searchId, supplierHotelId, ...bookingPayload } = payload || {};
  if (!searchId || !supplierHotelId || !bookingPayload?.recommendationId) {
    throw new Error("Hotel search and room recommendation details are required.");
  }
  try {
    const path = `/hoteltempBooking/search/${encodeURIComponent(searchId)}/${encodeURIComponent(supplierHotelId)}/itinerary`;
    const response = await api.post(path, bookingPayload);

    if (response?.data?.success === false) {
      const error = new Error(response.data.message || "Booking failed");
      error.backendError = response.data.error || null;
      throw error;
    }

    return response.data;
  } catch (error) {
    console.error("Hotel itinerary request failed", {
      searchId,
      supplierHotelId,
      recommendationId: bookingPayload?.recommendationId,
      httpStatus: error?.response?.status,
      backendStatus: error?.backendError?.statusCode || error?.response?.data?.error?.statusCode,
      message: error?.response?.data?.message || error?.message || "Booking failed",
    });

    throw new Error(error?.response?.data?.message || error?.message || "Booking failed");
  }
};
