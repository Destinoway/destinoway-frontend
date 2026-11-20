"use client";

import {
  CalendarOutlined,
  CheckCircleFilled,
  EnvironmentOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateFilled,
  StarFilled,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import Image from "next/image";

import SectionCard from "@/modules/hotel/components/hotels/viewhotles/HotelSections/SectionCard";
import { useRazorpayPayment } from "@/modules/payments/hooks/useRazorpayPayment";
import BackgroundSection from "../hotel-booking/BackgroundSection";

const CARD =
  "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]";

const fullName = (person = {}) =>
  [person.title, person.firstName, person.middleName, person.lastName]
    .filter(Boolean)
    .join(" ");

const getStatusTone = (status = "") => {
  const value = String(status).toLowerCase();

  if (/(paid|success|confirm|complete|booked)/.test(value)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (/(fail|cancel|reject|expire)/.test(value)) {
    return "border-red-200 bg-red-50 text-red-600";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
};

function StatusPill({ label, status }) {
  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold capitalize ${getStatusTone(status)}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}: {String(status).toLowerCase()}
    </span>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-gray-100 bg-slate-50 px-3.5 py-3">
      <span className="mt-0.5 text-[15px] text-(--theme-secondary)">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="m-0 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          {label}
        </p>
        <p className="m-0 mt-0.5 text-[14px] font-semibold wrap-break-word text-gray-800">
          {value || "--"}
        </p>
      </div>
    </div>
  );
}

function DateBlock({ label, date, align = "left" }) {
  const valid = date?.isValid?.();

  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <p className="m-0 text-[10px] font-bold tracking-widest text-gray-400 uppercase sm:text-[11px]">
        {label}
      </p>
      <p className="m-0 mt-1 text-[15px] leading-tight font-bold text-(--theme-text-primary) sm:text-[18px]">
        {valid ? date.format("DD MMM") : "-"}
        {valid && (
          <span className="ml-1 text-[12px] font-semibold text-gray-500 sm:text-[13px]">
            {date.format("YYYY")}
          </span>
        )}
      </p>
      <p className="m-0 mt-0.5 text-[11px] text-gray-500 sm:text-[12px]">
        {valid ? date.format("dddd") : ""}
      </p>
    </div>
  );
}

