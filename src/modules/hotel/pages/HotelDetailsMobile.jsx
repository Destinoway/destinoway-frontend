"use client";
import HotelDetailsSkeleton from "@/components/common/loder/HotelDetailsSkeleton";
import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import {
  ArrowLeftOutlined,
  HeartFilled,
  HeartOutlined,
  SendOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Alert, Drawer } from "antd";
import { useEffect, useState } from "react";

import HotelContentOverview from "../components/hotels/viewhotles/HotelContentOverview";
import HotelTopSummary from "../components/hotels/viewhotles/HotelTopSummary";
import ViewHotelInfo from "../components/hotels/viewhotles/ViewHotelInfo";
import ViewHotelModal from "../components/hotels/viewhotles/ViewHotelModal";
import ViewHotelPriceCard from "../components/hotels/viewhotles/ViewHotelPriceCard";

import HotelCmsSection from "../sections/HotelCmsSection";
import DynamicHotelSeoFallback from "../seo/DynamicHotelSeoFallback";

import RoomOptions from "../components/hotels/viewhotles/HotelSections/RoomOptions";
import ViewHotelGalleryMobile from "../components/hotels/viewhotles/ViewHotelGalleryMobile";
import HotelSectionsContents from "../mobile-componant/HotelSectionsContents";
import HotelSectionsTabss from "../mobile-componant/HotelSectionsTabss";
import { useHotelBookingStore } from "../store/booking.store";
import { useHotelSearchStore } from "../store/serchData.store";
import { selectFeaturedRoomPlan } from "../utils/selectFeaturedRoomPlan";

