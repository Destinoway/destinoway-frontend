"use client";

import { Checkbox, Collapse, Input } from "antd";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const popularOptions = [
  { label: "Akbar Choice", key: "isRecommended" },
  { label: "Free Cancellation", key: "freeCancellation" },
  { label: "Breakfast Available", key: "freeBreakfast" },
  { label: "Wifi", key: "wifi" },
];

const customerRatingOptions = [
  { label: "4.5 & Above Excellent", value: 4.5 },
  { label: "4 & Above Very Good", value: 4 },
  { label: "3.5 & Above Good", value: 3.5 },
];

const starOptions = [
  { label: "★★★★★", value: 5 },
  { label: "★★★★", value: 4 },
  { label: "★★★", value: 3 },
  { label: "★★", value: 2 },
  { label: "★", value: 1 },
  { label: "General", value: 0 },
];

const amenityOptions = [
  "Conveniences",
  "Room Service",
  "Air Conditioning",
  "Medical",
  "Parking",
  "Breakfast",
  "Internet",
  "Garden",
  "Spa",
  "Restaurant",
];

const chainOptions = [
  "Independent",
  "Marriott",
  "Louvre Hotels",
  "Independent Hotel",
  "No chain",
];

const propertyOptions = [
  "Hotel",
  "Resort",
  "GuestHouse",
  "Bed & breakfast",
  "Hostel",
];

const priceRanges = [
  { label: "₹ 0 - ₹ 3000", min: 0, max: 3000 },
  { label: "₹ 3000 - ₹ 6000", min: 3000, max: 6000 },
  { label: "₹ 6000 - ₹ 10000", min: 6000, max: 10000 },
  { label: "₹ 10000+", min: 10000, max: 50000 },
];

const DEFAULT_FILTERS = {
  search: "",
  minPrice: "",
  maxPrice: "",
  isRecommended: false,
  freeCancellation: false,
  freeBreakfast: false,
  minReviewRating: undefined,
  starRatings: [],
  amenities: [],
  chainProperties: [],
  propertyType: [],
  availableOnly: false,
};

