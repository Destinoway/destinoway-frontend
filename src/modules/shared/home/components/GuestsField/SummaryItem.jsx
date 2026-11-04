"use client";

import { memo } from "react";

function SummaryItem({ value, label, center = false, right = false }) {
  return (
    <div
      className={`flex flex-col ${
        center ? "items-center" : right ? "items-end" : "items-start"
      }`}
    >
      <span className="font-jost text-[18px] leading-none text-gray-700 min-[700px]:font-medium! min-[700px]:text-gray-800! sm:text-[22px] md:text-[28px] lg:text-[26px] max-[777px]:text-[20px] max-[777px]:font-semibold max-[777px]:text-gray-900">
        {value}
      </span>

      <span className="mt-1 text-[12px] font-medium text-gray-500 max-[777px]:text-[10px] max-[777px]:tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default memo(SummaryItem);