export default function ItineraryContent({ itinerary }) {
  const { payNow, loading } = useRazorpayPayment();

  const { hotel = {}, stay = {}, contactInfo = {}, rooms = [] } = itinerary;
  const currency = itinerary.currency || "INR";
  const amount = Number(itinerary.amount || 0);
  const bookingRef = itinerary.bookingRefNo || itinerary.bookingId;

  const checkIn = dayjs(stay.checkIn);
  const checkOut = dayjs(stay.checkOut);
  const nights = Math.max(checkOut.diff(checkIn, "day"), 1) || 1;
  const starRating = Math.min(Math.max(Number(hotel.starRating) || 0, 0), 5);
  const hotelImage = hotel.image || hotel.imageUrl || hotel.thumbnail || "";

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);

  const totalGuests = rooms.reduce(
    (sum, room) =>
      sum + (room.adults?.length || 0) + (room.children?.length || 0),
    0,
  );

  const stayLine = [
    `${nights} Night${nights > 1 ? "s" : ""}`,
    `${rooms.length} Room${rooms.length === 1 ? "" : "s"}`,
    `${totalGuests} Guest${totalGuests === 1 ? "" : "s"}`,
  ].join(" · ");

  const handlePay = () =>
    payNow({
      bookingId: bookingRef,
      customer: {
        name: fullName({
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
        }),
        mobile: contactInfo.mobile,
        email: contactInfo.email,
      },
    });

  return (
    <div className="background-color-bg min-h-screen pb-24 md:pb-10">
      <BackgroundSection
        activeStep={2}
        title="Review & Pay"
        subtitle="Check your booking details and complete the payment to confirm."
      />

      <div className="relative z-20 mx-auto -mt-12 max-w-312.5 px-3 sm:px-4">
        {/* BOOKING REFERENCE STRIP */}

        <div
          className={`${CARD} mb-4 flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6`}
        >
          <div className="min-w-0">
            <p className="m-0 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Booking reference
            </p>
            <p className="m-0 mt-0.5 truncate text-[16px] font-bold tracking-wide text-(--theme-text-primary) sm:text-[18px]">
              {bookingRef || "--"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill label="Itinerary" status={itinerary.itineraryStatus} />
            <StatusPill label="Payment" status={itinerary.paymentStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-4">
            {/* HOTEL + STAY */}

            <div className={CARD}>
              <div className="flex gap-3 p-3 sm:gap-5 sm:p-4">
                {hotelImage && (
                  <div className="relative min-h-27.5 w-25 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:min-h-32.5 sm:w-42.5">
                    <Image
                      src={hotelImage}
                      alt={hotel.name || "Hotel"}
                      fill
                      unoptimized
                      sizes="170px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  {starRating > 0 && (
                    <div className="mb-1.5 flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <StarFilled
                          key={item}
                          className={`text-[12px] ${
                            item <= starRating
                              ? "text-[#F5A623]!"
                              : "text-[#D9DEE7]!"
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-[11px] font-semibold text-gray-500">
                        {starRating}-star hotel
                      </span>
                    </div>
                  )}
                  <h2 className="m-0 text-[17px] leading-snug font-bold text-(--theme-text-primary) sm:text-[20px]">
                    {hotel.name || "Hotel"}
                  </h2>
                  {hotel.address && (
                    <p className="m-0 mt-1.5 flex items-start gap-1.5 text-[12px] leading-5 text-gray-500 sm:text-[13px]">
                      <EnvironmentOutlined className="mt-1 shrink-0 text-(--theme-secondary)" />
                      <span className="min-w-0">{hotel.address}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
                <DateBlock label="Check-in" date={checkIn} />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-(--theme-secondary)/20 bg-(--theme-secondary)/8 px-3 py-1 text-[11px] font-bold whitespace-nowrap text-(--theme-secondary) sm:text-[12px]">
                  <CalendarOutlined />
                  {nights} Night{nights > 1 ? "s" : ""}
                </span>
                <DateBlock label="Check-out" date={checkOut} align="right" />
              </div>

              <div className="flex items-center gap-2 border-t border-gray-100 bg-slate-50/70 px-4 py-2.5 text-[12px] font-semibold text-gray-600 sm:px-6 sm:text-[13px]">
                <TeamOutlined className="text-(--theme-secondary)" />
                {stayLine}
              </div>
            </div>

            {/* CONTACT */}

            <SectionCard
              icon={<UserOutlined />}
              title="Contact Details"
              subtitle="Booking confirmation will be sent here"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoTile
                  icon={<UserOutlined />}
                  label="Name"
                  value={fullName(contactInfo)}
                />
                <InfoTile
                  icon={<PhoneOutlined />}
                  label="Mobile"
                  value={contactInfo.mobile}
                />
                <InfoTile
                  icon={<MailOutlined />}
                  label="Email"
                  value={contactInfo.email}
                />
                <InfoTile
                  icon={<EnvironmentOutlined />}
                  label="Address"
                  value={[
                    contactInfo.address,
                    contactInfo.city,
                    contactInfo.state,
                    contactInfo.pin,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
              </div>
            </SectionCard>

            {/* ROOMS & GUESTS */}

            <SectionCard
              icon={<TeamOutlined />}
              title="Rooms & Guests"
              subtitle={`${rooms.length} room${rooms.length === 1 ? "" : "s"}, ${totalGuests} guest${totalGuests === 1 ? "" : "s"}`}
            >
              <div className="space-y-3">
                {rooms.map((room, index) => {
                  const roomNo = room.occupancyId ?? index + 1;
                  const adults = room.adults?.length || 0;
                  const children = room.children?.length || 0;
                  const guests = [
                    ...(room.adults || []).map((guest) => ({
                      ...guest,
                      type: "Adult",
                    })),
                    ...(room.children || []).map((guest) => ({
                      ...guest,
                      type: "Child",
                    })),
                  ];

                  return (
                    <div
                      key={room.occupancyId ?? index}
                      className="overflow-hidden rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center justify-between gap-3 bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[13px] font-bold text-(--theme-secondary) shadow-sm">
                            {index + 1}
                          </span>
                          <p className="m-0 text-[14px] font-bold text-(--theme-text-primary)">
                            Room {roomNo}
                          </p>
                        </div>
                        <span className="text-[12px] font-medium text-gray-500">
                          {adults} Adult{adults === 1 ? "" : "s"}
                          {children
                            ? ` · ${children} Child${children > 1 ? "ren" : ""}`
                            : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                        {guests.map((guest, guestIndex) => (
                          <div
                            key={`${guest.type}-${guestIndex}`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5"
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--theme-secondary)/8 text-[12px] text-(--theme-secondary)">
                                <UserOutlined />
                              </span>
                              <span className="truncate text-[14px] font-semibold text-gray-800">
                                {fullName(guest) || "--"}
                              </span>
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                guest.type === "Adult"
                                  ? "bg-sky-50 text-sky-700"
                                  : "bg-violet-50 text-violet-700"
                              }`}
                            >
                              {guest.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          {/* PAYMENT */}

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
            <div className={CARD}>
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary)">
                  <WalletOutlined />
                </span>
                <div>
                  <h2 className="m-0 text-[17px] font-bold text-(--theme-text-primary)">
                    Payment Summary
                  </h2>
                  <p className="m-0 mt-0.5 text-[12px] text-gray-500">
                    {stayLine}
                  </p>
                </div>
              </div>

              <div className="space-y-3 px-4 pt-4 text-[13px] sm:px-5 sm:text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="max-w-47.5 truncate font-semibold text-gray-900">
                    {bookingRef}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500">Check-in</span>
                  <span className="font-semibold text-gray-900">
                    {checkIn.isValid() ? checkIn.format("DD MMM YYYY") : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500">Check-out</span>
                  <span className="font-semibold text-gray-900">
                    {checkOut.isValid() ? checkOut.format("DD MMM YYYY") : "-"}
                  </span>
                </div>
              </div>

              <div className="px-4 pt-4 pb-4 sm:px-5">
                <div className="rounded-xl bg-(--theme-secondary)/6 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-bold text-(--theme-text-primary)">
                      Total payable
                    </span>
                    <span className="text-[22px] leading-tight font-bold text-(--theme-text-primary)">
                      {formatPrice(amount)}
                    </span>
                  </div>
                  <p className="m-0 mt-0.5 text-right text-[11px] text-gray-500">
                    Inclusive of all taxes & fees
                  </p>
                </div>
              </div>
            </div>

            <div className={`${CARD} p-4 sm:p-5`}>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src="/images/payments/razorpay-icon.svg"
                    alt="Razorpay"
                    width={36}
                    height={36}
                  />
                  <div className="min-w-0">
                    <p className="m-0 text-[14px] font-bold text-gray-900">
                      Razorpay
                    </p>
                    <p className="m-0 text-[12px] text-gray-500">
                      UPI, Cards, Net Banking & Wallets
                    </p>
                  </div>
                </div>
                <CheckCircleFilled className="shrink-0 text-[18px] text-(--theme-secondary)" />
              </div>

              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handlePay}
                icon={<LockOutlined />}
                className="buttion-background-color mt-4! h-13! w-full rounded-xl! text-[16px]! font-semibold!"
              >
                Pay {formatPrice(amount)}
              </Button>

              <p className="m-0 mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-emerald-700">
                <SafetyCertificateFilled />
                Secure payment powered by Razorpay
              </p>

              <p className="m-0 mt-2 text-center text-[11px] leading-5 text-gray-500">
                By clicking <strong>Pay</strong>, you agree to our booking
                terms, cancellation policy and secure payment process.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
