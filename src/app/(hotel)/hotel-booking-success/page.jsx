import HotelBookingSuccess from "@/modules/hotel/pages/HotelBookingSuccess";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Booking Confirmation | Destonoway",
  alternates: { canonical: `${getSiteUrl()}/hotel-booking-success` },
  robots: getRobotsMetadata({ noindex: true }),
};

export default function Page() {
  return <HotelBookingSuccess />;
}
