const getContentData = (response) => response?.data?.content?.data || {};

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

const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const normalizeImage = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value.url || value.image || value.ImageURL || value.src || "";
  }

  return "";
};

const getOptionalBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return null;
};

const getField = (room, roomGroup, recommendation, field) =>
  room?.[field] ?? roomGroup?.[field] ?? recommendation?.[field] ?? null;

const getOccupancies = (contentResponse, contentData, hotel) => {
  const occupancies =
    contentResponse?.data?.occupancies ??
    contentData?.occupancies ??
    hotel?.occupancies;

  return Array.isArray(occupancies) ? occupancies : [];
};

const getRoomRecommendationPages = (roomResponse) => {
  if (Array.isArray(roomResponse?.pages)) {
    return roomResponse.pages;
  }

  if (roomResponse && (roomResponse?.data?.rooms || roomResponse?.rooms)) {
    return [roomResponse];
  }

  return [];
};

const getRoomPageData = (roomResponse) => {
  const pages = getRoomRecommendationPages(roomResponse);

  if (!pages.length) {
    return { recommendations: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
  }

  const lastPage = pages[pages.length - 1];
  const pageData = lastPage?.data?.rooms || lastPage?.rooms || {};
  const recommendations = Array.isArray(pageData?.recommendations)
    ? pageData.recommendations
    : [];

  return {
    ...pageData,
    recommendations,
    pagination: pageData?.pagination || {
      page: 1,
      limit: 20,
      total: recommendations.length,
      hasMore: false,
    },
  };
};

const getRoomRecommendationList = (roomResponse) => {
  const pages = getRoomRecommendationPages(roomResponse);

  return pages.flatMap((page) => {
    const roomPage = page?.data?.rooms || page?.rooms || {};
    return Array.isArray(roomPage?.recommendations) ? roomPage.recommendations : [];
  });
};

const mapRatePlan = (recommendation = {}, roomGroup = {}) => {
  const room = roomGroup?.room || {};
  const recommendationId = recommendation?.id || roomGroup?.id || "";
  const roomGroupId = roomGroup?.id || "";
  const baseRate = Number(roomGroup?.baseRate ?? recommendation?.baseRate ?? 0);
  const totalRate = Number(roomGroup?.totalRate ?? recommendation?.totalRate ?? 0);
  const tax = Number(roomGroup?.tax ?? recommendation?.tax ?? 0);
  const roomImages = Array.isArray(room?.images)
    ? room.images
        .map((item) => normalizeImage(item))
        .filter(Boolean)
    : [];
  const roomName =
    room?.standardRoomName || room?.name || roomGroup?.standardRoomName || roomGroup?.name || "";
  const optionalBoolean = (field) =>
    getOptionalBoolean(getField(room, roomGroup, recommendation, field));

  return {
    id: recommendationId,
    recommendationId,
    roomGroupId,
    roomId: recommendationId || roomGroupId || "",
    roomType: roomName || "Room option",
    roomDescription: room?.description || roomGroup?.description || "",
    description: room?.description || roomGroup?.description || "",
    images: roomImages,
    isHold: optionalBoolean("isHold"),
    isGSTInvoiceAvailable: optionalBoolean("isGSTInvoiceAvailable"),
    isPANRequired: optionalBoolean("isPANRequired"),
    isPreffered: optionalBoolean("isPreffered"),
    roomCount: getField(room, roomGroup, recommendation, "roomCount"),
    availability:
      getField(room, roomGroup, recommendation, "availability") ??
      getField(room, roomGroup, recommendation, "availableRooms"),
    refundability: getField(room, roomGroup, recommendation, "refundability"),
    refundable: optionalBoolean("refundable"),
    allGuestsInfoRequired: optionalBoolean("allGuestsInfoRequired"),
    onlineCancellable: optionalBoolean("onlineCancellable"),
    payAtHotel: optionalBoolean("payAtHotel"),
    cardRequired: optionalBoolean("cardRequired"),
    guaranteeRequired: optionalBoolean("guaranteeRequired"),
    bookNowPayLaterDate: getField(room, roomGroup, recommendation, "bookNowPayLaterDate"),
    policies: getField(room, roomGroup, recommendation, "policies"),
    boardBasis: getField(room, roomGroup, recommendation, "boardBasis"),
    includes: getField(room, roomGroup, recommendation, "includes"),
    smokingAllowed: optionalBoolean("smokingAllowed"),
    maxGuestAllowed: getField(room, roomGroup, recommendation, "maxGuestAllowed"),
    maxAdultAllowed: getField(room, roomGroup, recommendation, "maxAdultAllowed"),
    maxChildrenAllowed: getField(room, roomGroup, recommendation, "maxChildrenAllowed"),
    area: getField(room, roomGroup, recommendation, "area"),
    views: getField(room, roomGroup, recommendation, "views"),
    type: getField(room, roomGroup, recommendation, "type"),
    beds: asArray(getField(room, roomGroup, recommendation, "beds")),
    facilities: asArray(getField(room, roomGroup, recommendation, "facilities")),
    pricing: {
      basicAmount: baseRate,
      baseRate,
      tax,
      totalRate,
      totalAmount: totalRate,
      currency: roomGroup?.currency || recommendation?.currency || "INR",
    },
  };
};

export const mapHotelDetailsResponse = (hotelResponse, roomResponse) => {
  const contentData = getContentData(hotelResponse);
  const hotel = contentData?.hotel || {};
  const pageData = getRoomPageData(roomResponse);
  const recommendations = getRoomRecommendationList(roomResponse);
  const roomPlans = recommendations.flatMap((recommendation) => {
    const roomGroups = Array.isArray(recommendation?.roomGroup)
      ? recommendation.roomGroup
      : recommendation?.roomGroup
        ? [recommendation.roomGroup]
        : [];

    return roomGroups.map((roomGroup) => mapRatePlan(recommendation, roomGroup));
  });

  const address = hotel?.contact?.address || {};
  const descriptions = Array.isArray(hotel?.descriptions)
    ? hotel.descriptions.map((item) => item?.text).filter(Boolean)
    : [];
  const images = Array.isArray(hotel?.images)
    ? hotel.images
        .map((item) => normalizeImage(item))
        .filter(Boolean)
    : [];
  const hotelId = hotel?.id || "";
  const searchId = hotelResponse?.data?.searchId || "";
  const stayPeriod = {
    checkIn: normalizeDate(
      hotelResponse?.data?.stayPeriod?.checkIn ??
        hotelResponse?.data?.stayPeriod?.start ??
        "",
    ),
    checkOut: normalizeDate(
      hotelResponse?.data?.stayPeriod?.checkOut ??
        hotelResponse?.data?.stayPeriod?.end ??
        "",
    ),
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
      total: roomPlans.length,
      hasMore: false,
    },
    rawHotel: hotel,
  };
};
