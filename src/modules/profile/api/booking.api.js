import { api } from "@/services/axios";
import { normalizeBooking } from "../utils/normalizeBooking";

export const getMyBookingsApi = async () => {
  const response = await api.get("/get-booking-details");

  return response?.data?.data;
};

export const getBookingByIdApi = async (bookingRefNo) => {
  const response = await api.get(
    `/get-booking-details/${encodeURIComponent(bookingRefNo)}`,
  );

  return normalizeBooking(response?.data?.data);
};

export const downloadInvoiceApi = async (bookingRefNo) => {
  const response = await api.get(`/hotel/invoice/${bookingRefNo}`, {
    responseType: "blob",
  });

  return response.data;
};

export const cancelBookingApi = async (bookingRefNo) => {
  const response = await api.post("/hotel/cancel", {
    bookingRefNo,
  });

  return response.data;
};
