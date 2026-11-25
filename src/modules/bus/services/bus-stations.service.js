import { api } from "@/services/axios";

export const searchBusStationsApi = async (searchText = "", type = "from", signal) => {
  const searchInput = searchText.trim();

  if (searchInput.length < 2) {
    return [];
  }

  const response = await api.post(
    "/bus/stations",
    { term: searchInput, type },
    { signal },
  );

  const payload = response?.data;

  if (payload?.success !== true || !Array.isArray(payload?.data)) {
    throw new Error("Invalid response received from bus stations API.");
  }

  return payload.data;
};
