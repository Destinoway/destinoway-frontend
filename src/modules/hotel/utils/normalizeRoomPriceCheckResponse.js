const formatCurrency = (currency) =>
  currency === "INR" || currency === "₹" ? "₹" : currency || "₹";

export const normalizeRoomPriceCheckResponse = (
  responseData,
  {
    hotelDetailId = "",
    searchId = "",
    supplierHotelId = "",
    recommendationId = "",
  } = {},
) => {
  const apiRooms = Array.isArray(responseData?.pricing?.rooms)
    ? responseData.pricing.rooms
    : [];
  const rooms = apiRooms.map((room) => {
    const baseRate = Number(room?.price?.baseRate) || 0;
    const totalRate = Number(room?.price?.totalRate) || 0;

    return {
      ...room,
      roomType: room?.name || "Selected Room",
      inclusion: room?.boardBasis || "",
      guests: room?.occupancies || [],
      pricing: {
        basicAmount: baseRate,
        baseRate,
        tax: Math.max(totalRate - baseRate, 0),
        totalRate,
        totalAmount: totalRate,
        currency: formatCurrency(room?.price?.currency),
        currencyCode: room?.price?.currency || "INR",
      },
    };
  });
  const selectedRoom = rooms[0] || {};
  const refundable =
    responseData?.pricing?.refundable ?? selectedRoom?.refundable ?? false;

  return {
    ...responseData,
    hotelDetailId,
    searchId,
    supplierHotelId,
    hotelId: responseData?.hotel?.hotelId || "",
    name: responseData?.hotel?.name || "Hotel",
    location: { address: responseData?.hotel?.address || "" },
    starCategory: responseData?.hotel?.starCategory || 0,
    facilities: Array.isArray(responseData?.hotel?.facilities)
      ? responseData.hotel.facilities
      : [],
    checkIn: { date: responseData?.stay?.checkIn || "" },
    checkOut: { date: responseData?.stay?.checkOut || "" },
    refundable,
    rooms,
    pricing: {
      basicAmount: selectedRoom?.pricing?.basicAmount || 0,
      baseRate: selectedRoom?.pricing?.baseRate || 0,
      tax: selectedRoom?.pricing?.tax || 0,
      totalRate: selectedRoom?.pricing?.totalRate || 0,
      totalAmount: selectedRoom?.pricing?.totalAmount || 0,
      currency: selectedRoom?.pricing?.currency || "₹",
      currencyCode: selectedRoom?.pricing?.currencyCode || "INR",
      refundable,
    },
    selectedRoom,
    importantInformation: [],
    recommendationId,
  };
};
