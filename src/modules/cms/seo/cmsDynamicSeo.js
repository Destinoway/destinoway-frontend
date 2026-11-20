const hasCity = (cityName) =>
  Boolean(cityName) && String(cityName).trim().toLowerCase() !== "hotels";

export const buildHotelTitle = (cityName) => {
  return hasCity(cityName)
    ? `Best Hotels in ${cityName} | Budget, Luxury & Family Stays | Destinoway`
    : "Book Hotels Online | Budget, Luxury & Family Stays | Destinoway";
};

export const buildHotelDescription = (cityName) => {
  if (!hasCity(cityName)) {
    return "Explore hotels across India with Destinoway. Compare budget, luxury and family stays with verified hotel listings and easy booking experience.";
  }
  return `Explore hotels in ${cityName} with Destinoway. Compare budget, luxury and family stays with verified hotel listings and easy booking experience.`;
};

export const buildHotelKeywords = (cityName) => {
  return [
    `Hotels in ${cityName}`,
    `${cityName} hotels`,
    `${cityName} hotel booking`,
    `${cityName} budget hotels`,
    `${cityName} luxury hotels`,
    `${cityName} family hotels`,
    "hotel booking",
    "Destinoway",
  ];
};
