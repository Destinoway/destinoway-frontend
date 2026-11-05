"use client";

import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const DateBlock = ({ label, date, time, align = "left" }) => (
  <div className={`min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
    <p className="m-0 text-[10px] font-bold tracking-widest text-gray-400 uppercase sm:text-[11px]">
      {label}
    </p>
    <p className="m-0 mt-1 text-[15px] leading-tight font-bold text-(--theme-text-primary) sm:text-[18px]">
      {date ? dayjs(date).format("DD MMM") : "-"}
      {date && (
        <span className="ml-1 text-[12px] font-semibold text-gray-500 sm:text-[13px]">
          {dayjs(date).format("YYYY")}
        </span>
      )}
    </p>
    <p className="m-0 mt-0.5 text-[11px] text-gray-500 sm:text-[12px]">
      {date ? dayjs(date).format("dddd") : ""}
      {time ? ` · ${time}` : ""}
    </p>
  </div>
);

export default function StaySummaryCard({ bookingData, occupancy = [] }) {
  const searchData = bookingData?.searchData || {};

  const checkIn = bookingData?.checkIn?.date || searchData?.checkIn || "";
  const checkOut = bookingData?.checkOut?.date || searchData?.checkOut || "";

  const nights =
    checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), "day") : 0;

  const fallbackRooms = Math.max(Number(searchData?.rooms) || 1, 1);
  const fallbackAdults = Math.max(Number(searchData?.adults) || 1, 1);
  const fallbackChildren = Math.max(Number(searchData?.children) || 0, 0);

  const rooms = occupancy.length || fallbackRooms;

  const adults = occupancy.length
    ? occupancy.reduce((total, room) => total + (Number(room?.adults) || 0), 0)
    : fallbackAdults;

  const children = occupancy.length
    ? occupancy.reduce(
        (total, room) => total + (Number(room?.children) || 0),
        0,
      )
    : fallbackChildren;

  const guestSummary = [
    `${adults} ${adults === 1 ? "Adult" : "Adults"}`,
    children > 0 ? `${children} ${children === 1 ? "Child" : "Children"}` : "",
    `${rooms} ${rooms === 1 ? "Room" : "Rooms"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-4 sm:px-6">
        <DateBlock
          label="Check-in"
          date={checkIn}
          time={bookingData?.checkIn?.time}
        />

        <div className="flex items-center gap-1.5">
          <span className="hidden h-px w-8 bg-gray-200 sm:block md:w-14" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--theme-secondary)/20 bg-(--theme-secondary)/8 px-3 py-1 text-[11px] font-bold whitespace-nowrap text-(--theme-secondary) sm:text-[12px]">
            <CalendarOutlined />
            {nights} {nights === 1 ? "Night" : "Nights"}
          </span>
          <span className="hidden h-px w-8 bg-gray-200 sm:block md:w-14" />
        </div>

        <DateBlock
          label="Check-out"
          date={checkOut}
          time={bookingData?.checkOut?.time}
          align="right"
        />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 bg-slate-50/70 px-4 py-2.5 text-[12px] font-semibold text-gray-600 sm:px-6 sm:text-[13px]">
        <TeamOutlined className="text-(--theme-secondary)" />
        {guestSummary}
      </div>
    </div>
  );
}
