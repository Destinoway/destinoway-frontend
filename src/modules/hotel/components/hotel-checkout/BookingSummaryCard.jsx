"use client";
 
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
 
const { Title, Text } = Typography;
 
export default function BookingSummaryCard({
  booking = {},
  hotel = {},
  room = {},
  search = {},
}) {
  const hotelName = hotel?.HotelName || hotel?.name || "Hotel";

  const roomName = room?.GroupName || room?.RoomName || "Room 1";

  const address =
    hotel?.Address ||
    hotel?.address ||
    [hotel?.City, hotel?.Country].filter(Boolean).join(", ");
 
  const bookingDate = booking?.createdAt
    ? dayjs(booking.createdAt).format("DD MMM YYYY, hh:mm A")
    : "--";
 
  const checkIn = search?.checkIn && dayjs(search.checkIn).isValid()
    ? dayjs(search.checkIn).format("DD MMM YYYY")
    : "--";

  const checkOut = search?.checkOut && dayjs(search.checkOut).isValid()
    ? dayjs(search.checkOut).format("DD MMM YYYY")
    : "--";

  const nights =
    search?.checkIn &&
    search?.checkOut &&
    dayjs(search.checkIn).isValid() &&
    dayjs(search.checkOut).isValid()
      ? Math.max(dayjs(search.checkOut).diff(dayjs(search.checkIn), "day"), 0)
      : 0;

  const reservationStatus =
    booking?.bookingStatus?.reservationStatus || "Pending";

  const paymentStatus = booking?.bookingStatus?.paymentStatus || "Pending";
  const formatStatus = (status) =>
    String(status)
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
 
  return (
    <Card
      className="overflow-hidden rounded-xl border border-[#E5EEF7] bg-white shadow-[0_10px_35px_rgba(5,20,75,0.08)]"
      styles={{ body: { padding: 0 } }}
      variant="borderless"
    >
      <div className="bg-linear-to-r from-[#05144b] to-[#0c2fb1] p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[26px] text-[#fda20f]">
            <HomeOutlined />
          </div>
          <div className="min-w-0">
            <div className="mb-1 flex gap-0.5 text-[#fda20f]">
              {Array.from({ length: Math.max(Number(hotel?.starRating) || 0, 0) }).map(
                (_, index) => (
                  <StarFilled key={index} />
                ),
              )}
            </div>
            <Title
              level={3}
              className="font-roboto !mb-1 !text-[22px] !font-semibold !text-white"
            >
              {hotelName}
            </Title>
            <div className="flex items-start gap-2 text-white/80">
              <EnvironmentOutlined className="mt-1" />
              <Text className="!text-[14px] !text-white/80">{address || "--"}</Text>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag color="green" className="!m-0 rounded-full">
                Reservation {formatStatus(reservationStatus)}
              </Tag>
              <Tag color="processing" className="!m-0 rounded-full">
                Payment {formatStatus(paymentStatus)}
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <Tag color="blue" className="!mb-3 rounded-full">
          {roomName}
        </Tag>
        <div className="rounded-xl border border-[#E5EEF7] bg-[#FAFCFF] px-3 py-5 sm:p-5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex-1 text-center">
              <Text className="block text-[12px] text-gray-500">Check-in</Text>
              <Text strong className="block text-[15px] leading-tight text-[#05144b] sm:text-[22px]">
                {checkIn}
              </Text>
              {search?.checkIn && dayjs(search.checkIn).isValid() && (
                <Text className="text-[12px] text-gray-500">
                  {dayjs(search.checkIn).format("dddd")}
                </Text>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-center">
              <div className="rounded-full border border-[#fda20f] px-3 py-1 text-[12px] font-medium whitespace-nowrap text-[#05144b]">
                <ClockCircleOutlined className="mr-1" />
                {nights} Night{nights > 1 ? "s" : ""}
              </div>
              <Text className="mt-2 text-center text-[11px] whitespace-nowrap text-gray-500 sm:text-[13px]">
                {search?.rooms?.length || 1} Room
                {search?.adults
                  ? ` • ${search.adults} Adult${search.adults > 1 ? "s" : ""}`
                  : ""}
                {search?.children
                  ? ` • ${search.children} Child${search.children > 1 ? "ren" : ""}`
                  : ""}
              </Text>
            </div>

            <div className="flex-1 text-center">
              <Text className="block text-[12px] text-gray-500">Check-out</Text>
              <Text strong className="block text-[15px] leading-tight text-[#05144b] sm:text-[22px]">
                {checkOut}
              </Text>
              {search?.checkOut && dayjs(search.checkOut).isValid() && (
                <Text className="text-[12px] text-gray-500">
                  {dayjs(search.checkOut).format("dddd")}
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-[#FAFCFF] p-3">
            <Text className="block text-[11px] tracking-wide text-gray-500 uppercase">
              Booking Reference
            </Text>
            <Text strong className="text-[14px] break-all text-[#05144b]">
              {booking?.bookingReference || "--"}
            </Text>
          </div>
          <div className="rounded-lg border border-gray-100 bg-[#FAFCFF] p-3">
            <Text className="block text-[11px] tracking-wide text-gray-500 uppercase">
              Booking Date
            </Text>
            <Text strong className="text-[14px] text-[#05144b]">
              {bookingDate}
            </Text>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-5 flex gap-3 rounded-xl border border-[#d8e4f5] bg-[#FAFCFF] px-4 py-3">
        <CheckCircleFilled className="mt-0.5 flex-shrink-0 text-[18px] text-[#0f766e]" />
        <div>
          <Text strong className="block text-[#05144b]">
            {String(reservationStatus).toLowerCase() === "confirmed"
              ? "Reservation Confirmed"
              : `Reservation ${formatStatus(reservationStatus)}`}
          </Text>
          <Text className="text-[13px] text-gray-500">
            {String(paymentStatus).toLowerCase() === "paid"
              ? "Your payment has been received."
              : "Complete your payment to confirm your booking."}
          </Text>
        </div>
      </div>
    </Card>
  );
}