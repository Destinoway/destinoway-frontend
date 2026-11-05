"use client";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { memo, useMemo, useState } from "react";

function SortBar({ sort, setSort }) {
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const tabs = useMemo(
    () => [
      {
        label: "User Rating",
        sub: "(Highest First)",
        value: "ratingHigh",
        icon: <StarOutlined />,
      },
      {
        label: "User Rating",
        sub: "(Lowest First)",
        value: "ratingLow",
        icon: <StarOutlined />,
      },
      {
        label: "Price",
        sub: "(Highest First)",
        value: "priceHigh",
        icon: <ArrowDownOutlined />,
      },
      {
        label: "Price",
        sub: "(Lowest First)",
        value: "priceLow",
        icon: <ArrowUpOutlined />,
      },
    ],
    [],
  );

  const handleSortChange = (value) => {
    setSort(sort === value ? null : value);
  };

  return (
    <div className="sticky top-24.5 z-999 w-full min-w-0 rounded-lg bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
      {/* Tablet: 650px to 850px */}
      <div className="relative hidden min-[650px]:max-[850px]:block">
        <button
          type="button"
          onClick={() => setMobileSortOpen((prev) => !prev)}
          className="flex h-9.5 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-white px-4 text-[14px] font-medium text-gray-700! transition-colors hover:bg-[#fff8ed] hover:text-[#e98b00]!"
        >
          Sort By
          {mobileSortOpen ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </button>

        {mobileSortOpen && (
          <div className="absolute top-full left-0 z-9999 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.15)]">
            {tabs.map((tab, index) => {
              const active = sort === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    handleSortChange(tab.value);
                    setMobileSortOpen(false);
                  }}
                  className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2 border-b border-gray-200 transition-colors ${
                    active ? "bg-[#fff8ed]" : "bg-white hover:bg-[#fff8ed]"
                  } ${index === tabs.length - 1 ? "border-b-0" : ""}`}
                >
                  <span
                    className={`flex items-center text-[13px] ${
                      tab.value.includes("rating")
                        ? "text-[#f5b400]"
                        : "text-[#344054]"
                    }`}
                  >
                    {tab.icon}
                  </span>

                  <span className="flex items-center gap-1">
                    <span
                      className={`text-[14px] font-medium ${
                        active ? "text-[#e98b00]" : "text-gray-800"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span className="text-[13px] text-gray-500">{tab.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: 851px and above */}
      <div className="hidden min-h-9.25 w-full min-w-0 items-center gap-3 px-2 min-[851px]:flex">
        <span className="shrink-0 text-[14px] font-semibold whitespace-nowrap text-[#344054]!">
          Sort By:
        </span>

        <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 max-[1100px]:gap-1.5">
          {tabs.map((tab) => {
            const active = sort === tab.value;
            const isRating = tab.value.includes("rating");

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleSortChange(tab.value)}
                className={`group flex h-8.5 min-w-0 shrink cursor-pointer items-center justify-center gap-1 rounded-full border px-2.5 whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e98b00]/40 active:scale-95 max-[1100px]:h-8 max-[1100px]:gap-0.75 max-[1100px]:px-1.75 ${
                  active
                    ? "border-[#e98b00] bg-[#fff8ed]"
                    : "border-[#dce3eb] hover:-translate-y-px hover:border-[#e98b00] hover:bg-[#fff8ed] hover:shadow-sm"
                }`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center text-[13px] max-[1100px]:text-[12px] ${
                    isRating ? "text-[#f5b400]" : "text-[#344054]"
                  }`}
                >
                  {tab.icon}
                </span>

                <span
                  className={`text-[13px] font-medium transition-colors max-[1100px]:text-[11px] ${
                    active
                      ? "text-[#e98b00]"
                      : "text-[#344054] group-hover:text-[#e98b00]"
                  }`}
                >
                  {tab.label}
                </span>

                <span
                  className={`text-[13px] transition-colors max-[1100px]:text-[10px] ${
                    active
                      ? "text-[#e98b00]"
                      : "text-[#8a98aa] group-hover:text-[#e98b00]/80"
                  }`}
                >
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(SortBar);
