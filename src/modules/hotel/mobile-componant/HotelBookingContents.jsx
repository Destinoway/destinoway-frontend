"use client";

import { Button } from "antd";
import BackgroundSection from "../components/hotel-booking/BackgroundSection";
import BookingAgreement from "../components/hotel-booking/BookingAgreement";
import BookingHeaderCard from "../components/hotel-booking/BookingHeaderCard";
import CouponsBankOffers from "../components/hotel-booking/CouponsBankOffers";
import GuestDetailsForm from "../components/hotel-booking/GuestDetailsForm";
import ImportantInfoCard from "../components/hotel-booking/ImportantInfoCard";
import PriceBreakupCard from "../components/hotel-booking/PriceBreakupCard";
import RoomPackageCard from "../components/hotel-booking/RoomPackageCard";
import SpecialRequestCard from "../components/hotel-booking/SpecialRequestCard";
import StaySummaryCard from "../components/hotel-booking/StaySummaryCard";

export default function HotelBookingContents({
  hotelBookingData,
  occupancy = [],
  guestFormRef,
  agreement,
  setAgreement,
  storeBookingData,
  handleGuestSubmit,
  handleRequestChange,
  handleCouponUpdate,
  handleBooking,
  isPending,
}) {
  return (
    <div className="w-full pb-24">
      <BackgroundSection />

      <div className="relative -mt-12 space-y-3 px-3 sm:px-4">
        <BookingHeaderCard bookingData={hotelBookingData} />
        <StaySummaryCard bookingData={hotelBookingData} occupancy={occupancy} />
        <RoomPackageCard bookingData={hotelBookingData} />
        <GuestDetailsForm
          ref={guestFormRef}
          onSubmit={handleGuestSubmit}
          occupancy={occupancy}
          isPANRequired={hotelBookingData?.isPANRequired}
        />
        <PriceBreakupCard bookingData={hotelBookingData} />
        <CouponsBankOffers
          bookingData={hotelBookingData}
          onCouponUpdate={handleCouponUpdate}
        />
        <SpecialRequestCard
          value={storeBookingData?.requestData || {}}
          onChange={handleRequestChange}
        />
        <ImportantInfoCard bookingData={hotelBookingData} />
        <BookingAgreement
          checked={agreement}
          onChange={setAgreement}
          bookingData={hotelBookingData}
        >
          <Button
            type="primary"
            size="large"
            loading={isPending}
            disabled={!agreement}
            onClick={handleBooking}
            className="buttion-background-color h-12! w-full rounded-xl! text-[15px]! font-semibold"
          >
            Continue To Booking
          </Button>
        </BookingAgreement>
      </div>
    </div>
  );
}
