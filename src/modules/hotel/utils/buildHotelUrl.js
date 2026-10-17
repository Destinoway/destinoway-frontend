import { slugify } from "@/utils/slug/slugify";

export const buildHotelUrl = ({
  hotelName = "",
  cityName = "",
  hotelId = "",
  searchId = "",
  supplierHotelId = "",
  hotelDetailId = "",
}) => {
  if (!hotelName || !hotelId || !searchId || !supplierHotelId) {
    return "";
  }

  const siteUrl =
    process.env.NEXTAUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const citySlug = slugify(cityName);
  const hotelSlug = slugify(hotelName);
  const query = new URLSearchParams();

  if (hotelId) query.set("hid", String(hotelId));
  if (searchId) query.set("searchId", String(searchId));
  if (supplierHotelId) {
    query.set("supplierHotelId", String(supplierHotelId));
  }
  if (hotelDetailId) query.set("hotelDetailId", String(hotelDetailId));

  const queryString = query.toString();
  const path = `/hotel-details/${citySlug}/${hotelSlug}`;

  return `${siteUrl}${path}${queryString ? `?${queryString}` : ""}`;
};
