import { serverApi } from "@/services/serverApi";

export const searchDestinationServer = async (searchText = "") => {
  try {
    const response = await serverApi.post("/destination/search", {
      searchInput: searchText,
    });

    return response?.data?.data || [];
  } catch {
    console.error("Destination search request failed.");

    return [];
  }
};
