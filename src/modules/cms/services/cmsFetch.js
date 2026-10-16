import { cache } from "react";
import { getCmsBySlug } from "./cms.service";

export const fetchCmsBySlug = cache(async (slug, preview = false) => {
  try {
    return await getCmsBySlug(slug, preview);
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404) {
      return null;
    }

    console.error("CMS FETCH ERROR:", status || error?.message);

    return null;
  }
});

const CITY_TYPES = ["hotelCity", "city"];

// /hotels/[slug] must never render a hotel-type CMS entry.
export const fetchCityCms = async (slug, preview = false) => {
  const cms = await fetchCmsBySlug(slug, preview);
  return cms && cms.entityType === "hotel" ? null : cms;
};

// Admin hotel slug may be either "<hotel>" or "<hotel>-<city>"; city entries are rejected.
export const fetchHotelCms = async (city, slug, preview = false) => {
  const candidates = [slug, city ? `${slug}-${city}` : null].filter(Boolean);
  const results = await Promise.all(
    candidates.map((candidate) => fetchCmsBySlug(candidate, preview)),
  );

  return (
    results.find((cms) => cms && !CITY_TYPES.includes(cms.entityType)) || null
  );
};
