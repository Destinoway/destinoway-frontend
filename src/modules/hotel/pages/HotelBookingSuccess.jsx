"use client";

import {
  ArrowRightOutlined,
  CarOutlined,
  CheckCircleFilled,
  CoffeeOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  SafetyOutlined,
  ShopOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { useBookingDetails } from "@/modules/profile/hooks/useBookingDetails";
import { Button, Card } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function HotelBookingSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingRefNo = searchParams.get("bookingRefNo");

  const { data, isLoading } = useBookingDetails(bookingRefNo);

  const bookingData = data || {};

  const supplier = bookingData?.supplierResponse || {};
  const hotel = supplier?.HotelDetails || {};
  const room = supplier?.HotelRoomDetail?.[0] || {};
  const ratePlan = hotel?.HotelRatePlanDetails || {};
  const pricing = bookingData?.pricing || {};
  const offer = bookingData?.offer || {};
  const roomCharges = Number(pricing?.baseAmount || 0);
  const platformFee = Number(pricing?.platformFeeAndTax || 0);
  const finalPrice = Number(pricing?.finalPrice || 0);
  const autoDiscount = Number(offer?.autoDiscount || 0);
  const couponDiscount = Number(offer?.couponDiscount || 0);
  const totalDiscount = autoDiscount + couponDiscount;
  const payableAmount = Number(bookingData?.payableAmount || 0);

  const facilities = hotel?.HotelFacilities || [];
  const cancellationPolicies =
    supplier?.CancellationPolicy?.replaceAll("<br>", "\n")
      ?.split("\n")
      ?.filter(Boolean) || [];

  const topFacilities = facilities.slice(0, 6);

  const roomType = ratePlan?.HotelRoomTypeDesc?.replace(/,\s*$/, "")
    ?.replace("TwinXLBed", "")
    ?.replace("BunkBed", "")
    ?.trim();

  const inclusions = ratePlan?.Inclusion?.split(",")
    ?.map((i) => i.trim())
    ?.filter(Boolean)
    ?.map((i) => (i === "RoomOnly" ? "Room Only" : i));

  const roomSummary = [];
  const amenities =
    hotel?.HotelFacilities?.map((item) => item.FacilityName) || [];

  const getAmenityIcon = (name) => {
    const value = name.toLowerCase();

    if (value.includes("wifi")) return <WifiOutlined />;
    if (value.includes("parking")) return <CarOutlined />;
    if (value.includes("breakfast")) return <CoffeeOutlined />;
    if (value.includes("garden")) return <EnvironmentOutlined />;
    if (value.includes("laundry")) return <ShopOutlined />;
    if (value.includes("safe")) return <SafetyOutlined />;

    return <HomeOutlined />;
  };
  const nights = dayjs(bookingData?.checkOutDate, "DD/MM/YYYY").diff(
    dayjs(bookingData?.checkInDate, "DD/MM/YYYY"),
    "day",
  );
  const policies = ratePlan?.Inclusion
    ? ratePlan.Inclusion.split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  // Guest Details (currently response me nahi hai)
  const guest = bookingData?.guestDetails || [];

  if (room?.Adult_Count) {
    roomSummary.push(`${room.Adult_Count} Adult`);
  }

  if (Number(room?.Child_Count) > 0) {
    roomSummary.push(`${room.Child_Count} Child`);
  }

  const PriceRow = ({ label, value, last = false, valueClass = "" }) => (
    <div
      className={`flex items-center justify-between py-1 ${
        !last ? "border-b border-gray-100" : ""
      }`}
    >
      <p className="font-roboto! mb-0! text-[14px] text-gray-600">{label}</p>

      <p
        className={`font-roboto! mb-0! text-[15px] font-semibold ${
          valueClass || "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );

  const formattedPolicies = cancellationPolicies?.map((item) => {
    const match = item.match(
      /between date (.*?) - (.*?) deduct the amount is-(\d+\.?\d*)/i,
    );

    if (!match) return item;

    const [, fromDate, toDate, amount] = match;

    return {
      fromDate,
      toDate,
      amount: Number(amount),
    };
  });

  return (
    <div className="background-color-bg min-h-screen px-4 py-8! md:px-6">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
        {/* SUCCESS HEADER */}
        <Card className="overflow-hidden rounded border-0 shadow-xl">
          {/* Top Success */}
          <div className="bg-gradient-to-r from-[#0f766e] via-[#1d9d90] to-[#3bb7ab] px-8 py-14 text-center text-white">
            <CheckCircleFilled className="text-[70px] md:text-[90px]" />

            <h1 className="mt-5 text-3xl font-bold md:text-5xl">
              Booking Confirmed
            </h1>

            <p className="mx-auto mt-3 max-w-[700px] text-[15px] text-white/90">
              Your hotel booking has been successfully confirmed. Booking
              confirmation and hotel voucher have been sent to your registered
              email address.
            </p>
          </div>

          <div className="p-6">
            {/* Primary Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-[13px] text-gray-500">Booking Status</p>

                <h3 className="mt-2 text-[22px] font-bold text-green-600">
                  Confirmed
                </h3>
              </div>

              <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-[13px] text-gray-500">Payment</p>

                <h3 className="mt-2 text-[22px] font-bold text-blue-600">
                  Paid
                </h3>
              </div>

              <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-[13px] text-gray-500">Booking Ref</p>

                <h3 className="mt-2 text-[20px] font-bold break-all text-[#0f766e]">
                  {bookingData?.bookingRefNo}
                </h3>
              </div>

              <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-[13px] text-gray-500">Voucher No.</p>

                <h3 className="mt-2 text-[20px] font-bold break-all text-[#0f766e]">
                  {bookingData?.voucherNumber}
                </h3>
              </div>
            </div>
          </div>
        </Card>

        {/* HOTEL DETAILS */}

        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              {/* LEFT */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={hotel?.HotelImage}
                  alt="hotel"
                  className="h-[220px] w-full rounded-xl object-cover sm:h-[170px] sm:w-[180px] sm:shrink-0 lg:h-[180px] lg:w-[220px]"
                />
                <div>
                  <h3 className="font-roboto! text-[22px] leading-tight font-bold font-semibold! text-gray-900 md:text-[28px]">
                    {hotel?.HotelName}
                  </h3>
                  <p className="mt-2 text-[15px] font-medium text-gray-700">
                    {roomType}
                  </p>

                  <div className="mt-4">
                    <p className="mb-2 text-[13px] font-semibold text-gray-500 uppercase">
                      Included
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {inclusions?.map((item, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[12px] text-green-700"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="font-roboto mt-3 text-[13px] text-gray-500">
                    {bookingData?.Origin}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="self-start rounded-full border border-[#72C0F0] bg-[#edf7ff] px-4 py-2 text-[13px] font-semibold text-[#3b82b6] lg:self-auto">
                {bookingData?.ticketStatusDesc}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y border-t border-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {/* CHECK IN */}
            <div className="flex flex-col justify-center p-5 md:p-6">
              <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                Check-in
              </p>

              <h3 className="font-roboto mt-1 text-[18px] font-semibold text-gray-900">
                {bookingData?.checkInDate || "-"}
              </h3>

              <p className="font-roboto mb-0! text-[14px] text-gray-700">
                From{" "}
                {hotel?.CheckInTime?.trim()
                  ? hotel.CheckInTime
                  : "As per hotel policy"}
              </p>
            </div>

            {/* CENTER */}
            <div className="flex flex-col items-center justify-center p-5 md:p-6">
              <div className="relative flex w-full max-w-[120px] items-center justify-center">
                <div className="h-[1px] w-full bg-gray-300" />

                <span className="absolute bg-white px-3 text-[#72C0F0]">
                  <ArrowRightOutlined className="text-[24px]" />
                </span>
              </div>

              <div className="mt-4 rounded-full border border-[#d9ecf8] bg-[#edf7ff] px-4 px-5 py-2 py-3">
                <span className="font-roboto text-[13px] font-medium text-[#3b82b6]">
                  🌙 {Math.max(nights, 1)} Night
                  {Math.max(nights, 1) > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* CHECK OUT */}
            <div className="flex flex-col justify-center p-4">
              <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                Check-out
              </p>

              <h3 className="font-roboto mt-1 text-[18px] font-semibold text-gray-900">
                {bookingData?.checkOutDate || "-"}
              </h3>

              <p className="font-roboto mb-0! text-[14px] text-gray-700">
                By{" "}
                {hotel?.CheckOutTime?.trim()
                  ? hotel.CheckOutTime
                  : "As per hotel policy"}
              </p>
            </div>
          </div>
        </div>

        {/* LEAD GUEST */}

        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
          {/* HEADER */}
          <div className="border-b border-gray-200 px-3 py-4 md:px-3">
            <h2 className="font-roboto mb-0! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
              Room & Booking Info
            </h2>
          </div>

          {/* BODY */}
          <div className="p-3 md:p-3">
            {/* PACKAGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f4d38a] bg-[#fff8e8] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#d89a00]" />

              <span className="font-roboto text-[13px] font-semibold text-[#b77900]">
                {ratePlan?.Inclusion?.includes("RoomOnly")
                  ? "Room Only"
                  : "Included Package"}
              </span>
            </div>

            <div className="mt-5 md:mt-5">
              {/* ROOM TYPE */}
              <h3 className="font-roboto mt-4 text-[18px] leading-[30px] font-semibold text-gray-900">
                {ratePlan?.HotelRoomTypeDesc}
              </h3>

              {/* POLICIES */}
              <div className="mt-2 flex flex-wrap gap-2 pt-1">
                {policies?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-full border border-[#d9ecf8] bg-[#edf7ff] px-4 py-1"
                  >
                    <span className="font-roboto text-[13px] font-medium text-[#3b82b6]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-gray-200 pt-2"></div>
              {/* DETAILS */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Guests */}
                <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-2 transition hover:border-[#72C0F0] hover:shadow-md">
                  <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                    Guests
                  </p>

                  <h4 className="font-roboto mt-2 text-[16px] font-semibold text-gray-900">
                    {room?.Adult_Count} Adult
                    {Number(room?.Child_Count) > 0
                      ? `, ${room?.Child_Count} Child`
                      : ""}
                  </h4>

                  <p className="mb-0! text-[13px] text-gray-500">
                    Room {guest?.RoomNo || 1}
                  </p>
                </div>

                {/* Booking ID */}
                <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-2 transition hover:border-[#72C0F0] hover:shadow-md">
                  <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                    Booking ID
                  </p>

                  <h4 className="font-roboto mt-2 text-[16px] font-semibold break-all text-gray-900">
                    {bookingData?.bookingRefNo}
                  </h4>
                </div>

                {/* Confirmation */}
                <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-2 transition hover:border-[#72C0F0] hover:shadow-md">
                  <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                    Confirmation No.
                  </p>

                  <h4 className="font-roboto mt-2 text-[16px] font-semibold break-all text-gray-900">
                    {bookingData?.voucherNumber}
                  </h4>
                </div>

                {/* Meal Plan */}
                <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-2 transition hover:border-[#72C0F0] hover:shadow-md">
                  <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                    Meal Plan
                  </p>

                  <h4 className="font-roboto mt-2 text-[16px] font-semibold text-gray-900">
                    {ratePlan?.Inclusion?.includes("RoomOnly")
                      ? "Room Only"
                      : "Included Package"}
                  </h4>
                </div>

                {/* Booked On */}
                <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-2 transition hover:border-[#72C0F0] hover:shadow-md">
                  <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                    Booked On
                  </p>

                  <h4 className="font-roboto mt-2 text-[16px] font-semibold text-gray-900">
                    {dayjs(bookingData?.createdAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </h4>

                  <p className="mb-0! text-[13px] text-[#72C0F0]">
                    via Destonoway
                  </p>
                </div>

                {/* Invoice */}
                <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-2 transition hover:border-[#72C0F0] hover:shadow-md">
                  <p className="font-roboto text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                    Invoice Number
                  </p>

                  <h4 className="font-roboto mt-2 text-[16px] font-semibold break-all text-gray-900">
                    {bookingData?.InvoiceNumber}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}

        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 px-3 py-4 md:px-3">
            <h2 className="font-roboto mb-0! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
              Guest Details
            </h2>
          </div>

          {/* GUEST LIST */}
          <div>
            {bookingData?.PAXDetails?.map((guest, index) => (
              <div
                key={index}
                className="flex items-start gap-4 border-b border-gray-200 px-5 py-5 last:border-0 md:px-6"
              >
                {/* AVATAR */}
                <div className="h-[52px]md:w-[56px] flex w-[52px] shrink-0 items-center justify-center rounded-full border border-[#d9ecf8] bg-[#edf7ff] text-[15px] font-bold text-[#3b82b6] md:h-[56px] md:text-[16px]">
                  {`${guest?.FirstName?.[0] || ""}${guest?.LastName?.[0] || ""}`}
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                  {/* NAME + ROLE */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <h3 className="text-[17px] font-bold break-words text-gray-900 md:text-[16px]">
                      {guest?.Title} {guest?.FirstName} {guest?.LastName}
                    </h3>

                    {guest.role && (
                      <span className="ml-[25px] w-fit rounded-full bg-[#edf7ff] px-2.5 py-[3px] !text-[11px] font-medium !text-[#3b82b6]">
                        {guest?.Passengertyp}
                      </span>
                    )}
                  </div>

                  {/* CONTACT */}
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <p className="text-[13px] text-gray-600 md:text-[14px]">
                      Room No: {guest?.RoomNo}
                    </p>

                    <p className="text-[13px] text-gray-600 md:text-[14px]">
                      Guest Type: {guest?.Passengertyp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 px-3 py-4 md:px-3">
            <h2 className="font-roboto mb-0! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
              Price Breakup
            </h2>
          </div>

          {/* BODY */}
          <div className="p-6">
            {/* BREAKUP */}
            <div className="rounded-xl border border-[#d9ecf8] bg-[#fafcff] p-4">
              <PriceRow
                label="Room Charges"
                value={`₹${roomCharges.toFixed(2)}`}
              />

              <PriceRow
                label="Platform Fee & Taxes"
                value={`₹${platformFee.toFixed(2)}`}
                valueClass="text-orange-600"
              />

              <PriceRow
                label="final Price"
                value={`₹${finalPrice.toFixed(2)}`}
              />

              {autoDiscount > 0 && (
                <PriceRow
                  label={`Auto Discount (${offer?.autoCouponCode})`}
                  value={`-₹${autoDiscount.toFixed(2)}`}
                  valueClass="text-green-600"
                />
              )}

              {couponDiscount > 0 && (
                <PriceRow
                  label={`Coupon Discount (${offer?.couponCode})`}
                  value={`-₹${couponDiscount.toFixed(2)}`}
                  valueClass="text-green-600"
                />
              )}

              <PriceRow
                label="Payment Status"
                value={bookingData?.paymentStatus?.toUpperCase() || "PENDING"}
                last
                valueClass={
                  bookingData?.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-orange-600"
                }
              />
            </div>

            {/* TOTAL */}
            <div className="mt-5 rounded-xl border border-[#d9ecf8] bg-[#edf7ff] p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-roboto mb-1 text-[12px] font-semibold tracking-wider text-[#3b82b6] uppercase">
                    Payment Summary
                  </p>

                  <h3 className="font-roboto mb-3 text-[20px] font-bold text-gray-900">
                    Total Paid
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-gray-500">
                        Booking Ref:
                      </span>

                      <span className="text-[13px] font-medium text-gray-900">
                        {bookingData?.bookingRefNo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-gray-500">Status:</span>

                      <span
                        className={`rounded-full px-2 py-[2px] text-[12px] font-medium ${
                          bookingData?.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {bookingData?.paymentStatus === "paid"
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </div>

                    {totalDiscount > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-gray-500">
                          You Saved:
                        </span>

                        <span className="text-[13px] font-semibold text-green-600">
                          ₹{totalDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#c7e7f8] pt-4 text-left md:border-0 md:pt-0 md:text-right">
                  <p className="font-roboto mb-1 text-[13px] text-gray-500">
                    Amount Paid
                  </p>

                  <h2 className="font-roboto text-[32px] leading-none font-bold text-[#3b82b6]">
                    ₹{payableAmount.toFixed(2)}
                  </h2>

                  <p className="mt-2 text-[12px] text-gray-500">INR</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMPORTANT INFO */}
        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
          {/* HEADER */}
          <div className="border-b border-gray-200 px-3 py-4 md:px-3">
            <h2 className="font-roboto mb-0! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
              Cancellation Policy
            </h2>
          </div>

          {/* POLICY LIST */}
          <div className="p-4 md:p-5">
            <div className="space-y-3">
              {formattedPolicies?.length > 0 ? (
                formattedPolicies.map((item, index) => {
                  if (typeof item === "string") {
                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-[#d9ecf8] bg-[#fafcff] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircleFilled className="mt-0.5 !text-[18px] !text-[#22c55e]" />

                          <p className="font-roboto! mb-0! text-[14px] leading-6 font-medium text-gray-800 md:text-[15px]">
                            {item}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-[#d9ecf8] bg-[#fafcff] p-4 transition hover:border-[#72C0F0]"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircleFilled className="mt-0.5 shrink-0 !text-[18px] !text-[#22c55e]" />

                        <div className="flex w-full flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="font-roboto! mb-1! text-[13px] font-semibold tracking-wide text-gray-500 uppercase">
                              Cancellation Period
                            </p>

                            <p className="font-roboto! mb-0! text-[15px] font-medium text-gray-800">
                              {item.fromDate} - {item.toDate}
                            </p>
                          </div>

                          <div>
                            <p className="font-roboto! mr-5 mb-1! text-[13px] font-semibold tracking-wide text-gray-500 uppercase">
                              Cancellation Charge
                            </p>

                            <p className="font-roboto! mb-0! text-[16px] font-semibold text-red-600">
                              ₹
                              {item.amount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleFilled className="mt-0.5 !text-[18px] !text-green-600" />

                    <p className="font-roboto! mb-0! text-[15px] font-medium text-green-700">
                      No cancellation policy available.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="font-roboto! mb-0! text-[13px] text-amber-800">
                Cancellation charges may vary depending on the cancellation
                date, supplier rules, and hotel policy. Please review the policy
                carefully before cancelling your booking.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 px-3 py-4 md:px-3">
            <h2 className="font-roboto mb-0! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
              Hotel Facilities
            </h2>
          </div>

          {amenities.length ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {amenities.map((item, i) => (
                <div
                  key={i}
                  className="m-2 flex items-center gap-3 rounded border border-gray-100 bg-gray-50 p-1 transition-all hover:border-[#72C0F0] hover:bg-[#f8fcff]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ff] text-[18px] text-[#0ea5e9]">
                    {getAmenityIcon(item)}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No hotel facilities available.</div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
          <Button
            disabled
            icon={<DownloadOutlined />}
            size="large"
            className="!h-[50px] !rounded"
          >
            Voucher PDF Coming Soon
          </Button>

          <Button
            type="primary"
            icon={<HomeOutlined />}
            size="large"
            className="!h-[50px] !rounded !bg-[#0f766e]"
            onClick={() => {
              clearBookingData();
              router.push("/");
            }}
          >
            Back To Home
          </Button>
        </div>
      </div>
    </div>
  );
}
