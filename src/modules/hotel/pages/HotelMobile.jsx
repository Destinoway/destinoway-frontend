"use client";

import { Drawer } from "antd";
import { useState } from "react";

import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import SidebarFilters from "../cards/SidebarFilters";
import HotelList from "../components/hotels/HotelList";
import SearchBar from "../components/hotels/SearchBar";
import MobileSortBar from "../components/MobileSortBar";
import HotelsSeoSection from "../seo/HotelsSeoSection";

const defaultFilters = {
  price: null,
  rating: null,
  amenities: [],
};

export default function HotelMobile({
  filters,
  setFilters,
  appliedSearchData,
  sort,
  setSort,
  setMapOpen,
  setHotelsForMap,
  setHotelsLoading,
  setHasHotels,
  cms,
}) {
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  console.log("appliedSearchData in mobile", appliedSearchData);

  const handleReset = () => {
    setSort(null);
    setFilters(defaultFilters);
    setShowSort(false);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-[#eef6fd]">
      {/* Header */}
      <SearchBar />
      {/* Controls */}
      <div className="background-color-bg min-h-screen">
        <div className="sticky top-[62px] z-40 bg-[#eef6fd] px-1 pt-1 pr-2 pb-1 !shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
          <div className="ml-2 grid grid-cols-3 gap-2">
            {/* SORT */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="w-full rounded border border-gray-300 bg-white p-1 font-medium"
              >
                Sort By
              </button>

              {showSort && (
                <div className="absolute top-full z-50 mt-2 w-[260px]">
                  <MobileSortBar
                    sort={sort}
                    setSort={(val) => {
                      setSort(val);
                      setShowSort(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* FILTER */}
            <button
              onClick={() => setShowFilters(true)}
              className="rounded border border-gray-300 bg-white p-1 font-medium"
            >
              Filter
            </button>

            {/* RESET */}
            <button
              onClick={handleReset}
              className="rounded border border-gray-300 bg-white p-1 font-medium text-red-600"
            >
              Reset
            </button>
          </div>
        </div>

        {/* DRAWER */}
        <Drawer
          title="Filters"
          placement="right"
          open={showFilters}
          onClose={() => setShowFilters(false)}
          size="85%"
          destroyOnClose={false}
          styles={{ body: { padding: 0 } }}
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

        {cms && (
          <HotelsSeoSection>
            <CMSContentRenderer cms={cms} />
          </HotelsSeoSection>
        )}
      </div>
    </div>
  );
}
