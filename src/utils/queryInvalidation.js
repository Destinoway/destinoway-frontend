export const invalidateCurrencyQueries = async (queryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["hotels"],
    }),

    // Hotel details page room prices
    queryClient.invalidateQueries({
      queryKey: ["hotel-rooms"],
    }),

    // Hotel booking page price & coupons
    queryClient.invalidateQueries({
      queryKey: ["hotel-itinerary-pricing"],
    }),

    // Future
    // queryClient.invalidateQueries({ queryKey:["hotel-booking"] })
    // queryClient.invalidateQueries({ queryKey:["wishlist"] })
  ]);
};
