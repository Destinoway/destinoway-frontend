import { serverApi } from "@/services/serverApi";

export async function getGiftCardsServer() {
  try {
    const { data: response } = await serverApi.get(
      "/couponCode/get-all-giftCard",
    );

    if (response?.success === false) {
      throw new Error(response?.message || "Unable to load gift cards.");
    }

    const coupons =
      response?.data?.coupons ??
      response?.coupons ??
      (Array.isArray(response?.data) ? response.data : null);

    return Array.isArray(coupons) ? coupons : [];
  } catch {
    console.error("Gift card offers could not be loaded.");
    return [];
  }
}
