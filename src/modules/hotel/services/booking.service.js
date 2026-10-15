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
      throw new Error(response.data.message || "Booking failed");
    }

    return response.data;
  } catch (error) {
    console.error("HOTEL BOOKING ERROR:", error);

    throw new Error(error?.response?.data?.message || error?.message || "Booking failed");
  }
};
