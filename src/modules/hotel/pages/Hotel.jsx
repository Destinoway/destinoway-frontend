"use client";

import BookingWebsiteLoader from "@/components/common/loder/BookingWebsiteLoader";
import useIsMobile from "@/hooks/useIsMobile";
import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { CloseOutlined } from "@ant-design/icons";
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

import SidebarFilters, {
  DEFAULT_HOTEL_FILTERS,
} from "../cards/SidebarFilters";
import HotelList from "../components/hotels/HotelList";
import SearchBar from "../components/hotels/SearchBar";
import SortBar from "../components/SortBar";
import DynamicSeoFallback from "../seo/DynamicSeoFallback";
import HotelsSeoSection from "../seo/HotelsSeoSection";
import { useHotelSearchStore } from "../store/serchData.store";
import { scrollToHotelList } from "../utils/scrollToHotelList";
import HotelMobile from "./HotelMobile";

const CMS_TRIGGER_OFFSET = 520;
const STICKY_OFFSET = 108;
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
    scrollToHotelList();
  }, []);

  const handleSortChange = useCallback((value) => {
    setSort(value);
    scrollToHotelList();
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;

    const checkSidebarPosition = () => {
      scrollFrameRef.current = null;
      const scrollY = window.scrollY || window.pageYOffset;
      const hotelElement = hotelListRef.current;
      const cmsTrigger = cmsTriggerRef.current;

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
  }, [mounted, isMobile, hotelsLoading, hasHotels, updateSidebarZIndex]);

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
      updateSidebarZIndex(cmsReached);
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
  }, [mounted, isMobile, cms, hotelsLoading, hasHotels, updateSidebarZIndex]);

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

  if (!mounted) return <BookingWebsiteLoader />;

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
          hasHotels={hasHotels}
          hotelsForMap={hotelsForMap}
          setHotelsForMap={setHotelsForMap}
          cms={cms}
        />
      ) : (
        <div className="background-color-bg">
          <SearchBar searchData={draftSearchData} onSearch={handleSearch} />

          <div className="relative mx-auto mt-[-39px] flex max-w-7xl gap-4 p-3 md:flex-nowrap">
            <div
              className={`sticky top-[120px] max-h-[calc(100vh-20px)] w-full overflow-y-auto sm:w-64 md:w-72 ${
                sidebarZ0 ? "z-0" : "!z-20"
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
                className={`sticky top-[120px] ${
                  sidebarZ0 ? "!-z-10" : "!z-20"
                } `}
              >
                <SortBar sort={sort} setSort={handleSortChange} />
              </div>

              {hasActiveFilters && (
                <div
                  className={`sticky top-[138px] min-[700px]:max-[850px]:top-[155px] ${
                    sidebarZ0 ? "!-z-10" : "z-12"
                  } background-color-bg !pt-[5px]`}
                >
                  <div className="!mb-4 flex flex-wrap gap-2">
                    {activeFilters.map(([key, value]) => {
                      if (!isFilterActive(value)) {
                        return null;
                      }

                      if (key === "minPrice" || key === "maxPrice") {
                        return null;
                      }

                      if (Array.isArray(value)) {
                        return value.map((v, i) => (
                          <div
                            key={`${key}-${i}`}
                            className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-600"
                          >
                            {v}

                            <CloseOutlined
                              className="cursor-pointer text-xs"
                              onClick={() => removeFilter(key, v)}
                            />
                          </div>
                        ));
                      }

                      let label = value;

                      if (key === "freeCancellation") {
                        label = "Free Cancellation";
                      }

                      if (key === "starCategory") {
                        label = `${value} Star`;
                      }

                      return (
                        <div
                          key={key}
                          className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-600"
                        >
                          {label}

                          <CloseOutlined
                            className="cursor-pointer text-xs"
                            onClick={() => removeFilter(key)}
                          />
                        </div>
                      );
                    })}

                    {(filters?.minPrice || filters?.maxPrice) && (
                      <div className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-xs text-blue-600">
                        ₹{filters?.minPrice || 0}
                        {" - "}₹{filters?.maxPrice || 50000}
                        <CloseOutlined
                          className="cursor-pointer text-xs"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              minPrice: "",
                              maxPrice: "",
                            }))
                          }
                        />
                      </div>
                    )}

                    <button
                      onClick={clearAll}
                      className="rounded bg-red-200 px-3 py-1 text-xs text-red-600"
                    >
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
                  className="pointer-events-none absolute top-0 left-0 h-[120px] w-full"
                  aria-hidden="true"
                />

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

          <div className="hidden overflow-y-auto border-l bg-white md:block md:w-[280px] lg:w-[340px]">
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
