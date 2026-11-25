import { api } from "@/services/axios";

export const fetchBusSearchResultsApi = async (tui, signal) => {
  if (!tui) {
    throw new Error("TUI is required to fetch search results");
  }

  const response = await api.post(
    "/bus/search/results",
    { tui },
    { signal },
  );

  const payload = response?.data;

  if (payload?.success !== true || !Array.isArray(payload?.data?.buses)) {
    throw new Error("Invalid response from bus search results API");
  }

  return payload.data;
};
