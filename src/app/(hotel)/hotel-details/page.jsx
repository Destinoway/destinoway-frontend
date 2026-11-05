import HotelDetails from "@/modules/hotel/pages/hotelDetails";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Hotel Details",
  alternates: { canonical: `${getSiteUrl()}/hotel-details` },
  robots: getRobotsMetadata({ noindex: true }),
};

function page() {
  return (
    <>
      <HotelDetails />
    </>
  );
}

export default page;
