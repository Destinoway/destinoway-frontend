import GiftCardBanner from "@/modules/hotel/components/hotels/Gift-card/GiftCardBanner";
import GiftCardsSection from "@/modules/hotel/components/hotels/Gift-card/GiftCardsSection";

import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

const TITLE = "Hotel Gift Cards & Travel Offers";
const DESCRIPTION =
  "Buy and redeem Destinoway gift cards for hotel stays. Explore the latest travel offers and exclusive discounts.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/gift-cards` },
  robots: getRobotsMetadata(),
  openGraph: {
    title: `${TITLE} | Destinoway`,
    description: DESCRIPTION,
    url: `${getSiteUrl()}/gift-cards`,
    type: "website",
  },
};

export default function GiftCardsPage() {
  return (
    <>
      <GiftCardBanner />
      <GiftCardsSection />
    </>
  );
}
