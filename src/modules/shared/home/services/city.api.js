import { api } from "@/services/axios";

export const getCitiesApi = async (countryCode, state, search = "") => {
  const params = new URLSearchParams({ countryCode, state, search });
  const response = await api.get(`/cities?${params.toString()}`);

  return response?.data?.data || [];
};
