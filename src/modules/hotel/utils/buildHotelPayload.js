import { formatSupplierDate } from "./supplierDate";

const SUPPORTED_DESTINATION_TYPES = new Set([
  "city",
  "multicity",
  "hotel",
  "airport",
  "trainstation",
  "pointofinterest",
  "neighborhood",
]);

export const buildHotelPayload = ({
  searchData,
  filters = {},
  sort = null,
}) => {
  const cityData = searchData?.cityData || {};

  const destinationType = String(cityData?.type || "city")
    .trim()
    .toLowerCase();

  const locationId = cityData?.supplierData?.supplierLocationId || cityData?.id;

  const latitude =
    cityData?.coordinates?.lat ??
    cityData?.geoCode?.lat ??
    cityData?.latitude ??
    cityData?.lat;

  const longitude =
    cityData?.coordinates?.long ??
    cityData?.coordinates?.lng ??
    cityData?.geoCode?.long ??
    cityData?.geoCode?.lng ??
    cityData?.longitude ??
    cityData?.lng ??
    cityData?.long;

  if (
    !searchData?.city ||
    !locationId ||
    latitude == null ||
    longitude == null ||
    !SUPPORTED_DESTINATION_TYPES.has(destinationType)
  ) {
    return null;
  }

  let rooms = [];

  if (
    Array.isArray(searchData?.roomGuests) &&
    searchData.roomGuests.length > 0
  ) {
    rooms = searchData.roomGuests.map((room) => {
      const children = Array.isArray(room?.children)
        ? room.children
            .map((child) => Number(child?.age))
            .filter((age) => Number.isFinite(age))
        : [];

      return {
        adults: Number(room?.adults) || 1,
        children: children.length,
        childAges: children,
      };
    });
  } else {
    const adults = Math.max(1, Number(searchData?.adults) || 1);
    const childrenCount = Math.max(0, Number(searchData?.children) || 0);

    const childAges = Array.isArray(searchData?.childAges)
      ? searchData.childAges
          .filter((age) => age !== "" && age != null)
          .map(Number)
          .filter(Number.isFinite)
      : [];

    const roomCount = Math.min(
      8,
      Math.max(
        Number(searchData?.rooms) || 1,
        Math.ceil(adults / 8),
        Math.ceil(childrenCount / 2),
        Math.ceil(adults / 4),
      ),
    );

    const actualRoomCount = Math.min(roomCount, adults);
    const baseAdults = Math.floor(adults / actualRoomCount);
    const extraAdults = adults % actualRoomCount;

    let ageIndex = 0;

    rooms = Array.from({ length: actualRoomCount }, (_, index) => {
      const roomAdults = baseAdults + (index < extraAdults ? 1 : 0);
      const maxChildren = 2;
      const roomChildAges = [];

      while (roomChildAges.length < maxChildren && ageIndex < childrenCount) {
        const age = childAges[ageIndex];
        ageIndex++;

        if (age !== undefined) {
          roomChildAges.push(age);
        }
      }

      return {
        adults: roomAdults,
        children: roomChildAges.length,
        childAges: roomChildAges,
      };
    });
  }

  const hotelName = filters?.search || "";
  const starCategory = filters?.starCategory || filters?.starRating || "";
  const minPrice = filters?.minPrice ?? "";
  const maxPrice = filters?.maxPrice ?? "";
  const amenities = filters?.amenities || [];

  let sortBy = "";
  let sortOrder = "";

  switch (sort) {
    case "recommended":
      sortBy = "isRecommended";
      sortOrder = "desc";
      break;

    case "ratingHigh":
      sortBy = "rating";
      sortOrder = "desc";
      break;

    case "ratingLow":
      sortBy = "rating";
      sortOrder = "asc";
      break;

    case "priceHigh":
      sortBy = "price";
      sortOrder = "desc";
      break;

    case "priceLow":
      sortBy = "price";
      sortOrder = "asc";
      break;

    default:
      break;
  }

  return {
    locationId: String(locationId),

    geoCode: {
      lat: String(latitude),
      long: String(longitude),
    },

    checkIn: formatSupplierDate(searchData?.checkIn),
    checkOut: formatSupplierDate(searchData?.checkOut),

    rooms,

    currency: "INR",
    nationality: "IN",
    countryOfResidence: "IN",

    hotelName,
    starRating: starCategory,
    minPrice,
    maxPrice,
    amenities,
    sortBy,
    sortOrder,
  };
};
