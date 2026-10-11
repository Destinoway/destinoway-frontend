import { api } from "@/services/axios";

const PAGE_SIZE = 20;

const FILTER_KEYS = [
  "search",
  "minPrice",
  "maxPrice",
  "starRatings",
  "starCategory",
  "amenities",
  "facility",
  "minReviewRating",
  "propertyType",
  "availableOnly",
  "isRecommended",
  "freeCancellation",
  "freeBreakfast",
  "sortBy",
  "sortOrder",
];

export const startHotelSearch = async (payload) => {
  // Never send result filters through POST.
  const searchPayload = { ...payload };

  FILTER_KEYS.forEach((key) => {
    delete searchPayload[key];
  });

  const { data } = await api.post("/hotelSearch/search", searchPayload);

  const searchId = data?.message?.searchId;

  if (data?.success !== true || !searchId) {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : "Failed to start hotel search.",
    );
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
  filters = {},
  sorting = {},
) => {
  if (!searchId) {
    throw new Error("searchId is required.");
  }

  const queryParams = {
    page,
    limit,
    ...filters,
    ...sorting,
  };

  ["starRatings", "amenities", "propertyType", "chainProperties"].forEach(
    (key) => {
      if (Array.isArray(queryParams[key])) {
        queryParams[key] = queryParams[key].join(",");
      }
    },
  );

  // Remove empty values, while preserving numeric zero and false.
  Object.keys(queryParams).forEach((key) => {
    const value = queryParams[key];

    if (value === undefined || value === null || value === "") {
      delete queryParams[key];
    }
  });

  const { data } = await api.get(
    `/hotelSearch/search/${encodeURIComponent(searchId)}`,
    { params: queryParams },
  );

  if (data?.success !== true) {
    throw new Error(data?.message || "Failed to fetch hotel search results.");
  }

  return data;
};

export const searchHotels = async (payload) => {
  return startHotelSearch(payload);
};
