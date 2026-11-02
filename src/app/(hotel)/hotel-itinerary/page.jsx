import HotelItinerary from "@/modules/hotel/pages/HotelItinerary";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Review & Pay",
  alternates: { canonical: `${getSiteUrl()}/hotel-itinerary` },
  robots: getRobotsMetadata({ noindex: true }),
};

export default function Page() {
  return <HotelItinerary />;
}
