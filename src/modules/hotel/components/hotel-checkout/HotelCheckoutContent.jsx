"use client";

import {
  CheckOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  ProfileOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackgroundSection from "../hotel-booking/BackgroundSection";
import BookingSummaryCard from "./BookingSummaryCard";
import CouponCard from "./CouponCard";
import CustomerSummaryCard from "./CustomerSummaryCard";
import PaymentFooter from "./PaymentFooter";
import PaymentMethodCard from "./PaymentMethodCard";
import PriceSummaryCard from "./PriceSummaryCard";

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

  const isPaid =
    booking?.bookingStatus?.paymentStatus?.toLowerCase() === "paid";
  const reservationStatus =
    booking?.bookingStatus?.reservationStatus || "Pending";
  const paymentStatus = booking?.bookingStatus?.paymentStatus || "Pending";
  const customer = booking?.customer;
  const guestDetails = occupants;

  const hotelName = hotel?.HotelName || hotel?.name || "your hotel";
  const bookingReference = booking?.bookingReference || "";

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
      <BackgroundSection
        activeStep={isPaid ? 3 : 2}
        showBack={!isPaid}
        title={isPaid ? "Booking confirmed" : "Review & Pay"}
        subtitle={
          isPaid
            ? "Thank you for booking with us. Your stay is all set."
            : "Check your booking details and complete the payment to confirm."
        }
      />

      <div className="relative z-20 mx-auto -mt-12 max-w-312.5 px-3 md:px-5">
        {isPaid ? (
          <div className="mb-5 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-5 bg-linear-to-r from-emerald-50 to-white px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[26px] text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)]">
                  <CheckOutlined />
                </span>
                <div className="min-w-0">
                  <h2 className="m-0 text-[20px] leading-snug font-bold text-(--theme-text-primary) sm:text-[24px]">
                    Thank you! Your payment was successful
                  </h2>
                  <p className="m-0 mt-1 text-[14px] leading-6 text-gray-600">
                    Your booking at{" "}
                    <span className="font-semibold text-gray-800">
                      {hotelName}
                    </span>{" "}
                    is confirmed.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {bookingReference && (
                      <span className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-[12px] font-semibold text-gray-700">
                        Booking ID:{" "}
                        <span className="font-bold tracking-wide text-(--theme-text-primary)">
                          {bookingReference}
                        </span>
                      </span>
                    )}
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                      Reservation {reservationStatus}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                      Payment {paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                <Link
                  href="/profile?tab=BookingHistory"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--theme-secondary)! px-5 text-[14px] font-semibold text-white! transition hover:bg-(--theme-hover)!"
                >
                  <ProfileOutlined /> View my bookings
                </Link>
                <Link
                  href="/hotels"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--theme-secondary)/30 bg-white! px-5 text-[14px] font-semibold text-(--theme-secondary)! transition hover:bg-(--theme-secondary)/5!"
                >
                  <ReloadOutlined /> Book again
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white! px-5 text-[14px] font-semibold text-gray-700! transition hover:bg-gray-50!"
                >
                  <HomeOutlined /> Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="m-0 text-[20px] font-bold text-(--theme-text-primary)">
                Complete your payment
              </h2>
              <p className="m-0 mt-0.5 text-[13px] text-gray-500">
                Your room is held for a limited time. Pay now to confirm it.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-700">
                Payment {paymentStatus}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--theme-secondary)/20 bg-(--theme-secondary)/8 px-3 py-1 text-[12px] font-bold text-(--theme-secondary)">
                <ClockCircleOutlined />
                Held for {minutes}:{seconds}
              </span>
            </div>
          </div>
        )}

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
