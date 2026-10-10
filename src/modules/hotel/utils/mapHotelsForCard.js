const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop";

const cleanImageUrl = (value) => {
  if (typeof value !== "string") return "";

  const cleaned = value.trim();

  if (!cleaned) return "";

  return cleaned;
};

export const mapHotelsForCard = ({
  hotels = [],
  currencySymbol = "₹",
  searchKey = "",
}) => {
  return hotels.map((hotel) => {
    const price = hotel?.price || {};
    const userReview = hotel?.userReview || {};
    const geoCode = hotel?.geoCode || {};

    const rawImage =
      cleanImageUrl(hotel?.heroImage) ||
      cleanImageUrl(hotel?.image) ||
      cleanImageUrl(hotel?.thumbnail) ||
      cleanImageUrl(hotel?.hotelImage);

    const image = rawImage || DEFAULT_IMAGE;

    const additionalImages = Array.isArray(hotel?.images)
      ? hotel.images
          .map((item) =>
            typeof item === "string"
              ? cleanImageUrl(item)
              : cleanImageUrl(item?.url || item?.uri),
          )
          .filter(Boolean)
      : [];

    const images =
      additionalImages.length > 0
        ? [...new Set([image, ...additionalImages])]
        : [image];

    const hotelId =
      hotel?.supplierHotelId ||
      hotel?.id ||
      hotel?.hotelId ||
      hotel?.HotelId ||
      "";

    const hotelDetailId = hotel?.hotelDetailId || "";

    const hotelName =
      hotel?.name || hotel?.hotelName || hotel?.HotelName || "Hotel Name";

    const latitude = Number(geoCode?.lat ?? hotel?.latitude ?? 0);

    const longitude = Number(geoCode?.long ?? hotel?.longitude ?? 0);

    const address = hotel?.address || "";

    const city = hotel?.city || "";

    const state = hotel?.state || "";

    const country = hotel?.country || hotel?.countryCode || "";

    const locationText =
      [city, state, country].filter(Boolean).join(", ") ||
      address ||
      "Location";

    const facilities = Array.isArray(hotel?.facilities)
      ? hotel.facilities
          .map((facility) => {
            if (typeof facility === "string") {
              return facility.trim();
            }

            return facility?.name?.toString().trim() || "";
          })
          .filter(Boolean)
      : [];

    const tags = facilities.slice(0, 3);

    const basicAmount =
      Number(price?.basePrice ?? hotel?.pricing?.basicAmount) || 0;

    const tax = Number(price?.taxes ?? hotel?.pricing?.tax) || 0;

    const totalAmount =
      Number(price?.totalPrice ?? hotel?.pricing?.totalAmount) ||
      basicAmount + tax;

    const ratingValue = Number(userReview?.rating ?? hotel?.rating?.id ?? 0);

    const reviewCount = Number(userReview?.count ?? hotel?.reviewCount ?? 0);

    const actualCurrency = price?.currency || "";

    const resolvedCurrencySymbol =
      actualCurrency === "INR" ? "₹" : actualCurrency || currencySymbol;

    return {
      id: hotelId,
      hotelDetailId,

      currencySymbol: resolvedCurrencySymbol,

      name: hotelName,

      hotelkey: hotel?.hotelkey || hotel?.hotelKey || hotelId || "",

      description: hotel?.description || "",

      location: locationText,

      address,
      city,
      state,
      country,

      latitude,
      longitude,

      // Guest review rating and property star rating are different.
      rating: ratingValue,
      reviews: reviewCount,
      starRating: Number(hotel?.starRating) || "",

      price: basicAmount,
      oldPrice: Number(hotel?.oldPrice) || 0,
      tax,
      totalAmount,

      facilities,
      tags,

      propertyType: hotel?.propertyType || "Hotel",

      isRecommended: Boolean(hotel?.isRecommended),
      roomsLeft: Number(hotel?.roomsLeft) || 0,

      searchKey,

      image,
      images,

      freeCancellation: Boolean(hotel?.freeCancellation),

      rawHotel: hotel,
    };
  });
};
