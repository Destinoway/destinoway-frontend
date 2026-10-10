import { api } from "@/services/axios";

const PAGE_SIZE = 20;

export const startHotelSearch = async (payload) => {
  const { data } = await api.post("/hotelSearch/search", payload);

  const searchId = data?.message?.searchId;

  if (data?.success !== true || !searchId) {
    throw new Error(data?.message || "Failed to start hotel search.");
  }

  return {
    ...data,
    searchId,
  };
};
export const getHotelSearchResults = async (
  searchId,
  page = 1,
  limit = PAGE_SIZE,
) => {
  if (!searchId) {
    throw new Error("searchId is required.");
  }

  const { data } = await api.get(
    `/hotelSearch/search/${encodeURIComponent(searchId)}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  if (data?.success !== true) {
    throw new Error(data?.message || "Failed to fetch hotel search results.");
  }

  return data;
};

// Keep the old export temporarily for compatibility
export const searchHotels = async (payload) => {
  return startHotelSearch(payload);
};
