import { api } from "@/services/axios";

const timeout = 15000;

function readData({ data }) {
  if (data?.success !== true || !data.data) {
    throw new Error(data?.message || "Bus booking request failed.");
  }
  return data.data;
}

export async function createBusItinerary(payload) {
  const itinerary = readData(await api.post("/bus/travel-itinerary", payload, { timeout }));
  if (!itinerary.bookingId) throw new Error("Missing bus booking reference.");
  return itinerary;
}

const paymentPath = (bookingId) => `/bus/payments/${encodeURIComponent(bookingId)}`;

export async function createBusPaymentOrder(bookingId) {
  const { checkout } = readData(await api.post(`${paymentPath(bookingId)}/order`, undefined, { timeout }));
  if (!checkout?.keyId || !checkout.orderId || !Number.isInteger(checkout.amount) ||
      checkout.amount <= 0 || !checkout.currency) {
    throw new Error("Invalid Razorpay order.");
  }
  return checkout;
}

export async function verifyBusPayment(bookingId, payment) {
  return readData(await api.post(`${paymentPath(bookingId)}/verify`, payment, { timeout }));
}

export async function fetchBusPaymentStatus(bookingId) {
  return readData(await api.get(`${paymentPath(bookingId)}/status`, { timeout }));
}
