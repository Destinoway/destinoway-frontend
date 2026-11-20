import { searchDestinationApi } from "../services/search.api";
import { buildSearchData } from "./buildSearchData";
import { navigateToHotels } from "./hotelNavigation";

const norm = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const pickDestination = (results, item) => {
  const id = String(item?.cityId || "");
  const city = norm(item?.city);
  const name = norm(item?.name);

  return (
    results.find((r) => id && String(r?.id) === id) ||
    results.find((r) => norm(r?.type) === "city" && norm(r?.name) === city) ||
    results.find((r) => norm(r?.type) === "city" && norm(r?.name) === name) ||
    results.find((r) => norm(r?.type) === "city") ||
    results[0]
  );
};

// CMS cards lack coordinates/supplier ids, so resolve them via destination search by keyword.
export const searchHotelsFromCard = async ({
  router,
  item,
  baseSearchData,
}) => {
  let destination = null;

  for (const keyword of [item?.city, item?.name]) {
    if (!keyword) continue;
    try {
      const results = await searchDestinationApi(keyword);
      destination = pickDestination(results, item);
      if (destination) break;
    } catch {
      // try next keyword
    }
  }

  const destinationData = destination || item;

  const searchData = buildSearchData({
    baseSearchData,
    city: destinationData?.name || item?.city || item?.name,
    cityId: destination?.id || item?.cityId,
    destinationData,
  });

  navigateToHotels(router, searchData);
};
