import { api } from "@/services/axios";

export const getStatesApi = async (countryCode, search = "") => {
  const response = await api.get(
    `/states/${encodeURIComponent(countryCode)}?search=${encodeURIComponent(search)}`,
  );

  return response?.data?.data || [];
};
