import { api } from "@/services/axios";

export const HotelDetailApi = async ({
  searchId,
  supplierHotelId,
  page = 1,
  limit = 20,
}) => {
  if (!searchId || !supplierHotelId) {
    throw new Error("searchId and supplierHotelId are required.");
  }

  const { data } = await api.get(
    `/hotelDetails/search/${encodeURIComponent(searchId)}/${encodeURIComponent(
      supplierHotelId,
    )}/content`,
    { params: { page, limit } },
  );

  if (data?.success !== true) {
    throw new Error(data?.message || "Failed to fetch hotel details.");
  }

  const responseData = data?.data;
  const roomPage = responseData?.rooms?.data?.rooms;

  if (!Array.isArray(roomPage?.recommendations)) {
    throw new Error("Hotel details response did not include room results.");
  }

  if (page === 1 && !responseData?.content?.data?.hotel) {
    throw new Error("Hotel details response did not include hotel content.");
  }

  return data;
};
