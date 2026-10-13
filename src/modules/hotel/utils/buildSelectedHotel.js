import { slugify } from "@/utils/slug/slugify";

export const buildSelectedHotel = ({ hotel = {}, searchData = {} }) => {
  const hotelId =
    hotel?.id || hotel?.hotelId || hotel?.HotelId || "";

  const hotelDetailId = hotel?.hotelDetailId || "";
  const searchId = hotel?.searchId || "";
  const supplierHotelId =
    hotel?.supplierHotelId ||
    hotel?.supplierHotelID ||
    hotel?.id ||
    hotel?.hotelId ||
    hotel?.HotelId ||
    "";

  const hotelName =
    hotel?.name ||
    hotel?.hotelName ||
    hotel?.HotelName ||
    "";

  const cityData = searchData?.cityData || {};

  const hotelLocation = hotel?.location || {};

  const cityName =
    cityData?.city ||
    cityData?.name ||
    searchData?.city ||
    hotelLocation?.city ||
    "";

  const stateName =
    cityData?.state ||
    cityData?.stateName ||
    hotelLocation?.state ||
    "";

  const country =
    cityData?.country ||
    hotelLocation?.country ||
    "";

  const countryCode = cityData?.countryCode || "";

  return {
    searchId,
    supplierHotelId,
    hotelDetailId,
    hotelKey:
      hotel?.hotelKey ||
      hotel?.HotelKey ||
      hotel?.hotelkey ||
      "",

    searchKey:
      hotel?.searchKey ||
      hotel?.SearchKey ||
      "",

    hotelMeta: {
      hotelId,

      hotelDetailId,
      searchId,
      supplierHotelId,

      hotelSlug:
        hotel?.hotelSlug ||
        slugify(hotelName),

      cityId: cityData?.id || "",

      cityName,

      stateName,

      country,

      countryCode,

      destinationType:
        cityData?.type || "city",

      displayName:
        cityData?.displayName || cityName,
    },
  };
};