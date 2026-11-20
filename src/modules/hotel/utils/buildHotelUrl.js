import { slugify } from "@/utils/slug/slugify";

export const buildHotelUrl = ({
  hotelName = "",
  cityName = "",
  hotelId = "",
  searchId = "",
  hotelDetailId = "",
}) => {
  if (!hotelName || !hotelId || !searchId) {
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
  // `hid` is the public hotel identifier. The details API uses the same value
  // as supplierHotelId for current hotel records, so keep that internal alias
  // out of shared URLs.
  if (hotelDetailId) query.set("hotelDetailId", String(hotelDetailId));

  const queryString = query.toString();
  const path = `/hotel-details/${citySlug}/${hotelSlug}`;

  return `${siteUrl}${path}${queryString ? `?${queryString}` : ""}`;
};
