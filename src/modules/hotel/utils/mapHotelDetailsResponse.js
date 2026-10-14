const getContentData = (response) => response?.data?.content?.data || {};

const getRoomPageData = (response) => response?.data?.rooms || {};

const normalizeDate = (value) => {
  if (typeof value !== "string") {
    return value || "";
  }

  const dateMatch = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (!dateMatch) {
    return value;
  }

  const [, month, day, year] = dateMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const getOccupancies = (contentResponse, contentData, hotel) => {
  const occupancies =
    contentResponse?.data?.occupancies ??
    contentData?.occupancies ??
    hotel?.occupancies;

  return Array.isArray(occupancies) ? occupancies : [];
};

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
  const contentData = getContentData(hotelResponse);
  const hotel = contentData?.hotel || {};
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
  const stayPeriod = {
    checkIn: normalizeDate(hotelResponse?.data?.stayPeriod?.checkIn ??
      hotelResponse?.data?.stayPeriod?.start),
    checkOut: normalizeDate(hotelResponse?.data?.stayPeriod?.checkOut ??
      hotelResponse?.data?.stayPeriod?.end),
  };
  const occupancies = getOccupancies(hotelResponse, contentData, hotel);
  const guestDetails = occupancies.reduce(
    (totals, occupancy) => ({
      roomCount: totals.roomCount + 1,
      adultCount: totals.adultCount + (Number(occupancy?.numOfAdults) || 0),
      childrenCount:
        totals.childrenCount + (Number(occupancy?.numOfChildren) || 0),
    }),
    { roomCount: 0, adultCount: 0, childrenCount: 0 },
  );

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
      stayPeriod,
      occupancies,
      guestDetails,
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
      stayPeriod,
      occupancies,
    },
    rawContent: contentData,
    rawRooms: pageData,
    rawStayPeriod: hotelResponse?.data?.stayPeriod || {},
    pagination: pageData?.pagination || {
      page: 1,
      limit: 20,
      total: recommendations.length,
      hasMore: false,
    },
    rawHotel: hotel,
  };
};
