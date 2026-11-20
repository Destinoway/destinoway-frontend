export const buildHotelDetailsPayload = ({ selectedHotel, initialPayload }) => {
  const hasInitialPayload = initialPayload != null;
  const fallbackSelectedHotel = hasInitialPayload ? {} : selectedHotel || {};
  const selectedHotelMeta = fallbackSelectedHotel?.hotelMeta || {};
  const initialHotelMeta = initialPayload?.hotelMeta || {};

  const hotelId = initialPayload?.hotelId || selectedHotelMeta?.hotelId || "";

  const hotelDetailId =
    initialPayload?.hotelDetailId ||
    initialHotelMeta?.hotelDetailId ||
    selectedHotelMeta?.hotelDetailId ||
    fallbackSelectedHotel?.hotelDetailId ||
    "";
  const searchId =
    initialPayload?.searchId ||
    selectedHotelMeta?.searchId ||
    fallbackSelectedHotel?.searchId ||
    "";
  const supplierHotelId =
    initialPayload?.supplierHotelId ||
    selectedHotelMeta?.supplierHotelId ||
    fallbackSelectedHotel?.supplierHotelId ||
    hotelId ||
    "";

  const payload = {
    hotelDetailId,
    hotelId,
    searchId,
    supplierHotelId,
  };

  return payload;
};
