"use client";

import {
  EnvironmentFilled,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Checkbox, Collapse, ConfigProvider, Input } from "antd";
import debounce from "lodash/debounce";
import Image from "next/image";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

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

// Match the site font (antd uses its own system font stack by default).
export const FILTER_THEME = {
  token: { fontFamily: "var(--font-roboto), sans-serif" },
};

// Theme-coloured checkboxes and inputs, scoped to the filter panel.
const FILTER_THEME_CLASSES = [
  // Checkbox colours
  "[&_.ant-checkbox-inner]:rounded-[5px]!",
  "[&_.ant-checkbox-checked_.ant-checkbox-inner]:border-(--theme-secondary)! [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-(--theme-secondary)!",
  "[&_.ant-checkbox-wrapper:hover_.ant-checkbox-inner]:border-(--theme-secondary)!",
  // Each option is a full-width row with hover/selected states
  "[&_.ant-checkbox-wrapper]:m-0! [&_.ant-checkbox-wrapper]:w-full [&_.ant-checkbox-wrapper]:rounded-lg [&_.ant-checkbox-wrapper]:px-2 [&_.ant-checkbox-wrapper]:py-1.75 [&_.ant-checkbox-wrapper]:text-gray-700 [&_.ant-checkbox-wrapper]:transition-colors",
  "[&_.ant-checkbox-wrapper:hover]:bg-slate-50",
  "[&_.ant-checkbox-wrapper-checked]:bg-(--theme-secondary)/5 [&_.ant-checkbox-wrapper-checked]:font-semibold [&_.ant-checkbox-wrapper-checked]:text-(--theme-secondary)",
  // Inputs
  "[&_.ant-input-affix-wrapper-focused]:border-(--theme-secondary)! [&_.ant-input:focus]:border-(--theme-secondary)!",
  // Sections separated by hairlines
  "[&_.ant-collapse-item]:border-b [&_.ant-collapse-item]:border-gray-100 [&_.ant-collapse-item:last-child]:border-b-0",
  "[&_.ant-collapse-header]:px-1! [&_.ant-collapse-header]:py-3!",
  "[&_.ant-collapse-content-box]:px-0! [&_.ant-collapse-content-box]:pt-0! [&_.ant-collapse-content-box]:pb-3!",
].join(" ");

const sectionTitleClass =
  "text-[12px] font-bold tracking-[0.08em] text-(--theme-text-primary) uppercase";

