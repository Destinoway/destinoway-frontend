import GiftCardSlider from "./GiftCardSlider";
import { getGiftCardsServer } from "@/modules/hotel/components/hotels/Gift-card/service/giftCard.server";

export default async function GiftCardSliderServer() {
  const giftCards = await getGiftCardsServer();
  return <GiftCardSlider giftCards={giftCards} />;
}
