const getPageData = (response) => response?.data?.content?.data || {};

const getRoomPageData = (response) =>
  response?.data?.rooms?.data?.rooms ||
  getPageData(response)?.rooms?.data?.rooms ||
  {};

const mapRatePlan = (recommendation = {}) => {
  const roomGroup = recommendation?.roomGroup?.[0] || {};
  const room = roomGroup?.room || {};
  const totalAmount = Number(recommendation?.total ?? roomGroup?.totalRate) || 0;
  const basicAmount = Number(roomGroup?.baseRate) || totalAmount;
  const images = Array.isArray(room?.images) ? room.images : [];

  return {
    id: recommendation?.id || "",
    roomId: recommendation?.id || roomGroup?.id || "",
    roomType:
      room?.name ||
      room?.standardRoomName ||
      roomGroup?.description ||
      "Room option",
    roomDescription: room?.description || roomGroup?.description || "",
    description: room?.description || roomGroup?.description || "",
    images,
    inclusion:
      roomGroup?.boardBasis?.description ||
      (Array.isArray(roomGroup?.includes) ? roomGroup.includes : ""),
    additionalInfo: roomGroup?.additionalCharges || "",
    cancellationPolicy:
      roomGroup?.cancellationPolicies || roomGroup?.policies || null,
    payment: {
      creditCardRequired: Boolean(roomGroup?.cardRequired),
      panMandatory: Boolean(recommendation?.isPANRequired),
    },
    refundable: Boolean(roomGroup?.refundable),
    pricing: {
      basicAmount,
      tax: Math.max(0, totalAmount - basicAmount),
      totalAmount,
      currency: "INR",
    },
    rawRecommendation: recommendation,
  };
};

export const mapHotelDetailsResponse = (hotelResponse, roomResponse) => {
  const hotel = getPageData(hotelResponse)?.hotel || {};
  const pageData = getRoomPageData(roomResponse);
  const recommendations = Array.isArray(pageData?.recommendations)
    ? pageData.recommendations
    : [];

  const address = hotel?.contact?.address || {};
  const descriptions = Array.isArray(hotel?.descriptions)
    ? hotel.descriptions.map((item) => item?.text).filter(Boolean)
    : [];
  const images = Array.isArray(hotel?.images)
    ? hotel.images.map((item) => item?.url).filter(Boolean)
    : [];
  const hotelId = hotel?.id || "";
  const searchId = hotelResponse?.data?.searchId || "";
  const roomPlans = recommendations.map(mapRatePlan);

  return {
    searchKey: searchId,
    hotel: {
      hotelId,
      hotelKey: String(hotelId),
      name: hotel?.name || "",
      description: descriptions.join("<br /><br />"),
      starCategory: hotel?.starRating || 0,
      image: hotel?.heroImage || images[0] || "",
      location: {
        address: [address?.line1, address?.line2].filter(Boolean).join(", "),
        city: address?.city || "",
        state: address?.state || "",
        country: address?.country || "",
        latitude: hotel?.geoCode?.lat ?? null,
        longitude: hotel?.geoCode?.long ?? null,
      },
      contact: {
        phone: hotel?.contact?.phones?.[0] || "",
        email: "",
      },
      pricing: roomPlans[0]?.pricing || {},
      checkIn: hotel?.checkinInfo || {},
      checkOut: hotel?.checkoutInfo || {},
      supplier: hotelResponse?.data?.supplier || "",
      facilities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
    },
    details: {
      aboutHotel: descriptions.join("<br /><br />"),
      amenities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
      gallery: images,
      importantInformation: {
        instructions: hotel?.checkinInfo?.instructions || [],
        specialInstructions: hotel?.checkinInfo?.specialInstructions || [],
        fees: hotel?.fees || [],
        policies: hotel?.policies || [],
      },
      rooms: roomPlans,
    },
    pagination: pageData?.pagination || {
      page: 1,
      limit: 20,
      total: recommendations.length,
      hasMore: false,
    },
    rawHotel: hotel,
  };
};
