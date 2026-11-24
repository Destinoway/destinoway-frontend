import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWishlist } from "../services/wishlist.service";

const updateWishlistIds = (queryClient, hotelId, wishlisted) => {
  const id = String(hotelId);
  queryClient.setQueryData(["wishlist-ids"], (ids = []) => {
    if (!wishlisted) return ids.filter((savedId) => savedId !== id);
    return ids.includes(id) ? ids : [...ids, id];
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWishlist,

    onMutate: async ({ hotelId }) => {
      await queryClient.cancelQueries({
        queryKey: ["wishlist-ids"],
      });

      const ids = queryClient.getQueryData(["wishlist-ids"]) || [];
      const wasWishlisted = ids.includes(String(hotelId));
      updateWishlistIds(queryClient, hotelId, !wasWishlisted);
      return { wasWishlisted };
    },

    onSuccess: (response, { hotelId }) => {
      updateWishlistIds(queryClient, hotelId, response.data.wishlisted);
    },

    onError: (_, { hotelId }, context) => {
      if (context) {
        updateWishlistIds(queryClient, hotelId, context.wasWishlisted);
      }
    },

    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["wishlist-ids"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["wishlist"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["wishlist-city"],
        }),
      ]);
    },
  });
};