function HotelDetailsMobile({
  cms,
  hotelData,
  supplierData,
  hotelImages: hotelImageList = [],
  isLoading,
  isFetching,
  refetch,
  payload,
  roomPage,
  roomPageTotal,
  onRoomPageChange,
  detailError,
  roomError,
  isWishlisted,
  onWishlist,
  onShare,
  ratePlans: roomList = [],
  hasMore = false,
  isFetchingNextPage = false,
  isRoomsLoading = false,
  loadMoreRooms,
  onRetry,
}) {
  const { appliedSearchData } = useHotelSearchStore();
  const { setBookingData } = useHotelBookingStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("Amenities");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [sessionExpired] = useState(false);
  const [reloadingHotels] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const showSkeleton = isLoading;

  const ratePlans = roomList.length
    ? roomList
    : supplierData?.RatePlanRecommendations || [];

  const { plan: featuredRoom } = selectFeaturedRoomPlan(ratePlans);
  const priceCurrency = featuredRoom?.pricing?.currency || "INR";
  const currencySymbol =
    priceCurrency === "INR" || priceCurrency === "₹" ? "₹" : priceCurrency;

  const hotelImages = hotelImageList.length
    ? hotelImageList
    : supplierData?.HotelGallery || [];

  const amenities = Array.isArray(supplierData?.Amenities)
    ? supplierData.Amenities.map((item) => String(item).trim()).filter(Boolean)
    : typeof supplierData?.Amenities === "string"
      ? supplierData.Amenities.split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const hotelDetails = supplierData || [];
  const mobileMapQuery = [
    supplierData?.Address,
    supplierData?.City,
    supplierData?.State,
    supplierData?.Country,
  ]
    .filter(Boolean)
    .join(", ");
  const handleReloadHotels = async () => {
    await refetch();
  };

  useEffect(() => {
    if (!supplierData?.HotelKey) return;
    if (!hotelData?.searchKey) return;

    setBookingData({
      supplierData,
      searchData: appliedSearchData,
      selectedHotel: {
        hotelKey: supplierData.HotelKey,
        searchKey: hotelData.searchKey,
        hotelName: supplierData?.HotelName,
        hotelImage:
          supplierData?.HotelImage || supplierData?.HotelGallery?.[0] || "",
        address: supplierData?.Address,
        city: supplierData?.City,
        country: supplierData?.Country,
      },
    });
  }, [supplierData, hotelData?.searchKey, appliedSearchData, setBookingData]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen !bg-[#eef3f8]">
      <div
        className={`sticky top-0 z-50 flex items-center !justify-between p-2 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <button
          onClick={() => window.history.back()}
          className="flex h-10 w-10 items-center justify-center"
        >
          <ArrowLeftOutlined className="text-lg" />
        </button>

        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <button
            onClick={onWishlist}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 active:scale-95"
          >
            {isWishlisted ? (
              <HeartFilled className="text-lg text-red-500!" />
            ) : (
              <HeartOutlined className="text-lg" />
            )}
          </button>

          {/* Share */}
          <button
            onClick={onShare}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 active:scale-95"
          >
            <ShareAltOutlined className="text-lg" />
          </button>
        </div>
      </div>

      {showSkeleton ? (
        <HotelDetailsSkeleton />
      ) : (
        <>
          {detailError && (
            <Alert
              className="mx-3 mb-3"
              type="error"
              showIcon
              title="Unable to load hotel details"
              description={detailError}
            />
          )}
          <div className="mx-auto w-full rounded-b-[24px] bg-white shadow-sm">
            {/* Top Overlay Icons */}

            {/* Gallery */}
            <div className="relative">
              <ViewHotelGalleryMobile
                images={hotelImages}
                onOpen={() => setIsGalleryOpen(true)}
                onBack={() => window.history.back()}
                onWishlist={onWishlist}
                isWishlisted={isWishlisted}
              />
            </div>

            {/* Hotel Card */}
            <div className="!bg- -mt-5 rounded-t-[28px] px-2 pt-5">
              <div className="rounded-2xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <HotelTopSummary
                  name={supplierData?.HotelName}
                  starRating={supplierData?.StarCategory}
                  reviews={supplierData?.HotelContentFields?.hotel?.reviews}
                  stayPeriod={supplierData?.StayPeriodFields}
                  checkinInfo={supplierData?.CheckIn}
                  checkoutInfo={supplierData?.CheckOut}
                  occupancies={supplierData?.Occupancies}
                  fallbackGuests={
                    (Number(appliedSearchData?.adults) || 0) +
                    (Number(appliedSearchData?.children) || 0)
                  }
                  fallbackRooms={appliedSearchData?.rooms || 1}
                />

                <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-0 px-1 shadow-sm">
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    {/* Map Image */}
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-[#F5F7FA] p-1">
                      <img
                        src="/images/location.png"
                        alt="Location"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col">
                      <h3 className="m-0 text-[18px] leading-[1.3] font-bold text-[#1F2937]">
                        {supplierData?.City || "Location unavailable"}
                      </h3>

                      {(supplierData?.Address ||
                        supplierData?.State ||
                        supplierData?.Country) && (
                        <p className="m-0 text-sm leading-[1] text-gray-500">
                          {[
                            supplierData?.Address,
                            supplierData?.State,
                            supplierData?.Country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  {mobileMapQuery && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mobileMapQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open hotel location in maps"
                      className="most-boder-colour flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF6FF]"
                    >
                      <SendOutlined
                        className="!most-text-color"
                        style={{
                          fontSize: "16px",
                          transform: "rotate(-45deg)",
                        }}
                      />
                    </a>
                  )}
                </div>
              </div>
              {/* Price Card */}
              <div className="mt-6">
                <ViewHotelPriceCard
                  supplierData={supplierData}
                  ratePlans={ratePlans}
                  hotelDetailId={payload?.hotelDetailId || ""}
                  isRoomsLoading={isRoomsLoading}
                />
              </div>

              {/* Info */}
              <div className="mt-6">
                <ViewHotelInfo supplierData={supplierData} />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 w-full px-3">
            <HotelContentOverview
              hotelContent={supplierData?.HotelContentFields}
            />
          </div>

          {/* Hotel Sections */}
          <div className="mx-auto mt-6 w-full px-3">
            <HotelSectionsTabss
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <div className="mt-4">
              <HotelSectionsContents
                activeTab={activeTab}
                supplierData={supplierData}
                ratePlans={ratePlans}
                amenities={amenities}
                hotelDetails={hotelDetails}
              />
            </div>
          </div>

          {/* CMS Section */}

          <div className="mx-auto mt-8 w-full px-3">
            <HotelCmsSection>
              {cms ? (
                <CMSContentRenderer cms={cms} />
              ) : (
                <DynamicHotelSeoFallback
                  hotelName={supplierData?.HotelName}
                  cityName={supplierData?.City}
                />
              )}
            </HotelCmsSection>
          </div>

          {/* Related Hotels */}

          <div className="mx-auto mt-8 w-full max-w-md px-3 pb-28">
            {/* Temporarily disabled to prevent its extra hotel search during testing.
            <RelatedHotels
              cityId={appliedSearchData?.cityData?.id}
              cityName={appliedSearchData?.city}
              searchData={appliedSearchData}
              currentHotelId={payload?.hotelId}
            />
            */}
          </div>

          {/* Gallery Modal */}

          <ViewHotelModal
            open={isGalleryOpen}
            images={hotelImages}
            onClose={() => setIsGalleryOpen(false)}
          />

          {/* Sticky Bottom */}

          <div className="teb-gradient sticky bottom-0 z-50 px-2 py-3 shadow-xl lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {isRoomsLoading ? (
                  <div
                    aria-label="Loading room price"
                    className="mb-1 h-7 w-24 animate-pulse rounded bg-white/40"
                  />
                ) : !featuredRoom ? (
                  <span className="text-sm font-semibold text-white">
                    Price unavailable
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] leading-none text-white/80">
                      {featuredRoom.isPreffered
                        ? "Recommended room"
                        : "First available room"}
                    </span>
                    <h2 className="mb-1! text-2xl leading-none font-bold text-white">
                      {currencySymbol}{" "}
                      {Number(
                        featuredRoom?.pricing?.totalAmount ||
                          featuredRoom?.TotalAmount ||
                          0,
                      ).toLocaleString()}
                    </h2>

                    <span className="text-[10px] leading-none text-white/80">
                      incl. taxes
                    </span>
                  </>
                )}
              </div>
              <Drawer
                title="Select Room"
                placement="right"
                size="100%"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
              >
                <RoomOptions
                  ratePlans={ratePlans}
                  hotelDetailId={payload?.hotelDetailId || ""}
                  hotelImageFallback={
                    hotelImages?.[0] || supplierData?.HotelImage
                  }
                  isRoomsLoading={isRoomsLoading}
                  roomError={roomError}
                  hasMore={hasMore}
                  isLoadingMore={isFetchingNextPage}
                  onLoadMore={loadMoreRooms}
                  onRetry={onRetry}
                />
              </Drawer>

              <button
                onClick={() => setOpenDrawer(true)}
                className="rounded-lg bg-white px-5 py-2 text-sm font-bold text-[#0a6cff]"
              >
                SELECT ROOM
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HotelDetailsMobile;
