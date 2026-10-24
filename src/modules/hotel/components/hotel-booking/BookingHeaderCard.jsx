"use client";

import { StarFilled } from "@ant-design/icons";
import { Card, Typography } from "antd";
import Image from "next/image";

const { Title, Text } = Typography;

export default function BookingHeaderCard({ bookingData }) {
  const hotelName = bookingData?.name || "Hotel";
  const location = bookingData?.location || {};
  const address = location?.address || "";

  const fullLocation = [location?.city, location?.state, location?.country]
    .filter(Boolean)
    .join(", ");

  const hotelImage = bookingData?.image || "/no-room.jpg";

  const rating = Math.min(
    Math.max(Number(bookingData?.starCategory || 0), 0),
    5,
  );

  const room = bookingData?.rooms?.[0] || bookingData?.selectedRoom || {};

  const roomName = room?.roomType || room?.GroupName || "Selected Room";

  return (
    <Card
      className="!mb-3 !overflow-hidden !rounded-xl !border !border-gray-200 !bg-white !shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex flex-row items-stretch gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Hotel Image - Left Side */}
        <div className="relative min-h-[150px] w-[115px] shrink-0 self-stretch overflow-hidden rounded-lg sm:min-h-[180px] sm:w-[180px] lg:min-h-[200px] lg:w-[240px]">
          <Image
            src={hotelImage}
            alt={hotelName}
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 180px, 115px"
            className="object-cover"
            priority
          />
        </div>

        {/* Hotel Details - Right Side */}
        <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
          <Title
            level={5}
            className="!mb-2 !text-[17px] !leading-5 !font-semibold !text-black sm:!text-[18px] sm:!leading-6"
          >
            {hotelName}
          </Title>

          {/* Rating and Status */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {rating > 0 && (
              <div className="flex items-center gap-[2px]">
                {[1, 2, 3, 4, 5].map((item) => (
                  <StarFilled
                    key={item}
                    className={`!text-[10px] sm:!text-[12px] ${
                      item <= rating ? "!text-[#F5A623]" : "!text-[#D9DEE7]"
                    }`}
                  />
                ))}
              </div>
            )}

            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
              Selected
            </span>

            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-600">
              Confirming
            </span>
          </div>

          {/* Address */}
          {address && (
            <Text className="!mb-1 !block !text-[11px] !leading-[17px] !text-gray-500 sm:!text-[13px] sm:!leading-5">
              {address}
            </Text>
          )}

          {/* City, State, Country */}
          {fullLocation && (
            <Text className="!block !text-[11px] !leading-[17px] !text-gray-400 sm:!text-[12px] sm:!leading-5">
              {fullLocation}
            </Text>
          )}

          {/* Room Name */}
          <div className="mt-3 border-t border-gray-100 pt-3">
            <Text className="!mb-1 !block !text-[10px] !text-gray-400 sm:!text-[11px]">
              Selected Room
            </Text>

            <span className="inline-block max-w-full rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-600 sm:text-[12px]">
              {roomName}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
