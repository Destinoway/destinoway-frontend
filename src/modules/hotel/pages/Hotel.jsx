"use client";

import BookingWebsiteLoader from "@/components/common/loder/BookingWebsiteLoader";
import useIsMobile from "@/hooks/useIsMobile";
import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import SidebarFilters, { DEFAULT_HOTEL_FILTERS } from "../cards/SidebarFilters";
import HotelList from "../components/hotels/HotelList";
import SearchBar from "../components/hotels/SearchBar";
import SortBar from "../components/SortBar";
import DynamicSeoFallback from "../seo/DynamicSeoFallback";
import HotelsSeoSection from "../seo/HotelsSeoSection";
import { useHotelSearchStore } from "../store/serchData.store";
import { scrollToHotelList } from "../utils/scrollToHotelList";
import { slugify } from "@/utils/slug/slugify";
import HotelMobile from "./HotelMobile";

const getCitySlug = (value) =>
  slugify(String(value || "").split(",")[0].trim());

const FILTER_CHIP_LABELS = {
  isRecommended: "Akbar Choice",
  freeCancellation: "Free Cancellation",
  freeBreakfast: "Breakfast Available",
  availableOnly: "Available Only",
};

const CMS_TRIGGER_OFFSET = 520;
const STICKY_OFFSET = 108;
// Must match the sidebar's `sticky top-[120px]`.
const SIDEBAR_STICKY_TOP = 120;
const subscribeToMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

const HotelMap = dynamic(() => import("../components/map/HotelMap"), {
  ssr: false,
});

export default function HotelContent({ initialSearchData = null, cms = null }) {
  const isMobile = useIsMobile();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot,
  );

  const {
    draftSearchData,
    appliedSearchData,
    setDraftSearchData,
    setAppliedSearchData,
  } = useHotelSearchStore();

  const searchParams = useSearchParams();
  const urlSearchKey = searchParams.toString();
  const lastHydratedSearchRef = useRef(null);
  const hotelListRef = useRef(null);
  const cmsTriggerRef = useRef(null);
  const sidebarRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const sidebarZ0Ref = useRef(false);
  const [filters, setFilters] = useState(DEFAULT_HOTEL_FILTERS);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hasHotels, setHasHotels] = useState(false);
  const [sort, setSort] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [hotelsForMap, setHotelsForMap] = useState([]);
  const [sidebarZ0, setSidebarZ0] = useState(false);

  const updateSidebarZIndex = useCallback((value) => {
    if (sidebarZ0Ref.current === value) {
      return;
    }

    sidebarZ0Ref.current = value;
    setSidebarZ0(value);
  }, []);

  const handleSearch = useCallback(
    (searchData) => {
      if (!searchData) return;
      setDraftSearchData(searchData);
      setAppliedSearchData(searchData);
      updateSidebarZIndex(false);
      requestAnimationFrame(() => {
        scrollToHotelList();
      });
    },
    [setDraftSearchData, setAppliedSearchData, updateSidebarZIndex],
  );


const handleFilterChange = useCallback((updater) => {
  setFilters(updater);
}, []);