const MOBILE_QUERY = "(max-width: 777px)";
const subscribeToMobile = (onChange) => {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getMobileSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const getServerMobileSnapshot = () => false;

const viewAllButtonClass =
  "mt-1 ml-2 self-start cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-(--theme-secondary) underline-offset-2 transition-colors hover:text-(--theme-hover) hover:underline";

export const DEFAULT_HOTEL_FILTERS = {
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
    ...DEFAULT_HOTEL_FILTERS,
    ...filters,
  });
  const [searchInputValue, setSearchInputValue] = useState(
    filters?.search || "",
  );
  const [customPriceDraft, setCustomPriceDraft] = useState({
    minPrice: filters?.minPrice ?? "",
    maxPrice: filters?.maxPrice ?? "",
  });
  // Read synchronously so the mobile footer doesn't pop in after first paint.
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllChains, setShowAllChains] = useState(false);
  const [showAllProperties, setShowAllProperties] = useState(false);

  useEffect(() => {
    const nextFilters = { ...DEFAULT_HOTEL_FILTERS, ...filters };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync the local form draft after committed filters change externally.
    setTempFilters(nextFilters);
    setSearchInputValue(nextFilters.search || "");
    setCustomPriceDraft({
      minPrice: nextFilters.minPrice ?? "",
      maxPrice: nextFilters.maxPrice ?? "",
    });
  }, [filters]);

  const updateFilters = useCallback(
    (updater) => {
      if (isMobile) {
        setTempFilters((previous) => {
          const base = { ...DEFAULT_HOTEL_FILTERS, ...previous };
          return typeof updater === "function"
            ? updater(base)
            : { ...base, ...updater };
        });
      } else {
        setFilters?.((previous) => {
          const base = { ...DEFAULT_HOTEL_FILTERS, ...(previous || {}) };
          return typeof updater === "function"
            ? updater(base)
            : { ...base, ...updater };
        });
      }
    },
    [isMobile, setFilters],
  );

  const debouncedSearchUpdate = useMemo(
    () =>
      debounce((nextSearch) => {
        setSearchInputValue(nextSearch);
        updateFilters({ search: nextSearch });
      }, 1000),
    [updateFilters],
  );

  const debouncedPriceUpdate = useMemo(
    () =>
      debounce((nextPriceRange) => {
        updateFilters((previous) => ({
          ...previous,
          ...nextPriceRange,
        }));
      }, 1000),
    [updateFilters],
  );

  useEffect(() => {
    return () => {
      debouncedSearchUpdate.cancel();
      debouncedPriceUpdate.cancel();
    };
  }, [debouncedPriceUpdate, debouncedSearchUpdate]);

  const currentFilters = useMemo(
    () =>
      isMobile
        ? {
            ...DEFAULT_HOTEL_FILTERS,
            ...filters,
            ...tempFilters,
            search: searchInputValue,
            minPrice: customPriceDraft.minPrice,
            maxPrice: customPriceDraft.maxPrice,
          }
        : {
            ...DEFAULT_HOTEL_FILTERS,
            ...filters,
            search: searchInputValue,
            minPrice: customPriceDraft.minPrice,
            maxPrice: customPriceDraft.maxPrice,
          },
    [customPriceDraft, filters, isMobile, searchInputValue, tempFilters],
  );

  const handleSearch = useCallback(
    (event) => {
      const nextSearch = event.target.value;
      setSearchInputValue(nextSearch);
      debouncedSearchUpdate(nextSearch);
    },
    [debouncedSearchUpdate],
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
    (min, max) => {
      const isSelected =
        Number(currentFilters.minPrice) === min &&
        Number(currentFilters.maxPrice) === max &&
        currentFilters.minPrice !== "" &&
        currentFilters.maxPrice !== "";
      const nextRange = isSelected
        ? { minPrice: "", maxPrice: "" }
        : { minPrice: String(min), maxPrice: String(max) };

      debouncedPriceUpdate.cancel();
      setCustomPriceDraft(nextRange);
      updateFilters((previous) => ({ ...previous, ...nextRange }));
    },
    [
      currentFilters.maxPrice,
      currentFilters.minPrice,
      debouncedPriceUpdate,
      updateFilters,
    ],
  );

  const handleCustomPrice = useCallback(
    (key, value) => {
      const nextValue = value === undefined || value === null ? "" : value;
      const nextRange = {
        minPrice: key === "minPrice" ? nextValue : customPriceDraft.minPrice,
        maxPrice: key === "maxPrice" ? nextValue : customPriceDraft.maxPrice,
      };

      setCustomPriceDraft(nextRange);
      debouncedPriceUpdate(nextRange);
    },
    [
      customPriceDraft.maxPrice,
      customPriceDraft.minPrice,
      debouncedPriceUpdate,
    ],
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
          <div className="flex flex-col gap-0.5 text-[13px] md:text-sm">
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
            <div className="flex flex-col gap-0.5 text-[13px] md:text-sm">
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
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                Custom Range
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  prefix={<span className="text-gray-400">₹</span>}
                  className="rounded-lg"
                  placeholder="Min"
                  value={currentFilters.minPrice ?? ""}
                  onChange={(event) =>
                    handleCustomPrice("minPrice", event.target.value)
                  }
                />
                <span className="shrink-0 text-gray-400">–</span>
                <Input
                  type="number"
                  min={0}
                  prefix={<span className="text-gray-400">₹</span>}
                  className="rounded-lg"
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
          <div className="flex flex-col gap-0.5 text-[13px] md:text-sm">
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
          <div className="flex flex-col gap-0.5 text-[13px] md:text-sm">
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
          <div className="flex flex-col gap-0.5 text-[13px] md:text-sm">
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
                className={viewAllButtonClass}
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
          <div className="flex flex-col gap-0.5 text-[13px] md:text-sm">
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
                className={viewAllButtonClass}
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
          <div className="flex flex-col gap-0.5 text-[13px] md:text-sm">
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
                className={viewAllButtonClass}
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
      ...DEFAULT_HOTEL_FILTERS,
      starRatings: [],
      amenities: [],
      chainProperties: [],
      propertyType: [],
    };
    debouncedSearchUpdate.cancel();
    debouncedPriceUpdate.cancel();
    setSearchInputValue("");
    setCustomPriceDraft({ minPrice: "", maxPrice: "" });
    if (isMobile) setTempFilters(reset);
    else setFilters?.(reset);
  }, [debouncedPriceUpdate, debouncedSearchUpdate, isMobile, setFilters]);

  return (
    <ConfigProvider theme={FILTER_THEME}>
      <div
        className={`flex h-full min-h-0 flex-col overflow-hidden bg-white p-3 md:p-4 ${
          isMobile
            ? ""
            : "rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
        } ${FILTER_THEME_CLASSES}`}
      >
        {!hideMapSection && (
          <div
            onClick={() => onMapClick?.()}
            className="group/map relative mb-3 h-21.5 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-1 ring-gray-200 md:mb-4 md:h-26.25"
          >
            <Image
              src="/images/filterMap.webp"
              alt="Explore on Map"
              fill
              sizes="(max-width: 777px) 85vw, 288px"
              className="object-cover transition-transform duration-500 group-hover/map:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/25 to-black/0">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-white px-4 py-2 text-[12px] font-semibold text-(--theme-secondary) shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all duration-200 group-hover/map:-translate-y-0.5 group-hover/map:shadow-[0_8px_20px_rgba(0,0,0,0.22)] md:text-[13px]"
              >
                <EnvironmentFilled className="text-[13px]" />
                Explore on Map
              </button>
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="mb-3 flex items-center gap-2 px-1">
            <FilterOutlined className="text-[14px] text-(--theme-secondary)" />
            <span className="text-[15px] font-bold text-(--theme-text-primary)">
              Filters
            </span>
          </div>
        )}

        <div className="mb-2 shrink-0 md:mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined className="mr-1 text-gray-400" />}
            placeholder="Search Hotel Name"
            value={currentFilters.search || ""}
            onChange={handleSearch}
            className="h-10 rounded-xl border border-gray-200 bg-slate-50/60 md:h-11 [&_.ant-input]:border-0! [&_.ant-input]:bg-transparent! [&_.ant-input]:text-[13px]! [&_.ant-input]:shadow-none! [&_.ant-input]:focus:shadow-none! md:[&_.ant-input]:text-[14px]! [&_.ant-input::placeholder]:text-gray-400!"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto overscroll-contain scroll-smooth pr-1 pb-2 [-webkit-overflow-scrolling:touch]">
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
                    <span className={sectionTitleClass}>{section.title}</span>
                  ),
                  children: section.content,
                })),
                {
                  key: "available",
                  label: (
                    <span className={sectionTitleClass}>AVAILABILITY</span>
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
            <div className="-mx-3 -mb-3 shrink-0 border-t border-gray-200 bg-white px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] shadow-[0_-6px_16px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex h-11 w-[38%] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white text-[14px] font-semibold text-gray-700 transition-all duration-200 hover:border-(--theme-secondary) hover:text-(--theme-secondary) active:scale-[0.97]"
                >
                  <ReloadOutlined className="text-[13px]" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    debouncedSearchUpdate.flush();
                    debouncedPriceUpdate.flush();
                    setFilters?.({ ...currentFilters });
                    onClose?.();
                  }}
                  className="flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl border-none bg-(--theme-secondary) px-3 text-[14px] font-semibold whitespace-nowrap text-(--theme-white)! shadow-[0_4px_12px_rgba(15,23,42,0.18)] transition-all duration-200 hover:bg-(--theme-hover) active:scale-[0.97]"
                >
                  View Properties
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default memo(SidebarFilters);
