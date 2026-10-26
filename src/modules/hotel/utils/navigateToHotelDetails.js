import { slugify } from "@/utils/slug/slugify";
import { buildSelectedHotel } from "./buildSelectedHotel";

export const navigateToHotelDetails = ({
  router,
  hotel,
  searchData,
  setSelectedHotel,
}) => {
  const cityData = searchData?.cityData || {};

  const cityName =
    cityData?.city ||
    cityData?.name ||
    searchData?.city ||
    hotel?.location?.city ||
    hotel?.cityName ||
    hotel?.City ||
    "hotel";

  const citySlug = slugify(cityName?.toString().split(",")[0].trim());

  const hotelName =
    hotel?.name || hotel?.hotelName || hotel?.HotelName || "hotel";

  const hotelSlug = hotel?.hotelSlug || slugify(hotelName);

  const hotelId = hotel?.id || hotel?.hotelId || hotel?.HotelId || "";

  const hotelDetailId = hotel?.hotelDetailId || "";
  const searchId = hotel?.searchId || "";
  const supplierHotelId =
    hotel?.supplierHotelId ||
    hotel?.supplierHotelID ||
    hotel?.id ||
    hotel?.hotelId ||
    hotel?.HotelId ||
    "";

  if ((!searchId || !supplierHotelId) && !hotelId) {
    console.error("Hotel searchId or supplierHotelId not found", {
      hotelId,
      hotelDetailId,
      searchId,
      supplierHotelId,
      hotel,
    });

    return;
  }

  setSelectedHotel?.(
    buildSelectedHotel({
      hotel,
      searchData,
    }),
  );

  const query = new URLSearchParams();

  if (searchId) query.set("searchId", String(searchId));
  if (supplierHotelId) {
    query.set("supplierHotelId", String(supplierHotelId));
  }

  if (hotelId) query.set("hid", String(hotelId));
  if (hotelDetailId) query.set("hotelDetailId", String(hotelDetailId));

  router.push(
    `/hotel-details/${citySlug}/${hotelSlug}?${query.toString()}`,
  );
};
