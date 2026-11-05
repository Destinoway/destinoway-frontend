import { unstable_cache } from "next/cache";
import { cache } from "react";
import { slugify } from "@/utils/slug/slugify";
import { getCmsBySlug } from "./cms.service";

// Published CMS pages are cached for a minute; previews always hit the API.
const getPublishedCmsCached = unstable_cache(
  (slug) => getCmsBySlug(slug, false),
  ["cms-page"],
  { revalidate: 60, tags: ["cms"] },
);

export const fetchCmsBySlug = cache(async (slug, preview = false) => {
  try {
    return preview
      ? await getCmsBySlug(slug, true)
      : await getPublishedCmsCached(slug);
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404) {
      return null;
    }

    if (status) {
      console.error("CMS request failed with status:", status);
    }

    return null;
  }
});

// /hotels/[slug] must never render a hotel-type CMS entry.
export const fetchCityCms = async (slug, preview = false) => {
  const cms = await fetchCmsBySlug(slug, preview);
  return cms && cms.entityType === "hotel" ? null : cms;
};

const getCitySlug = (value) =>
  slugify(String(value || "").split(",")[0].trim());

// Admin hotel slug may be either "<hotel>" or "<hotel>-<city>".
export const fetchHotelCms = async (city, slug, preview = false) => {
  const candidates = [slug, city ? `${slug}-${city}` : null].filter(Boolean);
  const results = await Promise.all(
    candidates.map((candidate) => fetchCmsBySlug(candidate, preview)),
  );

  return (
    results.find((cms) => {
      if (!cms || cms.entityType !== "hotel") {
        return false;
      }

      const cmsCity = cms?.data?.cityMeta?.destination;
      return !city || !cmsCity || getCitySlug(cmsCity) === getCitySlug(city);
    }) || null
  );
};
