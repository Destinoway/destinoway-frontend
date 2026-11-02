import HotleBooking from "@/modules/hotel/pages/HotleBooking";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Complete Your Hotel Booking | Destonoway",
  alternates: { canonical: `${getSiteUrl()}/hotel-booking` },
  robots: getRobotsMetadata({ noindex: true }),
};

export default function Page() {
  return (
    <>
      <HotleBooking />
    </>
  );
}
