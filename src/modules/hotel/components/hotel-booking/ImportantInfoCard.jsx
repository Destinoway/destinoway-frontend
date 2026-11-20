"use client";

import SectionCard from "@/modules/hotel/components/hotels/viewhotles/HotelSections/SectionCard";
import { DownOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const VISIBLE_COUNT = 4;

const getInfoText = (item) => {
  if (typeof item === "string" || typeof item === "number") {
    return String(item).trim();
  }

  if (item && typeof item === "object") {
    return String(
      item?.text || item?.description || item?.value || item?.type || "",
    ).trim();
  }

  return "";
};

export default function ImportantInfoCard({ bookingData }) {
  const [expanded, setExpanded] = useState(false);

  const rawInfo = bookingData?.importantInformation;
  const info = (Array.isArray(rawInfo) ? rawInfo : rawInfo ? [rawInfo] : [])
    .map(getInfoText)
    .filter(Boolean);

  const visibleItems = expanded ? info : info.slice(0, VISIBLE_COUNT);

  return (
    <SectionCard
      icon={<InfoCircleOutlined />}
      title="Important Information"
      subtitle="Please read before you book"
    >
      {visibleItems.length > 0 ? (
        <ul className="m-0 list-none space-y-3 p-0">
          {visibleItems.map((text, index) => (
            <li
              key={`${index}-${text.slice(0, 20)}`}
              className="flex items-start gap-3 text-[13px] leading-6 text-gray-600 sm:text-sm"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--theme-secondary)" />
              <span className="min-w-0 wrap-break-word">{text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-sm text-gray-500">
          No important information available.
        </p>
      )}

      {info.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[13px] font-semibold text-(--theme-secondary)"
        >
          {expanded ? "View less" : `View ${info.length - VISIBLE_COUNT} more`}
          <DownOutlined
            className={`text-[10px] transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </SectionCard>
  );
}
