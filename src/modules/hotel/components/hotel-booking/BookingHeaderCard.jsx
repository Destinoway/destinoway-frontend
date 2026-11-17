"use client";

import { EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import Image from "next/image";

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

  const facilities = (
    Array.isArray(bookingData?.facilities) ? bookingData.facilities : []
  )
    .map((facility) =>
      typeof facility === "string"
        ? facility
        : facility?.name || facility?.description || "",
    )
    .filter(Boolean);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex gap-3 p-3 sm:gap-5 sm:p-4">
        <div className="relative min-h-35 w-27 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:min-h-42.5 sm:w-50 lg:w-57.5">
          <Image
            src={hotelImage}
            alt={hotelName}
            fill
            sizes="(min-width: 1024px) 230px, (min-width: 640px) 200px, 108px"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col py-0.5">
          {rating > 0 && (
            <div className="mb-1.5 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <StarFilled
                  key={item}
                  className={`text-[11px] sm:text-[12px] ${
                    item <= rating ? "text-[#F5A623]!" : "text-[#D9DEE7]!"
                  }`}
                />
              ))}
              <span className="ml-1.5 text-[11px] font-semibold text-gray-500">
                {rating}-star hotel
              </span>
            </div>
          )}

          <h2 className="m-0 text-[16px] leading-snug font-bold text-(--theme-text-primary) sm:text-[20px]">
            {hotelName}
          </h2>

          {(address || fullLocation) && (
            <p className="m-0 mt-1.5 flex items-start gap-1.5 text-[12px] leading-5 text-gray-500 sm:text-[13px]">
              <EnvironmentOutlined className="mt-1 shrink-0 text-(--theme-secondary)" />
              <span className="min-w-0">
                {[address, fullLocation].filter(Boolean).join(", ")}
              </span>
            </p>
          )}

          {facilities.length > 0 && (
            <div className="mt-2.5 hidden flex-wrap gap-1.5 sm:flex">
              {facilities.slice(0, 4).map((facility) => (
                <span
                  key={facility}
                  className="rounded-full border border-gray-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                >
                  {facility}
                </span>
              ))}
              {facilities.length > 4 && (
                <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                  +{facilities.length - 4} more
                </span>
              )}
            </div>
          )}

          <div className="mt-auto pt-3">
            <div className="inline-flex max-w-full flex-col rounded-xl border border-(--theme-secondary)/15 bg-(--theme-secondary)/5 px-3 py-2">
              <span className="text-[10px] font-bold tracking-[0.08em] text-gray-500 uppercase">
                Your room
              </span>
              <span className="truncate text-[13px] font-bold text-(--theme-secondary) sm:text-[14px]">
                {roomName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
