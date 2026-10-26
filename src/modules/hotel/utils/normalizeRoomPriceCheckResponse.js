const formatCurrency = (currency) =>
  currency === "INR" || currency === "₹" ? "₹" : currency || "₹";

const getHotelImage = (hotel = {}) => {
  const image =
    hotel?.image ||
    hotel?.hotelImage ||
    hotel?.heroImage ||
    hotel?.images?.[0] ||
    hotel?.gallery?.[0];

  if (typeof image === "string") return image;
  return image?.url || image?.image || image?.ImageURL || image?.src || "";
};

const normalizeFacilities = (facilities) =>
  Array.isArray(facilities)
    ? facilities
        .map((facility) =>
          typeof facility === "string"
            ? facility
            : facility?.name || facility?.title || facility?.description || "",
        )
        .filter(Boolean)
    : [];

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
    const customerPrice = room?.customerPrice || {};
    const supplierPrice = room?.price || {};
    const baseRate =
      Number(customerPrice?.basePrice ?? supplierPrice?.baseRate) || 0;
    const totalRate =
      Number(customerPrice?.totalPrice ?? supplierPrice?.totalRate) || 0;
    const tax =
      Number(
        customerPrice?.["platform&servicetax"] ??
          supplierPrice?.tax ??
          Math.max(totalRate - baseRate, 0),
      ) || 0;

    return {
      ...room,
      roomType: room?.name || "Selected Room",
      inclusion: room?.boardBasis || "",
      guests: room?.occupancies || [],
      pricing: {
        ...customerPrice,
        basicAmount: baseRate,
        baseRate,
        tax,
        totalRate,
        totalAmount: totalRate,
        currency: formatCurrency(
          customerPrice?.currency || supplierPrice?.currency,
        ),
        currencyCode: customerPrice?.currency || supplierPrice?.currency || "INR",
        priceDetails: customerPrice,
        supplierPrice,
      },
    };
  });
  const selectedRoom = rooms[0] || {};
  const occupancies =
    responseData?.occupancies?.length > 0
      ? responseData.occupancies
      : selectedRoom?.occupancies || [];
  const normalizedOccupancies = occupancies.map((occupancy, index) => ({
    ...occupancy,
    roomNo: index + 1,
    adults: Number(occupancy?.numOfAdults ?? occupancy?.adults) || 0,
    children:
      Number(occupancy?.numOfChildren ?? occupancy?.children?.length) || 0,
    childAges: Array.isArray(occupancy?.childAges)
      ? occupancy.childAges
      : [],
  }));
  const refundable =
    responseData?.pricing?.refundable ?? selectedRoom?.refundable ?? false;
  const hotel = responseData?.hotel || {};
  const selectedPricing = selectedRoom?.pricing || {};

  return {
    ...responseData,
    itineraryId:
      responseData?.itineraryId ??
      responseData?.pricing?.itineraryId ??
      selectedRoom?.itineraryId ??
      "",
    hotelDetailId,
    searchId,
    supplierHotelId,
    hotelId: hotel?.hotelId || "",
    name: hotel?.name || "Hotel",
    image: getHotelImage(hotel),
    hotel: {
      ...hotel,
      image: getHotelImage(hotel),
      facilities: normalizeFacilities(hotel?.facilities),
    },
    location: {
      address: hotel?.address || "",
      city: hotel?.city || "",
      state: hotel?.state || "",
      country: hotel?.country || "",
    },
    starCategory: Number(hotel?.starCategory) || 0,
    facilities: normalizeFacilities(hotel?.facilities),
    isPANRequired: responseData?.isPANRequired === true,
    checkIn: { date: responseData?.stay?.checkIn || "" },
    checkOut: { date: responseData?.stay?.checkOut || "" },
    occupancies: normalizedOccupancies,
    refundable,
    rooms,
    pricing: {
      ...selectedPricing,
      refundable,
    },
    availableCoupons: Array.isArray(responseData?.availableCoupons)
      ? responseData.availableCoupons
      : [],
    appliedCoupon:
      responseData?.appliedCoupon ??
      selectedRoom?.pricing?.priceDetails?.appliedCouponCode ??
      "",
    couponDiscount:
      Number(
        responseData?.couponDiscount ??
          selectedRoom?.pricing?.priceDetails?.couponDiscount,
      ) || 0,
    totalPayable: Number(responseData?.totalPayable) || 0,
    currency: formatCurrency(responseData?.currency),
    selectedRoom,
    importantInformation: [],
    recommendationId,
  };
};
