"use client";

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PhoneOutlined,
  SafetyCertificateFilled,
  ShareAltOutlined,
  StarFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { message, Skeleton } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBookingDetails } from "../../hooks/useBookingDetails";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useDownloadInvoice } from "../../hooks/useDownloadInvoice";
import {
  getBookingStatusMeta,
  STATUS_TONE_CLASSES,
} from "../../utils/bookingStatus";
import CancelBookingModal from "./CancelBookingModal";
import ShareBookingModal from "./ShareBookingModal";

const cardClass =
  "overflow-hidden rounded-2xl border border-[#E5EEF7] bg-white shadow-[0_10px_35px_rgba(5,20,75,0.08)]";

const formatDate = (value, pattern = "DD MMM YYYY") => {
  const date = dayjs(value);
  return date.isValid() ? date.format(pattern) : "--";
};

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E5EEF7] px-5 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4de] text-[16px] text-[#05144b]">
        {icon}
      </div>
      <div>
        <h2 className="font-roboto mb-0! text-[17px] leading-tight font-bold text-[#05144b]">
          {title}
        </h2>
        {subtitle && (
          <p className="mb-0! text-[13px] text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-[#FAFCFF] p-3">
      <p className="mb-1 text-[11px] tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      <p className="mb-0! text-[14px] font-semibold break-all text-[#05144b]">
        {value || "--"}
      </p>
    </div>
  );
}

function PriceRow({ label, value, valueClass = "text-gray-900" }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
      <span className="text-[14px] text-gray-600">{label}</span>
      <span className={`text-[15px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function BookingDetailsTab({ bookingRefNo }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const { mutate: downloadInvoice, isPending: downloading } =
    useDownloadInvoice();
  const { mutate: cancelBooking, isPending: cancelling } = useCancelBooking();
  const { data, isLoading, isError, refetch } = useBookingDetails(bookingRefNo);

  const goBack = () => router.push("/profile?tab=BookingHistory");

  if (isLoading) {
    return (
      <div className={`${cardClass} p-6`}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={`${cardClass} py-14 text-center`}>
        <p className="text-[18px] font-semibold text-[#05144b]">
          Booking not found
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="h-10 rounded-lg border border-gray-300 px-5 text-[14px] font-semibold text-gray-700"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            className="buttion-background-color h-10 rounded-lg px-5 text-[14px] font-semibold text-white!"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const booking = data;
  const supplier = booking.supplierResponse || {};
  const hotel = supplier.HotelDetails || {};
  const rooms = supplier.HotelRoomDetail || [];
  const supplierBooking = booking.supplierBookingDetails || {};
  const pricing = booking.pricing || {};
  const offer = booking.offer || {};
  const contact = booking.guestDetails || {};

  const hotelName = hotel.name || hotel.HotelName || "Hotel";
  const address = hotel.address || hotel.Address || "";
  const rating = Math.max(
    Number(hotel.starRating ?? hotel.StarCategoryId) || 0,
    0,
  );
  const facilities = (hotel.HotelFacilities || [])
    .map((item) => item.FacilityName)
    .filter(Boolean);

  const status = getBookingStatusMeta(
    booking.supplierBookingStatus ||
      booking.ticketStatusDesc ||
      booking.itineraryStatus,
  );
  const isPaid = booking.paymentStatus?.toLowerCase() === "paid";
  const canCancel = status.group === "confirmed" && isPaid;

  const currency = pricing.currency || "INR";
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);

  const checkIn = dayjs(booking.checkInDate);
  const checkOut = dayjs(booking.checkOutDate);
  const nights =
    checkIn.isValid() && checkOut.isValid()
      ? Math.max(checkOut.diff(checkIn, "day"), 1)
      : 0;

  const roomOccupants = rooms.flatMap((room, index) => [
    ...(room.adults || []).map((guest) => ({
      ...guest,
      occupantType: "adult",
      roomNumber: room.occupancyId ?? index + 1,
    })),
    ...(room.children || []).map((guest) => ({
      ...guest,
      occupantType: "child",
      roomNumber: room.occupancyId ?? index + 1,
    })),
  ]);
  const guests = contact.occupants?.length ? contact.occupants : roomOccupants;

  const confirmationNo =
    supplierBooking.confirmationNumber ||
    supplierBooking.bookingConfirmationId ||
    supplierBooking.crsPnr ||
    booking.voucherNumber;

  const autoDiscount = Number(offer.autoDiscount || 0);
  const couponDiscount = Number(offer.couponDiscount || 0);
  const totalDiscount = autoDiscount + couponDiscount;
  const payableAmount = booking.payableAmount ?? pricing.finalPrice;

  const policies =
    supplier.CancellationPolicy?.replaceAll("<br>", "\n")
      ?.split("\n")
      ?.map((item) => item.trim())
      ?.filter(Boolean) || [];

  const shareText = `
🏨 *${hotelName}*
📌 Booking Ref: ${booking.bookingRefNo}
📅 Check In: ${formatDate(booking.checkInDate)}
📅 Check Out: ${formatDate(booking.checkOutDate)}
✅ Status: ${status.label}
🌐 Booked via Destinoway
`;

  const handleConfirmCancellation = (remarks) => {
    cancelBooking({ bookingRefNo: booking.bookingRefNo, remarks }, {
      onSuccess: (response) => {
        message.success(response?.message || "Booking cancelled successfully");

        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking-details"] });

        setCancelModalOpen(false);
        setTimeout(goBack, 1000);
      },
      onError: (error) => {
        message.error(error?.response?.data?.message || "Cancellation failed");
      },
    });
  };

  const handleDownloadInvoice = () => {
    downloadInvoice(booking.bookingRefNo, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${booking.bookingRefNo}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
      onError: () => message.error("Unable to download invoice"),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-2xl border border-[#E5EEF7] bg-white px-5 py-4 shadow-[0_10px_35px_rgba(5,20,75,0.08)]">
        <h2 className="font-roboto mb-0! text-[20px] font-semibold text-[#05144b]">
          Booking Details
        </h2>
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-2 text-[15px] font-semibold text-[#05144b] cursor-pointer"
        >
          <ArrowLeftOutlined />
          Back
        </button>
      </div>

      {/* Hero */}
      <div className={cardClass}>
        <div className="bg-linear-to-r from-[#05144b] to-[#0c2fb1] p-5 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              {hotel.HotelImage ? (
                <img
                  src={hotel.HotelImage}
                  alt={hotelName}
                  className="h-[88px] w-[104px] shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[26px] text-[#fda20f]">
                  <HomeOutlined />
                </div>
              )}

              <div className="min-w-0">
                {rating > 0 && (
                  <div className="mb-1 flex gap-0.5 text-[#fda20f]">
                    {Array.from({ length: rating }).map((_, i) => (
                      <StarFilled key={i} />
                    ))}
                  </div>
                )}
                <h3 className="font-roboto! mb-1! text-[22px] leading-tight font-semibold text-white!">
                  {hotelName}
                </h3>
                <div className="flex items-start gap-2 text-white/80">
                  <EnvironmentOutlined className="mt-1" />
                  <span className="text-[14px]">{address || "--"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <span
                className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${STATUS_TONE_CLASSES[status.tone]}`}
              >
                {status.label}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${
                  isPaid
                    ? STATUS_TONE_CLASSES.green
                    : STATUS_TONE_CLASSES.orange
                }`}
              >
                Payment {isPaid ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-[#E5EEF7] bg-[#FAFCFF] px-3 py-5 sm:p-5">
            <div className="flex items-center justify-between gap-3 sm:gap-6">
              <div className="flex-1 text-center">
                <p className="mb-1 text-[12px] text-gray-500">Check-in</p>
                <p className="mb-0! text-[15px] leading-tight font-semibold text-[#05144b] sm:text-[22px]">
                  {formatDate(booking.checkInDate)}
                </p>
                <p className="mb-0! text-[12px] text-gray-500">
                  {formatDate(booking.checkInDate, "dddd")}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-center">
                <div className="rounded-full border border-[#fda20f] px-3 py-1 text-[12px] font-medium whitespace-nowrap text-[#05144b]">
                  <ClockCircleOutlined className="mr-1" />
                  {nights} Night{nights > 1 ? "s" : ""}
                </div>
                <p className="mt-2 mb-0! text-[12px] whitespace-nowrap text-gray-500">
                  {rooms.length || 1} Room • {guests.length} Guest
                  {guests.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex-1 text-center">
                <p className="mb-1 text-[12px] text-gray-500">Check-out</p>
                <p className="mb-0! text-[15px] leading-tight font-semibold text-[#05144b] sm:text-[22px]">
                  {formatDate(booking.checkOutDate)}
                </p>
                <p className="mb-0! text-[12px] text-gray-500">
                  {formatDate(booking.checkOutDate, "dddd")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile label="Booking ID" value={booking.bookingRefNo} />
            <InfoTile label="Confirmation No." value={confirmationNo} />
            <InfoTile
              label="Booked On"
              value={formatDate(booking.createdAt, "DD MMM YYYY, hh:mm A")}
            />
            <InfoTile
              label="Supplier Status"
              value={supplierBooking.bookingStatus || booking.ticketStatusDesc}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          {/* Guests */}
          <div className={cardClass}>
            <SectionHeader
              icon={<TeamOutlined />}
              title="Guest Details"
              subtitle={`${guests.length} guest${guests.length !== 1 ? "s" : ""}`}
            />

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              {guests.map((guest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-[#E5EEF7] bg-[#FAFCFF] p-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff4de] text-[14px] font-bold text-[#05144b]">
                    {`${guest.firstName?.[0] || ""}${guest.lastName?.[0] || ""}`}
                  </div>
                  <div className="min-w-0">
                    <p className="mb-0! truncate text-[14px] font-semibold text-[rgb(5,20,75)]">
                      {[guest.title, guest.firstName, guest.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                    <p className="mb-0! text-[12px] text-gray-500 capitalize">
                      {guest.occupantType}
                      {guest.roomNumber ? ` • Room ${guest.roomNumber}` : ""}
                    </p>
                  </div>
                </div>
              ))}

              {guests.length === 0 && (
                <p className="mb-0! text-gray-500">No guest details</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className={cardClass}>
            <SectionHeader
              icon={<UserOutlined />}
              title="Contact Details"
              subtitle="Primary contact for this booking"
            />
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              <InfoTile label="Name" value={contact.customerName} />
              <InfoTile label="Mobile" value={contact.customerMobile} />
              <div className="sm:col-span-2">
                <InfoTile
                  label="Address"
                  value={[contact.customerAddress, contact.customerPostalCode]
                    .filter(Boolean)
                    .join(", ")}
                />
              </div>
            </div>
          </div>

          {/* Cancellation */}
          <div className={cardClass}>
            <SectionHeader
              icon={<SafetyCertificateFilled />}
              title="Cancellation Policy"
            />
            <div className="space-y-3 p-5">
              {policies.length > 0 ? (
                policies.map((item, index) => {
                  const match = item.match(
                    /between date (.*?) - (.*?) deduct the amount is-(\d+\.?\d*)/i,
                  );

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-[#E5EEF7] bg-[#FAFCFF] p-4"
                    >
                      <CheckCircleFilled className="mt-0.5 shrink-0 !text-[18px] !text-[#22c55e]" />
                      {match ? (
                        <div>
                          <p className="mb-1! text-[14px] font-medium text-gray-800">
                            {match[1]} - {match[2]}
                          </p>
                          <p className="mb-0! text-[15px] font-semibold text-red-600">
                            Charge: {formatPrice(match[3])}
                          </p>
                        </div>
                      ) : (
                        <p className="mb-0! text-[14px] leading-6 text-gray-800">
                          {item}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-[14px] font-medium text-green-700">
                  No cancellation policy available.
                </div>
              )}

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800">
                Cancellation charges may vary depending on the cancellation
                date, supplier rules, and hotel policy.
              </div>
            </div>
          </div>

          {facilities.length > 0 && (
            <div className={cardClass}>
              <SectionHeader icon={<HomeOutlined />} title="Hotel Facilities" />
              <div className="flex flex-wrap gap-2 p-5">
                {facilities.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[#E5EEF7] bg-[#FAFCFF] px-3 py-1 text-[13px] text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          <div className={cardClass}>
            <SectionHeader icon={<EnvironmentOutlined />} title="Hotel Location" />
            <div className="p-5">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <iframe
                  title="hotel-location"
                  width="100%"
                  height="300"
                  loading="lazy"
                  className="border-0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    address || hotelName,
                  )}&z=15&output=embed`}
                />
              </div>
              <p className="mt-3 mb-0! text-[14px] text-gray-700">{address}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4 xl:sticky xl:top-5 xl:self-start">
          <div className={cardClass}>
            <SectionHeader icon={<CalendarOutlined />} title="Price Breakup" />
            <div className="p-5">
              <PriceRow
                label="Room Charges"
                value={formatPrice(pricing.baseAmount)}
              />
              {Number(pricing.serviceCharge) > 0 && (
                <PriceRow
                  label="Service Charge"
                  value={formatPrice(pricing.serviceCharge)}
                />
              )}
              <PriceRow
                label="Platform Fee & Taxes"
                value={formatPrice(pricing.platformFeeAndTax)}
                valueClass="text-orange-600"
              />
              {autoDiscount > 0 && (
                <PriceRow
                  label={`Auto Discount (${offer.autoCouponCode})`}
                  value={`-${formatPrice(autoDiscount)}`}
                  valueClass="text-green-600"
                />
              )}
              {couponDiscount > 0 && (
                <PriceRow
                  label={`Coupon (${offer.couponCode})`}
                  value={`-${formatPrice(couponDiscount)}`}
                  valueClass="text-green-600"
                />
              )}

              <div className="mt-4 rounded-xl bg-linear-to-r from-[#05144b] to-[#0c2fb1] p-4 text-white">
                <p className="mb-1 text-[12px] tracking-wide text-white/70 uppercase">
                  {isPaid ? "Total Paid" : "Total Payable"}
                </p>
                <p className="mb-0! text-[28px] leading-none font-bold text-white">
                  {formatPrice(payableAmount)}
                </p>
                {totalDiscount > 0 && (
                  <p className="mt-2 mb-0! text-[12px] text-[#7dffb0]">
                    You saved {formatPrice(totalDiscount)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={`${cardClass} flex flex-col gap-3 p-5`}>
            {isPaid && (
              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#05144b] bg-white text-[15px] font-semibold text-[#05144b] transition-all hover:bg-[#05144b] hover:text-white! disabled:opacity-60"
              >
                <DownloadOutlined />
                {downloading ? "Downloading..." : "Download Invoice"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E5EEF7] bg-[#FAFCFF] text-[15px] font-semibold text-[#05144b] transition-all hover:border-[#05144b]"
            >
              <ShareAltOutlined />
              Share Details
            </button>

            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                disabled={cancelling}
                className="flex h-11 items-center justify-center rounded-lg border border-red-300 bg-red-50 text-[15px] font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white! disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}

            <p className="mt-1 mb-0! flex items-center justify-center gap-2 text-[12px] text-gray-500">
              <PhoneOutlined /> Need help? Contact support from the Help tab.
            </p>
          </div>
        </div>
      </div>

      <CancelBookingModal
        open={cancelModalOpen}
        onCancel={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancellation}
        loading={cancelling}
        bookingRefNo={booking.bookingRefNo}
        hotelName={hotelName}
        cancellationCharge={0}
      />
      <ShareBookingModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareText={shareText}
      />
    </div>
  );
}
