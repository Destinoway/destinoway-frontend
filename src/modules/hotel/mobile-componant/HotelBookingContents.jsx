"use client";

import { Button, Col, Row } from "antd";
import BackgroundSection from "../components/hotel-booking/BackgroundSection";
import BookingAgreement from "../components/hotel-booking/BookingAgreement";
import BookingHeaderCard from "../components/hotel-booking/BookingHeaderCard";
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
  handleBooking,
  isPending,
}) {
  return (
    <div className="w-full">
      <BackgroundSection />

      <div className="mx-auto max-w-[1250px] sm:px-4">
        <Col xs={24} lg={8}>
          <div className="-mt-10! space-y-4 px-1 sm:space-y-5 sm:px-0">
            <BookingHeaderCard bookingData={hotelBookingData} />
            <GuestDetailsForm
              ref={guestFormRef}
              onSubmit={handleGuestSubmit}
              occupancy={occupancy}
            />

            <StaySummaryCard bookingData={hotelBookingData} />
            <RoomPackageCard bookingData={hotelBookingData} />

            <PriceBreakupCard bookingData={hotelBookingData} />
          </div>
        </Col>
        <Row gutter={[14, 23]}>
          {/* LEFT */}
          <Col xs={24} lg={15}>
            <div className="mt-3 px-1 sm:px-0">
              <SpecialRequestCard
                value={storeBookingData?.requestData}
                onChange={handleRequestChange}
              />

              <ImportantInfoCard bookingData={hotelBookingData} />
              <BookingAgreement checked={agreement} onChange={setAgreement} />

              <div className="mb-[36px] pt-2 md:mb-[49px] xl:mb-0">
                <Button
                  type="primary"
                  size="large"
                  loading={isPending}
                  disabled={!agreement}
                  onClick={handleBooking}
                  className="buttion-background-color !h-[44px] w-full !rounded-lg !text-sm sm:!h-[48px] sm:w-auto sm:!rounded-xl sm:!text-base"
                >
                  Continue To Booking
                </Button>
              </div>
            </div>
          </Col>

          {/* RIGHT */}
        </Row>
      </div>
    </div>
  );
}
