"use client";

import {
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Alert, Card, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

import HotelDetailsSkeleton from "@/components/common/loder/HotelDetailsSkeleton";
import useIsMobile from "@/hooks/useIsMobile";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import {
  useHotelContent,
  useHotelRooms,
} from "@/modules/hotel/hooks/useHotelDetails";
import { useHotelBookingStore } from "@/modules/hotel/store/booking.store";
import { useSelectedHotelStore } from "@/modules/hotel/store/selectedHotel.store";
import { useToggleWishlist } from "@/modules/wishlist/hooks/useToggleWishlist";
import { useWishlistIds } from "@/modules/wishlist/hooks/useWishlistIds";

import SearchBar from "../components/hotels/SearchBar";
import RoomPagination from "../components/hotels/RoomPagination";
import HotelSectionsContent from "../components/hotels/viewhotles/HotelSectionsContent";
import HotelSectionsTabs from "../components/hotels/viewhotles/HotelSectionsTabs";
import ViewHotelGallery from "../components/hotels/viewhotles/ViewHotelGallery";
import ViewHotelInfo from "../components/hotels/viewhotles/ViewHotelInfo";
import HotelContentOverview from "../components/hotels/viewhotles/HotelContentOverview";
import HotelTopSummary from "../components/hotels/viewhotles/HotelTopSummary";
import ViewHotelLocation from "../components/hotels/viewhotles/ViewHotelLocation";
import ViewHotelModal from "../components/hotels/viewhotles/ViewHotelModal";
import ViewHotelPriceCard from "../components/hotels/viewhotles/ViewHotelPriceCard";
import ViewHotelTabs from "../components/hotels/viewhotles/ViewHotelTabs";

import HotelCmsSection from "../sections/HotelCmsSection";
import RelatedHotels from "../sections/RelatedHotels";
import DynamicHotelSeoFallback from "../seo/DynamicHotelSeoFallback";
import { useHotelSearchStore } from "../store/serchData.store";
import { buildHotelDetailsPayload } from "../utils/buildHotelDetailsPayload";
import { buildWishlistPayload } from "../utils/buildWishlistPayload";
import { mapHotelDetailsResponse } from "../utils/mapHotelDetailsResponse";
import { shareHotel } from "../utils/shareHotel";

import HotelDetailsMobile from "./HotelDetailsMobile";

const EMPTY_OBJECT = {};

function HotelDetails({ initialPayload = null, cms = null }) {
  const { selectedHotel } = useSelectedHotelStore();
  const { appliedSearchData } = useHotelSearchStore();
  const { setBookingData } = useHotelBookingStore();

  const [activeTab, setActiveTab] = useState("Rooms");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [roomPaginationState, setRoomPaginationState] = useState({
    key: "",
    page: 1,
  });

  const { requireAuth } = useAuthGuard();
  const { mutateAsync } = useToggleWishlist();
  const { data: wishlistData } = useWishlistIds();

  const isMobile = useIsMobile();

  const payload = useMemo(() => {
    return buildHotelDetailsPayload({
      selectedHotel,
      initialPayload,
    });
  }, [selectedHotel, initialPayload]);

  const wishlistIds = useMemo(() => {
    return new Set(
      Array.isArray(wishlistData)
        ? wishlistData.map((id) => id?.toString())
        : [],
    );
  }, [wishlistData]);

  const hotelId = payload?.hotelId?.toString() || "";
  const paginationKey = `${payload?.searchId || ""}:${payload?.supplierHotelId || ""}`;
  const roomPage =
    roomPaginationState.key === paginationKey ? roomPaginationState.page : 1;

  const isWishlisted = hotelId ? wishlistIds.has(hotelId) : false;

  const isValidPayload = Boolean(payload?.searchId && payload?.supplierHotelId);

  const contentQuery = useHotelContent(payload, isValidPayload);
  const roomQuery = useHotelRooms(payload, roomPage, isValidPayload);
  const refetchContent = contentQuery.refetch;
  const refetchRooms = roomQuery.refetch;

  const data = useMemo(() => {
    if (!contentQuery.data) {
      return null;
    }

    return mapHotelDetailsResponse(contentQuery.data, roomQuery.data);
  }, [contentQuery.data, roomQuery.data]);

  const isLoading =
    contentQuery.isLoading || (roomPage === 1 && roomQuery.isLoading);
  const isFetching = roomQuery.isFetching;
  const refetch = useCallback(
    () => Promise.all([refetchContent(), refetchRooms()]),
    [refetchContent, refetchRooms],
  );
  const detailError = contentQuery.error || roomQuery.error || null;

  const showSkeleton = isValidPayload && isLoading && !data;

  const hotelData = data || EMPTY_OBJECT;
  const hotel = hotelData?.hotel || EMPTY_OBJECT;
  const details = hotelData?.details || EMPTY_OBJECT;

  const location = hotel?.location || EMPTY_OBJECT;
  const contact = hotel?.contact || EMPTY_OBJECT;
  const pricing = hotel?.pricing || EMPTY_OBJECT;
  const policy = hotel?.policy || EMPTY_OBJECT;
  const checkIn = hotel?.checkIn || EMPTY_OBJECT;
  const checkOut = hotel?.checkOut || EMPTY_OBJECT;

  useEffect(() => {
    if (!appliedSearchData) return;

    setBookingData({
      searchData: appliedSearchData,
    });
  }, [appliedSearchData, setBookingData]);

  const supplierData = useMemo(() => {
    return {
      HotelId: hotel?.hotelId || hotelId || "",
      hotelId: hotel?.hotelId || hotelId || "",
      HotelKey: hotel?.hotelKey || "",
      hotelKey: hotel?.hotelKey || "",
      HotelName: hotel?.name || "",
      hotelName: hotel?.name || "",
      Description: hotel?.description || "",
      description: hotel?.description || "",
      Address: location?.address || "",
      address: location?.address || "",
      City: location?.city || "",
      city: location?.city || "",
      State: location?.state || "",
      state: location?.state || "",
      Country: location?.country || "",
      country: location?.country || "",
      Pincode: location?.pincode || "",
      pincode: location?.pincode || "",
      Latitude: location?.latitude ?? null,
      latitude: location?.latitude ?? null,
      Longitude: location?.longitude ?? null,
      longitude: location?.longitude ?? null,
      Phone: contact?.phone || "",
      phone: contact?.phone || "",
      Email: contact?.email || "",
      email: contact?.email || "",
      HotelImage: hotel?.image || "",
      hotelImage: hotel?.image || "",
      StarCategory: hotel?.starCategory ?? 0,
      starCategory: hotel?.starCategory ?? 0,
      Facilities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
      facilities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
      Pricing: pricing,
      pricing,
      CheckIn: checkIn,
      checkIn,
      CheckOut: checkOut,
      checkOut,
      CheckInDate: hotel?.stayPeriod?.checkIn || "",
      checkInDate: hotel?.stayPeriod?.checkIn || "",
      CheckOutDate: hotel?.stayPeriod?.checkOut || "",
      checkOutDate: hotel?.stayPeriod?.checkOut || "",
      Occupancies: hotel?.occupancies || [],
      occupancies: hotel?.occupancies || [],
      RoomCount: hotel?.guestDetails?.roomCount || 0,
      AdultCount: hotel?.guestDetails?.adultCount || 0,
      ChildrenCount: hotel?.guestDetails?.childrenCount || 0,
      GuestCount:
        (hotel?.guestDetails?.adultCount || 0) +
        (hotel?.guestDetails?.childrenCount || 0),
      HotelContentFields: hotelData?.rawContent || {},
      RoomResponseFields: hotelData?.rawRooms || {},
      StayPeriodFields: hotelData?.rawStayPeriod || {},
      Policy: policy,
      policy,
      Supplier: hotel?.supplier || "",
      supplier: hotel?.supplier || "",
      AboutHotel: details?.aboutHotel || "",
      aboutHotel: details?.aboutHotel || "",
      Amenities: details?.amenities || [],
      amenities: details?.amenities || [],
      HotelGallery: Array.isArray(details?.gallery) ? details.gallery : [],
      gallery: Array.isArray(details?.gallery) ? details.gallery : [],
      ImportantInformation: details?.importantInformation || null,
      importantInformation: details?.importantInformation || null,
      Rooms: Array.isArray(details?.rooms) ? details.rooms : [],
      rooms: Array.isArray(details?.rooms) ? details.rooms : [],
      RatePlanRecommendations: Array.isArray(details?.rooms)
        ? details.rooms
        : [],
    };
  }, [
    hotel,
    hotelId,
    location,
    contact,
    pricing,
    checkIn,
    checkOut,
    policy,
    details,
    hotelData?.rawContent,
    hotelData?.rawRooms,
    hotelData?.rawStayPeriod,
  ]);

  const handleRoomPageChange = useCallback(
    (page) => {
      setRoomPaginationState({ key: paginationKey, page });
    },
    [paginationKey],
  );

  const hotelImages = useMemo(() => {
    const gallery = Array.isArray(details?.gallery) ? details.gallery : [];

    const images = gallery
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.url || item?.image || item?.src || "";
      })
      .filter(Boolean);

    if (images.length > 0) {
      return images;
    }

    return hotel?.image ? [hotel.image] : [];
  }, [details, hotel]);

  const amenities = useMemo(() => {
    const rawAmenities = details?.amenities;

    if (Array.isArray(rawAmenities)) {
      return rawAmenities
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.name || item?.title || item?.description || "";
        })
        .filter(Boolean);
    }

    if (typeof rawAmenities === "string") {
      return rawAmenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (Array.isArray(hotel?.facilities)) {
      return hotel.facilities
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.name || item?.title || "";
        })
        .filter(Boolean);
    }

    return [];
  }, [details, hotel]);

  const ratePlans = useMemo(() => {
    const rooms = Array.isArray(details?.rooms) ? details.rooms : [];

    if (rooms.length > 0) {
      return rooms;
    }

    return [
      {
        HotelId: hotel?.hotelId || hotelId || "",
        HotelKey: hotel?.hotelKey || "",
        HotelName: hotel?.name || "",

        PricingBreakdown: {
          basePrice: Number(pricing?.basicAmount || 0),
          platformFeeAndTax: Number(pricing?.tax || 0),
          finalPrice: Number(pricing?.totalAmount || 0),
          currencySymbol: pricing?.currency || "₹",
        },

        pricing: {
          basicAmount: Number(pricing?.basicAmount || 0),
          tax: Number(pricing?.tax || 0),
          totalAmount: Number(pricing?.totalAmount || 0),
          serviceFee: Number(pricing?.serviceFee || 0),
          markup: Number(pricing?.markup || 0),

          gst: Number(pricing?.gst || 0),

          currency: pricing?.currency || "INR",
        },
      },
    ];
  }, [details, hotel, hotelId, pricing]);

  const firstRatePlan = ratePlans?.[0] || null;

  const pricingBreakdown = firstRatePlan?.PricingBreakdown || {};

  const basePrice = Number(
    pricingBreakdown?.basePrice ?? pricing?.basicAmount ?? 0,
  );

  const platformFeeAndTax = Number(
    pricingBreakdown?.platformFeeAndTax ?? pricing?.tax ?? 0,
  );

  const finalPrice = Number(
    pricingBreakdown?.finalPrice ?? pricing?.totalAmount ?? 0,
  );

  const currencySymbol =
    pricingBreakdown?.currencySymbol || pricing?.currency || "₹";

  const hotelDetails = useMemo(() => {
    return {
      ...details,

      aboutHotel: details?.aboutHotel || "",

      amenities: details?.amenities || [],

      gallery: details?.gallery || [],

      importantInformation: details?.importantInformation || null,

      rooms: details?.rooms || [],
    };
  }, [details]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 5;

      setIsScrolled((previous) => {
        if (previous !== scrolled) {
          return scrolled;
        }

        return previous;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleWishlist = () => {
    requireAuth(async () => {
      try {
        const wishlistPayload = buildWishlistPayload({
          hotelId: payload?.hotelId,

          supplierData,

          searchData: appliedSearchData,

          hotelMeta: payload?.hotelMeta,

          pricing: {
            basePrice,
            platformFeeAndTax,
          },
        });

        await mutateAsync(wishlistPayload);

        message.success(
          isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        );
      } catch {
        message.error("Wishlist update failed");
      }
    });
  };

  const handleShare = async () => {
    await shareHotel({
      hotelName: hotel?.name || "",

      cityName: location?.city || appliedSearchData?.city || "",

      hotelId: payload?.hotelId,
      searchId: payload?.searchId,
      supplierHotelId: payload?.supplierHotelId,
      hotelDetailId: payload?.hotelDetailId,
    });
  };

  const handleSearch = useCallback(() => {}, []);

  if (isMobile === null) {
    return <HotelDetailsSkeleton />;
  }

  if (isMobile) {
    return (
      <HotelDetailsMobile
        cms={cms}
        hotelData={hotelData}
        supplierData={supplierData}
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
        payload={payload}
        roomPage={roomPage}
        roomPageTotal={hotelData?.pagination?.total || 0}
        onRoomPageChange={handleRoomPageChange}
        detailError={
          isValidPayload
            ? detailError?.message
            : "This hotel link is missing its search details. Please open the hotel from search results."
        }
        onWishlist={handleWishlist}
        onShare={handleShare}
        isWishlisted={isWishlisted}
      />
    );
  }

  return (
    <div className="background-color-bg min-h-screen w-full">
      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      <SearchBar searchData={supplierData} onSearch={handleSearch} />

      <div
        className={`relative mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-5 lg:px-6 xl:px-4 ${
          isScrolled ? "z-0" : "z-[820]"
        }`}
      >
        {!isValidPayload ? (
          <Alert
            className="mb-4"
            type="error"
            showIcon
            message="Hotel search details are missing"
            description="Please open this hotel from the search results so we can load its rooms."
          />
        ) : (
          detailError && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              message="Unable to load hotel details"
              description={detailError.message}
            />
          )
        )}

        <div className="-mt-6">
          {showSkeleton ? (
            <HotelDetailsSkeleton />
          ) : (
            <Card
              className="overflow-visible rounded-md border-0 shadow-lg"
              styles={{
                body: {
                  padding: 20,
                },
              }}
            >
              <div className="flex min-w-0 items-start justify-between gap-3 lg:gap-4">
                <div className="min-w-0 flex-1">
                  <HotelTopSummary
                    name={hotel?.name}
                    location={[location?.city, location?.country]
                      .filter(Boolean)
                      .join(", ")}
                    starRating={hotel?.starCategory}
                    reviews={hotelData?.rawContent?.hotel?.reviews}
                    stayPeriod={hotelData?.rawStayPeriod}
                    checkinInfo={hotel?.checkIn}
                    checkoutInfo={hotel?.checkOut}
                    occupancies={hotel?.occupancies}
                    fallbackGuests={
                      (Number(appliedSearchData?.adults) || 0) +
                      (Number(appliedSearchData?.children) || 0)
                    }
                    fallbackRooms={appliedSearchData?.rooms || 1}
                  />
                </div>

                <div className="flex shrink-0 items-center gap-2 lg:gap-2.5">
                  <button
                    type="button"
                    onClick={handleWishlist}
                    aria-label="Wishlist"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-all duration-200 hover:shadow-md active:scale-95 lg:h-10 lg:w-10 xl:h-11 xl:w-11"
                  >
                    <span
                      className={`inline-flex items-center justify-center transition-all duration-300 ${
                        isWishlisted
                          ? "scale-110 text-red-500"
                          : "text-gray-700 group-hover:scale-110"
                      }`}
                    >
                      {isWishlisted ? (
                        <HeartFilled className="text-[16px] lg:text-[18px] xl:text-[20px]" />
                      ) : (
                        <HeartOutlined className="text-[16px] lg:text-[18px] xl:text-[20px]" />
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share hotel"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-all duration-200 hover:shadow-md active:scale-95 lg:h-10 lg:w-10 xl:h-11 xl:w-11"
                  >
                    <ShareAltOutlined className="text-[16px] lg:text-[18px] xl:text-[19px]" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid w-full grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:gap-5">
                <div className="min-w-0 self-start">
                  <div className="w-full overflow-hidden rounded-md">
                    <ViewHotelGallery
                      images={hotelImages}
                      onOpen={() => setIsGalleryOpen(true)}
                    />
                  </div>

                  <div className="mt-5 w-full lg:mt-6">
                    <ViewHotelTabs supplierData={supplierData} />
                  </div>

                  <div className="mt-5 w-full lg:mt-6">
                    <ViewHotelInfo supplierData={supplierData} />
                  </div>
                </div>

                <div className="min-w-0 self-start">
                  {/* PRICE CARD */}

                  <div className="w-full">
                    <ViewHotelPriceCard
                      ratePlans={ratePlans}
                      supplierData={supplierData}
                      hotelDetailId={payload?.hotelDetailId || ""}
                    />
                  </div>

                  <div className="mt-5 w-full lg:mt-6">
                    <ViewHotelLocation supplierData={supplierData} />
                  </div>
                </div>
              </div>
              <HotelContentOverview
                hotelContent={hotelData?.rawContent}
              />
            </Card>
          )}
        </div>

        {!showSkeleton && (
          <>
            <div className="mt-3 lg:mt-6">
              <HotelSectionsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            <div className="mt-0">
              <HotelSectionsContent
                activeTab={activeTab}
                supplierData={supplierData}
                ratePlans={ratePlans}
                amenities={amenities}
                hotelDetails={hotelDetails}
                hotelDetailId={payload?.hotelDetailId || ""}
              />
              <RoomPagination
                currentPage={roomPage}
                total={hotelData?.pagination?.total || 0}
                disabled={isFetching}
                onChange={handleRoomPageChange}
              />
            </div>

            <HotelCmsSection>
              {cms ? (
                <CMSContentRenderer cms={cms} />
              ) : (
                <DynamicHotelSeoFallback
                  hotelName={hotel?.name}
                  cityName={location?.city}
                />
              )}
            </HotelCmsSection>

            <RelatedHotels
              cityId={appliedSearchData?.cityData?.id}
              cityName={appliedSearchData?.city}
              searchData={appliedSearchData}
              currentHotelId={payload?.hotelId}
            />
          </>
        )}
      </div>

      <ViewHotelModal
        open={isGalleryOpen}
        images={hotelImages}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}

export default HotelDetails;