const handleSortChange = useCallback((value) => {
  setSort(value);
}, []);


  // When the hotel column ends, the sticky sidebar gets pushed up past its
  // sticky top and would slide over the sticky search bar. Detect that from
  // the sidebar's real position instead of guessing from scroll offsets.
  const isSidebarPushedUp = useCallback(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return false;
    return sidebar.getBoundingClientRect().top < SIDEBAR_STICKY_TOP - 1;
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;

    const checkSidebarPosition = () => {
      scrollFrameRef.current = null;
      const scrollY = window.scrollY || window.pageYOffset;
      const hotelElement = hotelListRef.current;
      const cmsTrigger = cmsTriggerRef.current;

      if (isSidebarPushedUp()) {
        updateSidebarZIndex(true);
        return;
      }

      if (hotelsLoading) {
        updateSidebarZIndex(scrollY > 50);
        return;
      }

      if (!hasHotels) {
        updateSidebarZIndex(scrollY > 50);
        return;
      }

      if (cmsTrigger) {
        const triggerRect = cmsTrigger.getBoundingClientRect();
        const cmsReached = triggerRect.top <= CMS_TRIGGER_OFFSET;
        if (cmsReached) {
          updateSidebarZIndex(true);
          return;
        }
      }

      if (hotelElement) {
        const hotelRect = hotelElement.getBoundingClientRect();
        const hotelListFinished = hotelRect.bottom <= STICKY_OFFSET;
        if (hotelListFinished) {
          updateSidebarZIndex(true);
          return;
        }
      }
      updateSidebarZIndex(false);
    };

    const handleScroll = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }
      scrollFrameRef.current =
        window.requestAnimationFrame(checkSidebarPosition);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    checkSidebarPosition();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [
    mounted,
    isMobile,
    hotelsLoading,
    hasHotels,
    isSidebarPushedUp,
    updateSidebarZIndex,
  ]);

  useEffect(() => {
    if (!mounted || isMobile) return;
    const cmsTrigger = cmsTriggerRef.current;
    if (!cmsTrigger) return;
    const checkCmsPosition = () => {
      if (hotelsLoading || !hasHotels) {
        return;
      }

      const rect = cmsTrigger.getBoundingClientRect();
      const cmsReached = rect.top <= CMS_TRIGGER_OFFSET;
      updateSidebarZIndex(cmsReached || isSidebarPushedUp());
    };

    const resizeObserver = new ResizeObserver(() => {
      if (scrollFrameRef.current !== null) {
        return;
      }
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;

        checkCmsPosition();
      });
    });

    resizeObserver.observe(cmsTrigger);
    window.addEventListener("resize", checkCmsPosition);
    checkCmsPosition();

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("resize", checkCmsPosition);
    };
  }, [
    mounted,
    isMobile,
    cms,
    hotelsLoading,
    hasHotels,
    isSidebarPushedUp,
    updateSidebarZIndex,
  ]);

  useEffect(() => {
    if (!mounted) return;
    if (lastHydratedSearchRef.current === urlSearchKey) return;
    lastHydratedSearchRef.current = urlSearchKey;

    if (initialSearchData) {
      setDraftSearchData(initialSearchData);
      setAppliedSearchData(initialSearchData);
      return;
    }

    const queryParams = new URLSearchParams(urlSearchKey);
    const today = dayjs().startOf("day");
    const savedCheckIn = dayjs(draftSearchData?.checkIn);
    const savedCheckOut = dayjs(draftSearchData?.checkOut);

    if (
      !savedCheckIn.isValid() ||
      savedCheckIn.isBefore(today) ||
      !savedCheckOut.isValid() ||
      savedCheckOut.isBefore(today)
    ) {
      setDraftSearchData({
        checkIn: today.format("YYYY-MM-DD"),

        checkOut: today.add(1, "day").format("YYYY-MM-DD"),
      });
    }

    const destinationCity =
      queryParams.get("destinationCity") ||
      draftSearchData?.cityData?.city ||
      draftSearchData?.city ||
      "";

    const displayName =
      queryParams.get("cityName") ||
      draftSearchData?.cityData?.displayName ||
      destinationCity;

    const destinationId = queryParams.get("cityId") || "";
    const isSameDestination =
      destinationId &&
      destinationId === String(draftSearchData?.cityData?.id || "");
    const existingCityData = isSameDestination
      ? draftSearchData?.cityData || {}
      : {};
    const latitude =
      queryParams.get("latitude") ??
      existingCityData?.coordinates?.lat ??
      existingCityData?.geoCode?.lat ??
      existingCityData?.latitude;
    const longitude =
      queryParams.get("longitude") ??
      existingCityData?.coordinates?.long ??
      existingCityData?.geoCode?.long ??
      existingCityData?.longitude;
    const validSavedDates =
      savedCheckIn.isValid() &&
      !savedCheckIn.isBefore(today) &&
      savedCheckOut.isValid() &&
      !savedCheckOut.isBefore(today);

    const urlData = {
      city: displayName || destinationCity,

      cityData: {
        ...existingCityData,
        id: destinationId,
        name: queryParams.get("destinationCity") || destinationCity,
        type:
          queryParams.get("destinationType") ||
          existingCityData?.type ||
          "city",
        city: destinationCity,
        state: queryParams.get("stateName") || existingCityData?.state || "",
        stateName:
          queryParams.get("stateName") ||
          existingCityData?.stateName ||
          existingCityData?.state ||
          "",
        country: queryParams.get("country") || existingCityData?.country || "",
        countryCode:
          queryParams.get("countryCode") || existingCityData?.countryCode || "",
        displayName,
        normalizedCity: destinationCity,
        ...(latitude != null && longitude != null
          ? { coordinates: { lat: latitude, long: longitude } }
          : {}),
      },

      checkIn:
        queryParams.get("checkIn") ||
        (validSavedDates
          ? draftSearchData.checkIn
          : today.format("YYYY-MM-DD")),
      checkOut:
        queryParams.get("checkOut") ||
        (validSavedDates
          ? draftSearchData.checkOut
          : today.add(1, "day").format("YYYY-MM-DD")),
      rooms: Number(queryParams.get("rooms")) || 1,
      adults: Number(queryParams.get("adults")) || 2,
      children: Number(queryParams.get("children")) || 0,
      childAges: (queryParams.get("childAges") || "")
        .split(",")
        .filter((age) => age !== "")
        .map(Number)
        .filter(Number.isFinite),
      pets: queryParams.get("pets") === "true",
      roomGuests: (() => {
        try {
          const parsed = JSON.parse(queryParams.get("roomGuests") || "[]");
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })(),
    };

    const matchesSearchData = (searchData) =>
      urlData.cityData.id === String(searchData?.cityData?.id || "") &&
      urlData.city === searchData?.city &&
      urlData.checkIn === searchData?.checkIn &&
      urlData.checkOut === searchData?.checkOut &&
      urlData.rooms === searchData?.rooms &&
      urlData.adults === searchData?.adults &&
      urlData.children === searchData?.children &&
      urlData.pets === searchData?.pets &&
      JSON.stringify(urlData.roomGuests) ===
        JSON.stringify(searchData?.roomGuests || []) &&
      JSON.stringify(urlData.childAges) ===
        JSON.stringify(searchData?.childAges || []) &&
      String(urlData.cityData.coordinates?.lat ?? "") ===
        String(
          searchData?.cityData?.coordinates?.lat ??
            searchData?.cityData?.latitude ??
            "",
        ) &&
      String(urlData.cityData.coordinates?.long ?? "") ===
        String(
          searchData?.cityData?.coordinates?.long ??
            searchData?.cityData?.longitude ??
            "",
        );

    if (
      urlData.cityData.id &&
      (!matchesSearchData(draftSearchData) ||
        !matchesSearchData(appliedSearchData))
    ) {
      setDraftSearchData(urlData);
      setAppliedSearchData(urlData);
    }
  }, [
    mounted,
    urlSearchKey,
    initialSearchData,
    draftSearchData,
    appliedSearchData,
    setDraftSearchData,
    setAppliedSearchData,
  ]);

  const isFilterActive = useCallback((value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === false
    ) {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    return true;
  }, []);

  const removeFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
      };

      if (Array.isArray(updated[key])) {
        updated[key] = updated[key].filter((v) => v !== value);
      } else if (typeof updated[key] === "boolean") {
        updated[key] = false;
      } else {
        updated[key] = "";
      }

      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFilters(DEFAULT_HOTEL_FILTERS);
    scrollToHotelList();
  }, []);

  const activeFilters = useMemo(() => {
    return Object.entries(filters);
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return activeFilters.some(([_, value]) => isFilterActive(value));
  }, [activeFilters, isFilterActive]);

  // One readable chip per active filter value.
  const filterChips = useMemo(() => {
    const chips = [];

    activeFilters.forEach(([key, value]) => {
      if (!isFilterActive(value) || key === "minPrice" || key === "maxPrice") {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          let label = String(item);
          if (key === "starRatings") {
            label = Number(item) === 0 ? "General" : `${item} Star`;
          } else if (key === "amenities" && item === "Internet") {
            label = "Wifi";
          }
          chips.push({
            id: `${key}-${item}`,
            label,
            onRemove: () => removeFilter(key, item),
          });
        });
        return;
      }

      const label =
        value === true
          ? FILTER_CHIP_LABELS[key] || key
          : key === "minReviewRating"
            ? `${value}+ Rating`
            : key === "search"
              ? `"${value}"`
              : key === "starCategory"
                ? `${value} Star`
                : String(value);

      chips.push({ id: key, label, onRemove: () => removeFilter(key) });
    });

    if (filters?.minPrice || filters?.maxPrice) {
      chips.push({
        id: "price",
        label: `₹${filters?.minPrice || 0} - ₹${filters?.maxPrice || 50000}`,
        onRemove: () =>
          setFilters((prev) => ({ ...prev, minPrice: "", maxPrice: "" })),
      });
    }

    return chips;
  }, [activeFilters, filters, isFilterActive, removeFilter]);

  // CMS is fetched server-side for the URL's city. Searching another city on
  // this page doesn't navigate, so drop CMS that belongs to a different city
  // and let the static fallback render instead.
  const activeCms = useMemo(() => {
    if (!cms) return null;

    const cmsCity = getCitySlug(cms?.data?.cityMeta?.destination);
    if (!cmsCity) return cms;

    const searchedCity = getCitySlug(
      appliedSearchData?.cityData?.city ||
        appliedSearchData?.cityData?.name ||
        appliedSearchData?.city,
    );
    if (!searchedCity) return cms;

    return searchedCity === cmsCity || searchedCity === cms?.slug ? cms : null;
  }, [cms, appliedSearchData]);

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <BookingWebsiteLoader />
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <HotelMobile
          appliedSearchData={appliedSearchData}
          filters={filters}
          setFilters={handleFilterChange}
          sort={sort}
          setSort={handleSortChange}
          mapOpen={mapOpen}
          setMapOpen={setMapOpen}
          hotelsLoading={hotelsLoading}
          setHotelsLoading={setHotelsLoading}
          hasHotels={hasHotels}
          setHasHotels={setHasHotels}
          hotelsForMap={hotelsForMap}
          setHotelsForMap={setHotelsForMap}
          cms={activeCms}
        />
      ) : (
        <div className="background-color-bg">
          <SearchBar searchData={draftSearchData} onSearch={handleSearch} />

          <div className="relative mx-auto -mt-9.75 flex max-w-7xl gap-4 p-3 md:flex-nowrap">
            <div
              ref={sidebarRef}
              className={`sticky top-30 h-[calc(100vh-132px)] min-h-105 w-full shrink-0 sm:w-64 md:w-72 ${
                sidebarZ0 ? "z-0" : "z-20!"
              }`}
            >
              <SidebarFilters
                filters={filters}
                setFilters={handleFilterChange}
                onMapClick={() => {
                  setMapOpen(true);
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              {/* SORT BAR */}

              <div
                className={`sticky top-30 ${
                  sidebarZ0 ? "-z-10!" : "z-20!"
                } `}
              >
                <SortBar sort={sort} setSort={handleSortChange} />
              </div>

              {hasActiveFilters && (
                <div
                  className={`sticky top-40.75 min-[700px]:max-[850px]:top-38.75 ${
                    sidebarZ0 ? "-z-10!" : "z-12"
                  } background-color-bg pt-3`}
                >
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                    <span className="shrink-0 text-[14px] font-semibold whitespace-nowrap text-[#344054]">
                      Applied Filters:
                    </span>

                    {filterChips.map((chip) => (
                      <span
                        key={chip.id}
                        className="inline-flex h-7 items-center gap-1 rounded-full border border-(--theme-secondary)/25 bg-(--theme-secondary)/5 pr-1 pl-3 text-xs font-medium text-(--theme-secondary)"
                      >
                        {chip.label}
                        <button
                          type="button"
                          aria-label={`Remove ${chip.label} filter`}
                          onClick={chip.onRemove}
                          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-[10px] text-(--theme-secondary) transition-colors hover:bg-(--theme-secondary) hover:text-white"
                        >
                          <CloseOutlined />
                        </button>
                      </span>
                    ))}

                    <button
                      type="button"
                      onClick={clearAll}
                      className="ml-auto inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white! active:scale-95"
                    >
                      <CloseCircleOutlined />
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              <div id="hotel-list-section" ref={hotelListRef} className="pt-3">
                <HotelList
                  searchData={appliedSearchData}
                  filters={filters}
                  sort={sort}
                  onHotelsChange={setHotelsForMap}
                  onLoadingChange={setHotelsLoading}
                  onResultChange={setHasHotels}
                />
              </div>

              <div className="relative">
                <div
                  ref={cmsTriggerRef}
                  className="pointer-events-none absolute top-0 left-0 h-30 w-full"
                  aria-hidden="true"
                />

                {activeCms ? (
                  <HotelsSeoSection>
                    <CMSContentRenderer cms={activeCms} />
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
          </div>
        </div>
      )}

      <Modal
        open={mapOpen}
        footer={null}
        closable={false}
        width="95vw"
        centered
        onCancel={() => setMapOpen(false)}
        styles={{
          body: {
            padding: 0,
            overflow: "hidden",
          },
        }}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold md:text-xl">Hotels on Map</h2>

          <button
            onClick={() => setMapOpen(false)}
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Close
          </button>
        </div>

        <div className="flex h-[70vh] md:h-[80vh] lg:h-[85vh]">
          <div className="flex-1">
            <HotelMap hotels={hotelsForMap} />
          </div>

          <div className="hidden overflow-y-auto border-l bg-white md:block md:w-70 lg:w-85">
            <SidebarFilters
              filters={filters}
              setFilters={handleFilterChange}
              hideMapSection
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
