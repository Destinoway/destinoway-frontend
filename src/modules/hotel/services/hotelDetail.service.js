import { api } from "@/services/axios";

const buildHotelDetailsPath = ({ searchId, supplierHotelId }) => {
  if (!searchId || !supplierHotelId) {
    throw new Error("searchId and supplierHotelId are required.");
  }

  return `/hotelDetails/search/${encodeURIComponent(searchId)}/${encodeURIComponent(
    supplierHotelId,
  )}`;
};

export const HotelContentApi = async (payload) => {
  const { data } = await api.get(`${buildHotelDetailsPath(payload)}/content`);

  if (data?.success !== true) {
    throw new Error(data?.message || "Failed to fetch hotel content.");
  }

  if (!data?.data?.content?.data?.hotel) {
    throw new Error("Hotel content response did not include hotel content.");
  }

  return data;
};

export const HotelRoomsApi = async ({
  searchId,
  supplierHotelId,
  page = 1,
  limit = 20,
}) => {
  const path = buildHotelDetailsPath({ searchId, supplierHotelId });
  const { data } = await api.get(`${path}/rooms`, { params: { page, limit } });

  if (data?.success !== true) {
    throw new Error(data?.message || "Failed to fetch hotel rooms.");
  }

  const roomPage = data?.data?.rooms;
  if (!Array.isArray(roomPage?.recommendations)) {
    throw new Error("Hotel rooms response did not include room results.");
  }

  return data;
};
