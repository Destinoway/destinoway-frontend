"use client";

import { Tooltip } from "antd";

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div
      role="group"
      aria-label="Choose a travel service"
      className="-mt-12 mb-4 flex justify-center gap-3 pb-2 sm:-mt-14 sm:gap-4 md:-mt-19 md:mb-5 md:gap-10 md:pb-3"
    >
      {tabs.map((tab) => {
        const isDisabled = !tab.enabled;
        const isActive = activeTab === tab.key;

        const tabButton = (
          <div key={tab.key} className="flex flex-col items-center">
            <button
              type="button"
              aria-label={`${tab.label}${isDisabled ? ", coming soon" : ""}`}
              aria-pressed={isActive}
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                setActiveTab(tab.key);
              }}
              className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 sm:h-16 sm:w-16 md:h-17 md:w-17 ${
                isActive
                  ? "buttion-background-color scale-105 shadow-lg"
                  : "bg-white shadow-md shadow-gray-300"
              } ${
                isDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:scale-105 hover:shadow-lg"
              }`}
            >
              <div
                className={`h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 ${
                  isActive ? "theme-icon-white" : "theme-icon-secondary"
                }`}
                style={{
                  maskImage: `url(${tab.icon})`,
                  WebkitMaskImage: `url(${tab.icon})`,
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                }}
              />
            </button>

            {/* Mobile Text */}
            <span
              className={`mt-2 text-[11px] font-semibold md:hidden ${
                isActive ? "text-[#051449]" : "most-text-color"
              }`}
            >
              {tab.key === "hotel"
                ? "Hotel"
                : tab.key === "flight"
                  ? "Flight"
                  : "Bus"}
            </span>
          </div>
        );

        return isDisabled ? (
          <Tooltip
            key={tab.key}
            title={<span className="text-xs">Coming Soon 🚀</span>}
          >
            <div>{tabButton}</div>
          </Tooltip>
        ) : (
          tabButton
        );
      })}
    </div>
  );
}
