import { api } from "@/services/axios";

// Create Razorpay Order
export const createBookingOrderApi = async ({ bookingId }) => {
  const response = await api.post(
    `/hotel-payments/bookings/${encodeURIComponent(bookingId)}/order`,
    { gateway: "razorpay" },
  );
  return response.data.data;
};

// Verify Razorpay Payment
export const verifyBookingPaymentApi = async (payload) => {
  const response = await api.post("/hotel-payments/verify", payload);
  return response.data;
};
