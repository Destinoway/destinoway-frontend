import { slugify } from "@/utils/slug/slugify";

export const buildWishlistPayload = ({
  hotel = {},
  supplierData = {},
  searchData = {},
  hotelMeta = {},
  pricing = {},
  hotelId = "",
}) => {
  const resolvedHotelId =
    hotelId ||
    hotel?.id ||
    hotel?.hotelId ||
    supplierData?.HotelId ||
    hotelMeta?.hotelId ||
    "";

  const hotelName = hotel?.name || supplierData?.HotelName || "";

  const hotelImage =
    hotel?.image ||
    supplierData?.HotelImage ||
    supplierData?.HotelGallery?.[0] ||
    "";

  const cityId = hotelMeta?.cityId || searchData?.cityData?.id || "";
  const cityName = searchData?.city || supplierData?.City || "";
  const stateName =
    hotelMeta?.stateName || searchData?.cityData?.stateName || "";
  const countryCode =
    hotelMeta?.countryCode || searchData?.cityData?.countryCode || "";
  const countryName = supplierData?.Country || "";
  const address = hotel?.address || supplierData?.Address || "";
  const starRating = Number(hotel?.rating || supplierData?.StarRating || 0);
  const rawFacilities =
    hotel?.facilities ||
    (supplierData?.Amenities
      ? supplierData.Amenities.split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : []);
  const facilities = Array.isArray(rawFacilities)
    ? rawFacilities
        .map((facility) =>
          typeof facility === "string"
            ? facility
            : facility?.name || facility?.title || facility?.description || "",
        )
        .map((facility) => facility.trim())
        .filter(Boolean)
    : [];

  const savedPrice = pricing?.basePrice ?? hotel?.price ?? 0;
  const savedTax = pricing?.platformFeeAndTax ?? hotel?.tax ?? 0;

  return {
    hotelId: String(resolvedHotelId),
    hotelName,
    hotelSlug: slugify(hotelName),
    hotelImage,

    cityId,
    cityName,
    stateName,
    countryCode,
    countryName,

    address,
    starRating,
    facilities,

    freeCancellation: false,

    savedPrice,
    savedTax,
  };
};
