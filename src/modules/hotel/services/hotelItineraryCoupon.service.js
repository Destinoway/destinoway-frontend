import { api } from "@/services/axios";

export const updateHotelItineraryCoupon = async ({
  itineraryId,
  couponCode,
}) => {
  if (!itineraryId) {
    throw new Error("Hotel itinerary is missing. Please refresh room pricing.");
  }

  const path = `/hoteltempBooking/itinerary/${encodeURIComponent(itineraryId)}/coupon`;
  const response = await api.post(path, {
    couponCode: couponCode || null,
  });
  const result = response?.data?.data ?? response?.data;

  if (response?.data?.success === false || result?.success === false) {
    throw new Error(
      response?.data?.message ||
        result?.message ||
        "Unable to update the coupon.",
    );
  }

  return result;
};
