import { api } from "@/services/axios";

export const searchDestinationApi = async (searchText = "", signal) => {
  const searchInput = searchText.trim();

  // Do not call the API for empty or short queries.
  if (searchInput.length < 2) {
    return [];
  }

  const response = await api.post(
    "/destination/search",
    { searchInput },
    { signal },
  );

  const payload = response?.data;

  // Validate the API response before returning results.
  if (payload?.success !== true || !Array.isArray(payload?.data)) {
    throw new Error("Invalid response received from destination search API.");
  }

  return payload.data;
};
