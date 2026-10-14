"use client";

import AboutHotel from "./HotelSections/AboutHotel";
import Amenities from "./HotelSections/Amenities";
import FeesRules from "./HotelSections/FeesRules";
import LocationSection from "./HotelSections/LocationSection";
import Policies from "./HotelSections/Policies";
import RoomOptions from "./HotelSections/RoomOptions";

const HotelSectionsContent = ({
  supplierData = {},
  ratePlans = [],
  amenities = [],
  hotelDetailId = "",
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  onRetry,
}) => {
  return (
    <div className="space-y-6">
      <section id="rooms-section" className="scroll-mt-36">
        <RoomOptions
          ratePlans={ratePlans}
          hotelDetailId={hotelDetailId}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={onLoadMore}
          onRetry={onRetry}
        />
      </section>

      <section id="amenities-section" className="scroll-mt-36">
        <Amenities amenities={amenities} />
      </section>

      <section id="policies-section" className="scroll-mt-36">
        <Policies ratePlans={ratePlans} />
      </section>

      <section id="fees-section" className="scroll-mt-36">
        <FeesRules supplierData={supplierData} />
      </section>

      <section id="location-section" className="scroll-mt-36">
        <LocationSection supplierData={supplierData} />
      </section>

      <section id="about-section" className="scroll-mt-36">
        <AboutHotel about={supplierData?.AboutHotel} />
      </section>

    </div>
  );
};

export default HotelSectionsContent;
