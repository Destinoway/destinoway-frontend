"use client";

import {
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Drawer } from "antd";
import { useState } from "react";

import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import SidebarFilters, {
  DEFAULT_HOTEL_FILTERS,
  FILTER_THEME,
} from "../cards/SidebarFilters";
import HotelList from "../components/hotels/HotelList";
import SearchBar from "../components/hotels/SearchBar";
import MobileSortBar from "../components/MobileSortBar";
import DynamicSeoFallback from "../seo/DynamicSeoFallback";
import HotelsSeoSection from "../seo/HotelsSeoSection";

const controlButtonClass =
  "relative flex w-full min-w-0 cursor-pointer items-center justify-center gap-1 rounded-lg border bg-white px-1 py-1.5 text-[14px] font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 active:bg-gray-50";

export default function HotelMobile({
  filters,
  setFilters,
  appliedSearchData,
  sort,
  setSort,
  setMapOpen,
  setHotelsForMap,
  hotelsLoading,
  setHotelsLoading,
  hasHotels,
  setHasHotels,
  cms,
}) {
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleReset = () => {
    setSort(null);
    setFilters(DEFAULT_HOTEL_FILTERS);
    setShowSort(false);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-[#eef6fd]">
      {/* Header */}
      <SearchBar />
      {/* Controls */}
      <div className="background-color-bg min-h-screen">
        <div className="sticky top-15.5 z-40 bg-[#eef6fd] px-1 pt-1 pr-2 pb-1 shadow-[0_4px_8px_rgba(0,0,0,0.12)]!">
          <div className="ml-2 grid grid-cols-3 gap-2">
            {/* SORT */}
            <button
              type="button"
              aria-expanded={showSort}
              onClick={() => setShowSort((open) => !open)}
              className={`${controlButtonClass} ${
                sort || showSort
                  ? "border-[#e98b00] text-[#e98b00]"
                  : "border-gray-300 text-gray-800"
              }`}
            >
              <SwapOutlined className="rotate-90 text-[13px]" />
              Sort By
              {sort && (
                <span
                  aria-label="Sort applied"
                  className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#e98b00]"
                />
              )}
              <DownOutlined
                className={`text-[10px] transition-transform duration-200 ${
                  showSort ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* FILTER */}
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className={`${controlButtonClass} border-gray-300 text-gray-800`}
            >
              <FilterOutlined className="text-[13px]" />
              Filter
            </button>

            {/* RESET */}
            <button
              type="button"
              onClick={handleReset}
              className={`${controlButtonClass} border-gray-300 text-red-600`}
            >
              <ReloadOutlined className="text-[13px]" />
              Reset
            </button>
          </div>

          {/* Sort options: full width below the controls */}
          {showSort && (
            <>
              <div
                aria-hidden="true"
                className="fixed inset-0 z-0 bg-black/20"
                onClick={() => setShowSort(false)}
              />
              <div className="absolute top-full right-0 left-0 z-10 mt-1 px-2">
                <MobileSortBar
                  sort={sort}
                  setSort={(val) => {
                    setSort(val);
                    setShowSort(false);
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* DRAWER */}
        <ConfigProvider theme={FILTER_THEME}>
          <Drawer
            title="Filters"
            placement="right"
            open={showFilters}
            onClose={() => setShowFilters(false)}
            size="85%"
            // Pre-render and keep mounted so opening only runs the slide animation.
            forceRender
            destroyOnHidden={false}
            styles={{ body: { padding: 0, overscrollBehavior: "contain" } }}
          >
            <SidebarFilters
              filters={filters}
              setFilters={setFilters}
              onClose={() => setShowFilters(false)}
              onMapClick={() => {
                setShowFilters(false);
                setMapOpen(true);
              }}
            />
          </Drawer>
        </ConfigProvider>

        {/* HOTEL LIST */}
        <div id="hotel-list-section" className="mt-3 px-2">
          <HotelList
            searchData={appliedSearchData}
            filters={filters}
            sort={sort}
            onHotelsChange={setHotelsForMap}
            onLoadingChange={setHotelsLoading}
            onResultChange={setHasHotels}
          />
        </div>

        {/* CMS content when the city has a page, otherwise static content */}
        {cms ? (
          <HotelsSeoSection>
            <CMSContentRenderer cms={cms} />
          </HotelsSeoSection>
        ) : (
          !hotelsLoading &&
          hasHotels && (
            <HotelsSeoSection>
              <DynamicSeoFallback cityName={appliedSearchData?.city} />
            </HotelsSeoSection>
          )
        )}
      </div>
    </div>
  );
}
