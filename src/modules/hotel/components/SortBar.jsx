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
    <div className="sticky top-[98px] z-[999] w-full min-w-0 rounded-[6px] bg-white p-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
      {/* Tablet: 650px to 850px */}
      <div className="relative hidden min-[650px]:max-[850px]:block">
        <button
          type="button"
          onClick={() => setMobileSortOpen((prev) => !prev)}
          className="flex h-[38px] w-full items-center justify-center gap-2 rounded-[5px] bg-white px-4 text-[14px] font-medium !text-gray-700"
        >
          Sort By
          {mobileSortOpen ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </button>

        {mobileSortOpen && (
          <div className="absolute top-full left-0 z-[9999] mt-[4px] w-full overflow-hidden rounded-[6px] border border-gray-200 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.15)]">
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
                  className={`flex h-[48px] w-full items-center justify-center gap-2 border-b border-gray-200 ${
                    active ? "bg-[#fff8ed]" : "bg-white hover:bg-gray-50"
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
      <div className="hidden min-h-[37px] w-full min-w-0 items-center gap-2 px-[6px] min-[851px]:flex">
        <span className="shrink-0 text-[14px] font-semibold whitespace-nowrap !text-[#344054]">
          Sort By:
        </span>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-[6px]">
          {tabs.map((tab) => {
            const active = sort === tab.value;
            const isRating = tab.value.includes("rating");

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleSortChange(tab.value)}
                className={`flex h-[34px] min-w-0 shrink items-center justify-center gap-[4px] rounded-full border px-[10px] whitespace-nowrap transition-colors duration-200 focus:outline-none max-[1100px]:h-[32px] max-[1100px]:gap-[3px] max-[1100px]:px-[7px] ${
                  active
                    ? "border-[#e98b00]"
                    : "border-[#dce3eb]  hover:border-[#c7d0da] hover:bg-[#f9fafb]"
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
                  className={`text-[13px] font-medium max-[1100px]:text-[11px] ${
                    active ? "text-[#e98b00]" : "text-[#344054]"
                  }`}
                >
                  {tab.label}
                </span>

                <span
                  className={`text-[13px] max-[1100px]:text-[10px] ${
                    active ? "text-[#e98b00]" : "text-[#8a98aa]"
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
