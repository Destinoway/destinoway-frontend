"use client";

import {
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Alert, Card } from "antd";
import { useState } from "react";

import HotelDetailsSkeleton from "@/components/common/loder/HotelDetailsSkeleton";
import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import SearchBar from "../components/hotels/SearchBar";
import HotelContentOverview from "../components/hotels/viewhotles/HotelContentOverview";
import HotelSectionsContent from "../components/hotels/viewhotles/HotelSectionsContent";
import HotelSectionsTabs from "../components/hotels/viewhotles/HotelSectionsTabs";
import HotelTopSummary from "../components/hotels/viewhotles/HotelTopSummary";
import ViewHotelGallery from "../components/hotels/viewhotles/ViewHotelGallery";
import ViewHotelInfo from "../components/hotels/viewhotles/ViewHotelInfo";
import ViewHotelLocation from "../components/hotels/viewhotles/ViewHotelLocation";
import ViewHotelModal from "../components/hotels/viewhotles/ViewHotelModal";
import ViewHotelPriceCard from "../components/hotels/viewhotles/ViewHotelPriceCard";
import ViewHotelTabs from "../components/hotels/viewhotles/ViewHotelTabs";
import HotelCmsSection from "../sections/HotelCmsSection";
import DynamicHotelSeoFallback from "../seo/DynamicHotelSeoFallback";

export default function HotelDetailsDesktop({
  cms,
  hotelData,
  supplierData,
  hotel,
  hotelImages,
  amenities,
  roomPlans,
  isLoading,
  isValidPayload,
  detailError,
  roomError,
  activeTab,
  setActiveTab,
  isScrolled,
  onWishlist,
  onShare,
  isWishlisted,
  payload,
  location,
  appliedSearchData,
  hotelId,
  roomQuery,
  refetch,
  showSkeleton,
}) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleSearch = () => {};

  return (
    <div className="background-color-bg min-h-screen w-full">
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
            title="Hotel search details are missing"
            description="Please open this hotel from the search results so we can load its rooms."
          />
        ) : (
          detailError && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              title="Unable to load hotel details"
              description={detailError.message || String(detailError)}
            />
          )
        )}

        <div className="-mt-6">
          {showSkeleton ? (
            <HotelDetailsSkeleton />
          ) : (
            <Card
              className="overflow-visible rounded-md border-0 shadow-lg"
              styles={{ body: { padding: 20 } }}
            >
              <div className="flex min-w-0 items-start justify-between gap-3 lg:gap-4">
                <div className="min-w-0 flex-1">
                  <HotelTopSummary
                    name={hotel?.name || supplierData?.HotelName}
                    location={[
                      location?.city || supplierData?.City,
                      location?.country || supplierData?.Country,
                    ]
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
                    onClick={onWishlist}
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
                    onClick={onShare}
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
                  <div className="w-full">
                    <ViewHotelPriceCard
                      ratePlans={roomPlans}
                      supplierData={supplierData}
                      hotelDetailId={payload?.hotelDetailId || ""}
                      isRoomsLoading={Boolean(
                        roomQuery?.isLoading && !roomQuery?.data,
                      )}
                    />
                  </div>

                  <div className="mt-5 w-full lg:mt-6">
                    <ViewHotelLocation supplierData={supplierData} />
                  </div>
                </div>
              </div>

              <HotelContentOverview hotelContent={hotelData?.rawContent} />
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
                ratePlans={roomPlans}
                hotelImageFallback={hotelImages?.[0]}
                amenities={amenities}
                hotelDetails={hotelData?.details || {}}
                hotelDetailId={payload?.hotelDetailId || ""}
                hasMore={Boolean(roomQuery?.hasNextPage)}
                roomError={roomError?.message || roomError || null}
                isRoomsLoading={Boolean(
                  roomQuery?.isLoading && !roomQuery?.data,
                )}
                isLoadingMore={Boolean(roomQuery?.isFetchingNextPage)}
                onLoadMore={roomQuery?.fetchNextPage}
                onRetry={roomQuery?.refetch}
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

            {/* Temporarily disabled to prevent its extra hotel search during testing.
            <RelatedHotels
              cityId={appliedSearchData?.cityData?.id}
              cityName={appliedSearchData?.city}
              searchData={appliedSearchData}
              currentHotelId={payload?.hotelId}
            />
            */}
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
