export const buildRoomBookingUrl = ({
  hotelDetailId,
  searchId,
  supplierHotelId,
  recommendationId,
}) => {
  const params = new URLSearchParams({
    hotelDetailId: String(hotelDetailId || ""),
    searchId: String(searchId || ""),
    supplierHotelId: String(supplierHotelId || ""),
    recommendationId: String(recommendationId || ""),
    roomId: String(recommendationId || ""),
  });

  return `/hotel-booking?${params.toString()}`;
};