function SidebarFilters({
  filters = {},
  setFilters,
  onMapClick,
  onClose,
  hideMapSection = false,
}) {
  const [tempFilters, setTempFilters] = useState({
    ...DEFAULT_FILTERS,
    ...filters,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllChains, setShowAllChains] = useState(false);
  const [showAllProperties, setShowAllProperties] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setTempFilters({ ...DEFAULT_FILTERS, ...filters });
  }, [filters]);

  const currentFilters = isMobile
    ? tempFilters
    : { ...DEFAULT_FILTERS, ...filters };

  const updateFilters = useCallback(
    (updater) => {
      if (isMobile) {
        setTempFilters((previous) => {
          const base = { ...DEFAULT_FILTERS, ...previous };
          return typeof updater === "function"
            ? updater(base)
            : { ...base, ...updater };
        });
      } else {
        setFilters?.((previous) => {
          const base = { ...DEFAULT_FILTERS, ...(previous || {}) };
          return typeof updater === "function"
            ? updater(base)
            : { ...base, ...updater };
        });
      }
    },
    [isMobile, setFilters],
  );

  const handleSearch = useCallback(
    (event) =>
      updateFilters((previous) => ({
        ...previous,
        search: event.target.value,
      })),
    [updateFilters],
  );

  const toggleArrayValue = useCallback(
    (key, value) => {
      updateFilters((previous) => {
        const current = Array.isArray(previous[key]) ? previous[key] : [];
        return {
          ...previous,
          [key]: current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value],
        };
      });
    },
    [updateFilters],
  );

  const toggleBoolean = useCallback(
    (key) =>
      updateFilters((previous) => ({ ...previous, [key]: !previous[key] })),
    [updateFilters],
  );

  const handleCustomerRating = useCallback(
    (value) =>
      updateFilters((previous) => ({
        ...previous,
        minReviewRating: previous.minReviewRating === value ? undefined : value,
      })),
    [updateFilters],
  );

  const handlePriceRange = useCallback(
    (min, max) =>
      updateFilters((previous) => ({
        ...previous,
        minPrice: String(min),
        maxPrice: String(max),
      })),
    [updateFilters],
  );

  const handleCustomPrice = useCallback(
    (key, value) =>
      updateFilters((previous) => ({ ...previous, [key]: value })),
    [updateFilters],
  );

  const handlePopularFilter = useCallback(
    (key) => {
      if (key === "wifi") {
        toggleArrayValue("amenities", "Internet");
        return;
      }
      toggleBoolean(key);
    },
    [toggleArrayValue, toggleBoolean],
  );

  const filterSections = useMemo(() => {
    const visibleAmenities = showAllAmenities
      ? amenityOptions
      : amenityOptions.slice(0, 5);
    const visibleChains = showAllChains
      ? chainOptions
      : chainOptions.slice(0, 5);
    const visibleProperties = showAllProperties
      ? propertyOptions
      : propertyOptions.slice(0, 5);

    return [
      {
        key: "popular",
        title: "POPULAR FILTER",
        content: (
          <div className="flex flex-col gap-2 text-[13px] md:text-sm">
            {popularOptions.map((option) => {
              const checked =
                option.key === "wifi"
                  ? currentFilters.amenities?.includes("Internet") || false
                  : Boolean(currentFilters[option.key]);
              return (
                <Checkbox
                  key={option.key}
                  checked={checked}
                  onChange={() => handlePopularFilter(option.key)}
                >
                  {option.label}
                </Checkbox>
              );
            })}
          </div>
        ),
      },
      {
        key: "price",
        title: "PRICE PER NIGHT",
        content: (
          <>
            <div className="flex flex-col gap-2 text-[13px] md:text-sm">
              {priceRanges.map((item) => (
                <Checkbox
                  key={item.label}
                  checked={
                    Number(currentFilters.minPrice) === item.min &&
                    Number(currentFilters.maxPrice) === item.max &&
                    currentFilters.minPrice !== "" &&
                    currentFilters.maxPrice !== ""
                  }
                  onChange={() => handlePriceRange(item.min, item.max)}
                >
                  {item.label}
                </Checkbox>
              ))}
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-gray-500">
                Custom Range
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={currentFilters.minPrice ?? ""}
                  onChange={(event) =>
                    handleCustomPrice("minPrice", event.target.value)
                  }
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={currentFilters.maxPrice ?? ""}
                  onChange={(event) =>
                    handleCustomPrice("maxPrice", event.target.value)
                  }
                />
              </div>
            </div>
          </>
        ),
      },
      {
        key: "customerRatings",
        title: "CUSTOMER RATINGS",
        content: (
          <div className="flex flex-col gap-2 text-[13px] md:text-sm">
            {customerRatingOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={currentFilters.minReviewRating === option.value}
                onChange={() => handleCustomerRating(option.value)}
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
        ),
      },
      {
        key: "starRatings",
        title: "STAR RATING",
        content: (
          <div className="flex flex-col gap-2 text-[13px] md:text-sm">
            {starOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={
                  currentFilters.starRatings?.includes(option.value) || false
                }
                onChange={() => toggleArrayValue("starRatings", option.value)}
              >
                <span className="text-amber-500">{option.label}</span>
                {option.value > 0 && (
                  <span className="ml-2 text-gray-600">
                    {option.value} Star
                  </span>
                )}
              </Checkbox>
            ))}
          </div>
        ),
      },
      {
        key: "amenities",
        title: "AMENITIES",
        content: (
          <div className="flex flex-col gap-2 text-[13px] md:text-sm">
            {visibleAmenities.map((option) => (
              <Checkbox
                key={option}
                checked={currentFilters.amenities?.includes(option) || false}
                onChange={() => toggleArrayValue("amenities", option)}
              >
                {option}
              </Checkbox>
            ))}
            {amenityOptions.length > 5 && (
              <button
                type="button"
                className="self-start text-xs text-blue-600 underline"
                onClick={() => setShowAllAmenities((value) => !value)}
              >
                {showAllAmenities ? "View less" : "View all"}
              </button>
            )}
          </div>
        ),
      },
      {
        key: "chainProperties",
        title: "CHAIN PROPERTIES",
        content: (
          <div className="flex flex-col gap-2 text-[13px] md:text-sm">
            {visibleChains.map((option) => (
              <Checkbox
                key={option}
                checked={
                  currentFilters.chainProperties?.includes(option) || false
                }
                onChange={() => toggleArrayValue("chainProperties", option)}
              >
                {option}
              </Checkbox>
            ))}
            {chainOptions.length > 5 && (
              <button
                type="button"
                className="self-start text-xs text-blue-600 underline"
                onClick={() => setShowAllChains((value) => !value)}
              >
                {showAllChains ? "View less" : "View all"}
              </button>
            )}
          </div>
        ),
      },
      {
        key: "propertyType",
        title: "PROPERTY TYPE",
        content: (
          <div className="flex flex-col gap-2 text-[13px] md:text-sm">
            {visibleProperties.map((option) => (
              <Checkbox
                key={option}
                checked={currentFilters.propertyType?.includes(option) || false}
                onChange={() => toggleArrayValue("propertyType", option)}
              >
                {option}
              </Checkbox>
            ))}
            {propertyOptions.length > 5 && (
              <button
                type="button"
                className="self-start text-xs text-blue-600 underline"
                onClick={() => setShowAllProperties((value) => !value)}
              >
                {showAllProperties ? "View less" : "View all"}
              </button>
            )}
          </div>
        ),
      },
    ];
  }, [
    currentFilters,
    handlePopularFilter,
    handlePriceRange,
    handleCustomPrice,
    handleCustomerRating,
    toggleArrayValue,
    showAllAmenities,
    showAllChains,
    showAllProperties,
  ]);

  const resetFilters = useCallback(() => {
    const reset = {
      ...DEFAULT_FILTERS,
      starRatings: [],
      amenities: [],
      chainProperties: [],
      propertyType: [],
    };
    if (isMobile) setTempFilters(reset);
    else setFilters?.(reset);
  }, [isMobile, setFilters]);

  return (
    <div className="boder flex h-full min-h-0 flex-col overflow-hidden rounded-[6px] bg-white p-3 shadow-md md:p-4">
      {!hideMapSection && (
        <div
          onClick={() => onMapClick?.()}
          className="relative mb-4 h-[80px] cursor-pointer overflow-hidden rounded sm:h-[70px] md:h-[105px]"
        >
          <Image
            src="/images/filterMap.png"
            alt="Explore on Map"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="buttion-background-color most-boder-colour most-text-color background-color cursor-pointer rounded border bg-white px-2 py-1 text-[10px] font-semibold shadow-md transition-all duration-200 sm:px-3 sm:py-1.5 sm:text-[11px] md:px-4 md:py-2 md:text-xs lg:px-5 lg:py-2.5 lg:text-sm"
            >
              Explore on Map
            </button>
          </div>
        </div>
      )}

      <div className="mb-3 md:mb-4">
        <Input
          allowClear
          placeholder="Search Hotel Name"
          value={currentFilters.search || ""}
          onChange={handleSearch}
          className="h-8 rounded-lg border border-gray-200 md:h-11 [&_.ant-input]:!border-0 [&_.ant-input]:!text-[13px] [&_.ant-input]:!shadow-none [&_.ant-input]:focus:!shadow-none md:[&_.ant-input]:!text-[14px] [&_.ant-input::placeholder]:!text-gray-400"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 !pb-59">
          <Collapse
            defaultActiveKey={[
              "popular",
              "price",
              "customerRatings",
              "starRatings",
              "amenities",
              "chainProperties",
              "propertyType",
              "available",
            ]}
            ghost
            expandIconPlacement="end"
            items={[
              ...filterSections.map((section) => ({
                key: section.key,
                label: (
                  <span className="text-[13px] font-semibold text-gray-800 md:text-sm">
                    {section.title}
                  </span>
                ),
                children: section.content,
              })),
              {
                key: "available",
                label: (
                  <span className="text-[13px] font-semibold text-gray-800 md:text-sm">
                    AVAILABILITY
                  </span>
                ),
                children: (
                  <Checkbox
                    checked={currentFilters.availableOnly || false}
                    onChange={() => toggleBoolean("availableOnly")}
                  >
                    Show only available hotels
                  </Checkbox>
                ),
              },
            ]}
          />
        </div>

        {isMobile && (
          <div className="shrink-0 border-t bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="h-8 flex-1 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 transition hover:border-[#0B5ED7] hover:text-[#0B5ED7]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters?.(tempFilters);
                  onClose?.();
                }}
                className="h-8 flex-1 rounded bg-[#0B6CFF] text-sm font-semibold text-white! transition hover:bg-[#0953be]"
              >
                View Properties
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SidebarFilters);
