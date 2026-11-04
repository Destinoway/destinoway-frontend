"use client";

import CompactItem from "./CompactItem";
import SummaryItem from "./SummaryItem";

export default function GuestTrigger({ variant = "default", value, icon }) {
  if (variant === "compact") {
    return (
      <div className="flex cursor-pointer items-center gap-3 rounded border border-gray-300 bg-white px-3 transition-all hover:border-gray-300 sm:h-[50px]">
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
      <span className="mb-2 block text-[14px] font-semibold text-[#222] max-[777px]:mb-1.5 max-[777px]:text-[11px] max-[777px]:font-bold max-[777px]:tracking-[0.08em] max-[777px]:text-gray-500 max-[777px]:uppercase">
        Rooms & Guests
      </span>

      <div className="h-[65px] rounded-md border border-[#d9d9d9] bg-white px-4 py-3 transition-all hover:border-[#0077b6] max-[777px]:h-[64px] max-[777px]:rounded-xl max-[777px]:border-gray-200 max-[777px]:px-3 max-[777px]:py-0 max-[777px]:shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="flex h-full items-center gap-3">
          {/* ICON */}
          {icon && (
            <div className="flex items-center justify-center text-gray-400 max-[777px]:h-9 max-[777px]:w-9 max-[777px]:shrink-0 max-[777px]:rounded-lg max-[777px]:bg-(--theme-secondary)/8 max-[777px]:[&_.anticon]:!text-[16px] max-[777px]:[&_.anticon]:!text-(--theme-secondary)">
              {icon}
            </div>
          )}

          <div className="flex flex-1 items-center justify-between max-[777px]:pl-1">
            <SummaryItem value={value?.rooms || 1} label="ROOM" />

            <SummaryItem value={value?.adults || 1} label="ADULTS" center />

            <SummaryItem value={value?.children || 0} label="CHILDREN" right />
          </div>
        </div>
      </div>
    </>
  );
}
