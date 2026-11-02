"use client";

import CompactItem from "./CompactItem";
import SummaryItem from "./SummaryItem";

export default function GuestTrigger({ variant = "default", value, icon }) {
  if (variant === "compact") {
    return (
      <div
        className="flex cursor-pointer items-center gap-3 rounded border border-gray-300 bg-white px-3 transition-all hover:border-gray-300 sm:h-[50px]"
      >
        {/* ICON */}
        {icon && (
          <div className="flex items-center justify-center !text-[24px] !text-gray-900">
            {icon}
          </div>
        )}

        <div className="flex h-full flex-1 items-center justify-between gap-2">
          <CompactItem value={value?.rooms || 1} label="Room" />

          <CompactItem value={value?.adults || 1} label="Adults" center />

          <CompactItem value={value?.children || 0} label="Children" right />
        </div>
      </div>
    );
  }

  return (
    <>
      <span className="mb-2 block text-[14px] font-semibold text-[#222]">
        Rooms & Guests
      </span>

      <div className="h-[65px] rounded-md border border-[#d9d9d9] bg-white px-4 py-3 transition-all hover:border-[#0077b6]">
        <div className="flex h-full items-center gap-3">
          {/* ICON */}
          {icon && (
            <div className="flex items-center justify-center text-gray-400">
              {icon}
            </div>
          )}

          <div className="flex flex-1 items-center justify-between">
            <SummaryItem value={value?.rooms || 1} label="ROOM" />

            <SummaryItem value={value?.adults || 1} label="ADULTS" center />

            <SummaryItem value={value?.children || 0} label="CHILDREN" right />
          </div>
        </div>
      </div>
    </>
  );
}
