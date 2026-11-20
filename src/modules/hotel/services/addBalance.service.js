import { api } from "@/services/axios";

export const addBalance = async (payload) => {
  try {
    const response = await api.post("/AddBalance", payload);

    return response.data;
  } catch (error) {
    console.error("Wallet balance update failed.");

    throw new Error(error?.response?.data?.message || "Payment failed");
  }
};
