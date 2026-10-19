"use client";

import { Col, Row, Tag, Typography } from "antd";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackgroundSection from "../hotel-booking/BackgroundSection";
import BookingSummaryCard from "./BookingSummaryCard";
import CouponCard from "./CouponCard";
import CustomerSummaryCard from "./CustomerSummaryCard";
import PaymentFooter from "./PaymentFooter";
import PaymentMethodCard from "./PaymentMethodCard";
import PriceSummaryCard from "./PriceSummaryCard";

const { Title, Text } = Typography;

export default function HotelCheckoutContent({
  booking,
  bookingData,
  loading,
  onPay,
  onApplyCoupon,
  onRemoveCoupon,
  couponLoading,
}) {
  const supplierResponse = booking?.supplierResponse || {};
  const supplierRooms = supplierResponse?.HotelRoomDetail || [];
  const hotel =
    bookingData?.supplierData || supplierResponse?.HotelDetails || {};
  const room = bookingData?.selectedRoom || supplierRooms[0] || {};
  const occupants = booking?.guestDetails || [];
  const search = bookingData?.searchData || {
    checkIn: booking?.checkInDate,
    checkOut: booking?.checkOutDate,
    rooms: supplierRooms,
    adults:
      occupants.filter(
        (guest) => guest?.occupantType?.toLowerCase() === "adult",
      ).length || 2,
    children: occupants.filter(
      (guest) => guest?.occupantType?.toLowerCase() === "child",
    ).length,
  };

  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(20 * 60);

  const isPaid = booking?.bookingStatus?.paymentStatus?.toLowerCase() === "paid";
  const reservationStatus =
    booking?.bookingStatus?.reservationStatus || "Pending";
  const paymentStatus = booking?.bookingStatus?.paymentStatus || "Pending";
  const customer = booking?.customer;
  const guestDetails = occupants;

  const coupons = booking?.availableCoupons || [];
  const priceSummary = booking?.priceSummary || {};

  useEffect(() => {
    if (!isPaid && timeLeft <= 0) {
      router.push("/");
      return;
    }

    if (isPaid) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaid, timeLeft, router]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="background-color-bg min-h-screen pb-10">
      <BackgroundSection />

      <div className="relative z-20 mx-auto -mt-10 max-w-[1250px] px-3 md:px-5">
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#d8e4f5] bg-white px-5 py-4 shadow-md md:flex-row md:items-center md:justify-between">
          <div>
            <Title
              level={2}
              className="font-roboto !mb-0 !text-[22px] !font-semibold !text-[#05144b]"
            >
              Review & Pay
            </Title>
            <Text className="font-roboto text-[14px] text-gray-500">
              {isPaid
                ? "Your payment has been received for this hotel booking."
                : "Complete your payment to confirm your hotel booking."}
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tag color="green" className="!m-0 rounded-full px-3 py-1">
              Reservation {reservationStatus}
            </Tag>
            <Tag
              color={isPaid ? "green" : "orange"}
              className="!m-0 rounded-full px-3 py-1"
            >
              Payment {paymentStatus}
            </Tag>
            {!isPaid && (
              <Tag color="blue" className="!m-0 rounded-full px-3 py-1">
                Guaranteed for {minutes}:{seconds}
              </Tag>
            )}
          </div>
        </div>

        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={16}>
            <div className="flex flex-col gap-5">
              <BookingSummaryCard
                booking={booking}
                hotel={hotel}
                room={room}
                search={search}
              />

              <CustomerSummaryCard
                customer={customer}
                guestDetails={guestDetails}
              />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <PriceSummaryCard
                priceSummary={priceSummary}
                onRemoveCoupon={onRemoveCoupon}
                loading={couponLoading}
              />

              {!isPaid && (
                <>
                  <CouponCard
                    coupons={coupons}
                    priceSummary={priceSummary}
                    onApplyCoupon={onApplyCoupon}
                    loading={couponLoading}
                  />
                  <PaymentMethodCard />
                </>
              )}

              <PaymentFooter
                booking={booking}
                priceSummary={priceSummary}
                loading={loading}
                onPay={onPay}
                isPaid={isPaid}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
