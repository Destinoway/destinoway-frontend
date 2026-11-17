export const buildSearchData = ({
  baseSearchData,
  city,
  cityId,
  destinationData = {},
  stateName = "",
  countryCode = "",
}) => {
  const isSameDestination =
    String(baseSearchData?.cityData?.id || "") === String(cityId || "");
  const existingCityData = isSameDestination
    ? baseSearchData?.cityData || {}
    : {};
  const coordinates =
    destinationData?.coordinates ||
    destinationData?.geoCode ||
    existingCityData?.coordinates ||
    existingCityData?.geoCode ||
    undefined;

  return {
    ...baseSearchData,

    city: destinationData?.displayName || city,

    cityData: {
      ...existingCityData,
      ...destinationData,
      id: cityId || destinationData?.id || "",
      name: destinationData?.displayName || destinationData?.name || city,
      type: destinationData?.type || existingCityData?.type || "city",
      city:
        destinationData?.city ||
        (destinationData?.displayName ? city : "") ||
        city,
      stateName:
        stateName ||
        destinationData?.stateName ||
        destinationData?.state ||
        existingCityData?.stateName ||
        "",
      countryCode:
        countryCode ||
        destinationData?.countryCode ||
        destinationData?.country ||
        existingCityData?.countryCode ||
        "",
      ...(coordinates ? { coordinates } : {}),
    },
  };
};
