import HotelCheckout from "@/modules/hotel/pages/HotelCheckout";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Hotel Checkout | Destonoway",
  alternates: { canonical: `${getSiteUrl()}/hotel-checkout` },
  robots: getRobotsMetadata({ noindex: true }),
};

export default function Page() {
  return <HotelCheckout />;
}
