export const buildHotelTitle = (hotelName, cityName) => {
  return `${hotelName} ${cityName ? `in ${cityName}` : ""} | Reviews, Amenities & Best Price | Destonoway`;
};

export const buildHotelDescription = (hotelName, cityName) => {
  return `Book ${hotelName}${
    cityName ? ` in ${cityName}` : ""
  } with room details, hotel amenities and verified booking information on Destonoway.`;
};
