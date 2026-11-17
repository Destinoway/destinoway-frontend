import { useQuery } from "@tanstack/react-query";
import { getAllGiftCardApi } from "../service/GiftCard.api";

export const useGiftcard = () =>
  useQuery({
    queryKey: ["giftcard"],
    queryFn: async () => {
      const res = await getAllGiftCardApi();
      const response = res?.data;

      if (response?.success === false) {
        throw new Error(response?.message || "Unable to load gift cards.");
      }

      const coupons =
        response?.data?.coupons ??
        response?.coupons ??
        (Array.isArray(response?.data) ? response.data : null);

      if (!Array.isArray(coupons)) {
        throw new Error(response?.message || "Gift card list is missing.");
      }

      return coupons;
    },
  });
