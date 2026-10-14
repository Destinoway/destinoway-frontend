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

const asStringList = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }
        if (item && typeof item === "object") {
          return item?.description || item?.name || item?.title || item?.value || "";
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeImage = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value.url || value.image || value.ImageURL || value.src || "";
  }

  return "";
};

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

const mapRatePlan = (recommendation = {}) => {
  const roomGroup = Array.isArray(recommendation?.roomGroup)
    ? recommendation.roomGroup[0] || {}
    : recommendation?.roomGroup || {};
  const room = roomGroup?.room || {};
  const recommendationId = recommendation?.id || roomGroup?.id || "";
  const roomGroupId = roomGroup?.id || "";
  const baseAmount = Number(
    roomGroup?.baseRate ?? roomGroup?.minSellingRate ?? recommendation?.baseRate ?? 0,
  );
  const totalAmount = Number(
    recommendation?.total ??
      roomGroup?.totalRate ??
      roomGroup?.minSellingRate ??
      roomGroup?.baseRate ??
      0,
  );
  const roomImages = Array.isArray(room?.images)
    ? room.images
        .map((item) => normalizeImage(item))
        .filter(Boolean)
    : [];

  const inclusionValues = asArray(roomGroup?.includes)
    .concat(asArray(roomGroup?.boardBasis))
    .concat(asArray(roomGroup?.mealPlan))
    .concat(asStringList(roomGroup?.boardBasis?.description));

  const additionalInfo = asArray(roomGroup?.additionalCharges)
    .concat(asArray(recommendation?.additionalCharges))
    .concat(asStringList(roomGroup?.policies))
    .concat(asStringList(roomGroup?.notes));

  const cancellationPolicy =
    roomGroup?.cancellationPolicies ??
    roomGroup?.policies ??
    recommendation?.cancellationPolicy ??
    null;

  return {
    id: recommendationId,
    recommendationId,
    roomGroupId,
    roomId: recommendationId || roomGroupId || "",
    roomType:
      room?.name ||
      room?.standardRoomName ||
      roomGroup?.name ||
      roomGroup?.description ||
      "Room option",
    roomDescription: room?.description || roomGroup?.description || "",
    description: room?.description || roomGroup?.description || "",
    images: roomImages,
    inclusion: inclusionValues.length ? inclusionValues : asStringList(roomGroup?.boardBasis?.description),
    additionalInfo: additionalInfo.length ? additionalInfo : [],
    cancellationPolicy,
    payment: {
      creditCardRequired: Boolean(roomGroup?.cardRequired || roomGroup?.creditCardRequired),
      panMandatory: Boolean(
        recommendation?.isPANRequired ||
          roomGroup?.isPANRequired ||
          roomGroup?.panMandatory ||
          roomGroup?.panRequired,
      ),
    },
    refundable: Boolean(roomGroup?.refundable ?? roomGroup?.refundability),
    availability: roomGroup?.availability ?? recommendation?.availability ?? null,
    pricing: {
      basicAmount: baseAmount || totalAmount || 0,
      tax: totalAmount > baseAmount ? totalAmount - baseAmount : 0,
      totalAmount,
      currency: roomGroup?.currency || recommendation?.currency || "INR",
    },
    rawRecommendation: recommendation,
    rawRoomGroup: roomGroup,
  };
};

export const mapHotelDetailsResponse = (hotelResponse, roomResponse) => {
  const contentData = getContentData(hotelResponse);
  const hotel = contentData?.hotel || {};
  const pageData = getRoomPageData(roomResponse);
  const recommendations = getRoomRecommendationList(roomResponse);
  const roomPlans = recommendations.map(mapRatePlan);

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
