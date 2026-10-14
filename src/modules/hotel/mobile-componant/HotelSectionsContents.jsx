"use client";


import AboutHotel from "../components/hotels/viewhotles/HotelSections/AboutHotel";
import Amenities from "../components/hotels/viewhotles/HotelSections/Amenities";
import FeesRules from "../components/hotels/viewhotles/HotelSections/FeesRules";
import LocationSection from "../components/hotels/viewhotles/HotelSections/LocationSection";
import Policies from "../components/hotels/viewhotles/HotelSections/Policies";
import RoomOptions from "../components/hotels/viewhotles/HotelSections/RoomOptions";


const HotelSectionsContents = ({
  supplierData = {},
  ratePlans = [],
  amenities = [],
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  onRetry,
}) => {
  return (
    <div className="space-y-6">

      {/* Rooms - Desktop Only */}
      <section
        id="rooms-section"
        className="scroll-mt-36"
      >
        <div className="hidden md:block">
          <RoomOptions
            ratePlans={ratePlans}
            supplierData={supplierData}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
            onRetry={onRetry}
          />
        </div>
      </section>


      {/* Amenities */}
      <section
        id="amenities-section"
        className="scroll-mt-36"
      >
        <Amenities
          amenities={amenities}
        />
      </section>


      {/* Policies */}
      <section
        id="policies-section"
        className="scroll-mt-36"
      >
        <Policies
          ratePlans={ratePlans}
        />
      </section>


      {/* Fees */}
      <section
        id="fees-section"
        className="scroll-mt-36"
      >
        <FeesRules
          ratePlans={ratePlans}
        />
      </section>


      {/* Location */}
      <section
        id="location-section"
        className="scroll-mt-36"
      >
        <LocationSection
          supplierData={supplierData}
        />
      </section>


      {/* About */}
      <section
        id="about-section"
        className="scroll-mt-36"
      >
        <AboutHotel
          about={supplierData?.AboutHotel}
        />
      </section>

    </div>
  );
};

export default HotelSectionsContents;