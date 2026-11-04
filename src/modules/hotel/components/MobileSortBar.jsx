"use client";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleFilled,
  StarOutlined,
} from "@ant-design/icons";
import { memo } from "react";

export const SORT_OPTIONS = [
  {
    label: "User Rating",
    sub: "Highest First",
    value: "ratingHigh",
    icon: <StarOutlined />,
  },
  {
    label: "User Rating",
    sub: "Lowest First",
    value: "ratingLow",
    icon: <StarOutlined />,
  },
  {
    label: "Price",
    sub: "Highest First",
    value: "priceHigh",
    icon: <ArrowDownOutlined />,
  },
  {
    label: "Price",
    sub: "Lowest First",
    value: "priceLow",
    icon: <ArrowUpOutlined />,
  },
];

// Full-width panel of tappable option buttons; parent controls placement.
function MobileSortBar({ sort, setSort }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Sort hotels by
      </p>

      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        {SORT_OPTIONS.map((option) => {
          const active = sort === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => setSort(active ? null : option.value)}
              className={`flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left shadow-sm transition-all duration-200 active:scale-[0.98] ${
                active
                  ? "border-[#e98b00] bg-[#fff8ed]"
                  : "border-gray-300 bg-white hover:border-[#e98b00] hover:bg-[#fffaf3]"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] ${
                  active
                    ? "bg-[#e98b00] text-white"
                    : option.value.includes("rating")
                      ? "bg-[#fff7e0] text-[#f5b400]"
                      : "bg-gray-100 text-[#344054]"
                }`}
              >
                {option.icon}
              </span>

              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span
                  className={`text-[14px] font-semibold ${
                    active ? "text-[#e98b00]" : "text-gray-800"
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-[12px] text-gray-500">{option.sub}</span>
              </span>

              {active && (
                <CheckCircleFilled className="shrink-0 text-[16px] text-[#e98b00]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(MobileSortBar);
