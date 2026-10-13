export const buildHotelDetailsPayload = ({ selectedHotel, initialPayload }) => {
  const selectedHotelMeta = selectedHotel?.hotelMeta || {};

  const initialHotelMeta = initialPayload?.hotelMeta || {};

  const hotelId = initialPayload?.hotelId || selectedHotelMeta?.hotelId || "";

  const hotelDetailId =
    initialPayload?.hotelDetailId ||
    initialHotelMeta?.hotelDetailId ||
    selectedHotelMeta?.hotelDetailId ||
    selectedHotel?.hotelDetailId ||
    "";
  const searchId =
    initialPayload?.searchId ||
    selectedHotelMeta?.searchId ||
    selectedHotel?.searchId ||
    "";
  const supplierHotelId =
    initialPayload?.supplierHotelId ||
    selectedHotelMeta?.supplierHotelId ||
    selectedHotel?.supplierHotelId ||
    "";

  const payload = {
    hotelDetailId,
    hotelId,
    searchId,
    supplierHotelId,
  };

  return payload;
};
