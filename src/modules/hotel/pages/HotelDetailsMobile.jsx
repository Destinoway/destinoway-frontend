"use client";
import HotelDetailsSkeleton from "@/components/common/loder/HotelDetailsSkeleton";
import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import {
  ArrowLeftOutlined,
  CalendarFilled,
  FieldTimeOutlined,
  HeartFilled,
  HeartOutlined, SendOutlined, ShareAltOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { Alert, Drawer } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import ViewHotelInfo from "../components/hotels/viewhotles/ViewHotelInfo";
import ViewHotelModal from "../components/hotels/viewhotles/ViewHotelModal";
import ViewHotelPriceCard from "../components/hotels/viewhotles/ViewHotelPriceCard";

import HotelCmsSection from "../sections/HotelCmsSection";
import RelatedHotels from "../sections/RelatedHotels";
import DynamicHotelSeoFallback from "../seo/DynamicHotelSeoFallback";

import ViewHotelGalleryMobile from "../components/hotels/viewhotles/ViewHotelGalleryMobile";
import RoomPagination from "../components/hotels/RoomPagination";
import RoomOptions from "../components/hotels/viewhotles/HotelSections/RoomOptions";
import HotelSectionsContents from "../mobile-componant/HotelSectionsContents";
import HotelSectionsTabss from "../mobile-componant/HotelSectionsTabss";
import { useHotelBookingStore } from "../store/booking.store";
import { useHotelSearchStore } from "../store/serchData.store";

function HotelDetailsMobile({
  cms,
  hotelData,
  supplierData,
  isLoading,
  isFetching,
  refetch,
  payload,
  roomPage,
  roomPageTotal,
  onRoomPageChange,
  detailError,

  isWishlisted,
  onWishlist,
  onShare,
}) {
  const { appliedSearchData } = useHotelSearchStore();
  const { setBookingData } = useHotelBookingStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [sessionExpired] = useState(false);
  const [reloadingHotels] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const showSkeleton = isLoading;

  const ratePlans = supplierData?.RatePlanRecommendations || [];

  const FirstRoomPrice = ratePlans?.[0];

  const hotelImages = supplierData?.HotelGallery || [];

  const amenities = Array.isArray(supplierData?.Amenities)
  ? supplierData.Amenities
      .map((item) => String(item).trim())
      .filter(Boolean)
  : typeof supplierData?.Amenities === "string"
    ? supplierData.Amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const hotelDetails = supplierData || [];

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
  }, [
    supplierData,
    hotelData?.searchKey,
    appliedSearchData,
    setBookingData,
  ]);

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
              message="Unable to load hotel details"
              description={detailError}
            />
          )}
          <div className="mx-auto w-full max-w-md rounded-b-[24px] bg-white shadow-sm">
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
                <h1 className="basicDetailHeadingText text-[22px] font-bold text-[#222]">
                  {supplierData?.HotelName}
                </h1>

                {/* Star */}
                <div className="!-mt-4 flex items-center gap-1">
                  {Array.from({
                    length: Number(supplierData?.StarRating || 5),
                  }).map((_, i) => (
                    <span key={i} className="!text-[17px] text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  {/* Rating Box */}
                  <span className="bg-[#0B5CB5] text-white text-[14px] font-bold 
                   px-3 py-2 rounded-[10px]">
                    4.4
                  </span>

                  {/* Review Text */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold most-text-color">
                        Very Good
                      </span>

                      <span className="text-gray-500 text-[14px] font-medium">
                        ({supplierData?.ReviewCount || "1200"} Ratings)
                      </span>
                    </div>

                    <span className="text-[13px] text-gray-600">
                      85% guests rated this property 4 and above
                    </span>
                  </div>
                </div>



                <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-0 shadow-sm px-1">
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
                    <div className="flex flex-col ">
                      <h3 className="m-0 text-[18px] font-bold leading-[1.3] text-[#1F2937]">
                        {supplierData?.City || "East Delhi"}
                      </h3>

                      <p className="m-0 text-sm leading-[1] text-gray-500">
                        {supplierData?.Address}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <button className="flex h-9 w-9 items-center justify-center rounded-full most-boder-colour bg-[#EAF6FF]">
                    <SendOutlined
                      className="!most-text-color"
                      style={{
                        fontSize: "16px",
                        transform: "rotate(-45deg)",
                      }}
                    />
                  </button>
                </div>

                {/* Travel Dates & Guests */}
                {/* Travel Dates & Guests */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  {/* Heading */}
                  <div className="flex items-center justify-between ">
                    <h3 className="text-[18px] font-bold text-black">
                      Travel Dates & Guests
                    </h3>

                    <button
                      type="button"
                      className="text-[16px] font-medium most-text-color"
                    >
                      View Calendar
                    </button>
                  </div>

                  {/* Check-in / Check-out */}
                  <div className="flex items-center gap-5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>

                      <span className="text-[16px] text-black">
                        <span className="font-medium">Check-in:</span>{" "}
                        <span className="text-gray-600">2 PM</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>

                      <span className="text-[16px] text-black">
                        <span className="font-medium">Check-out:</span>{" "}
                        <span className="text-gray-600">12 PM</span>
                      </span>
                    </div>
                  </div>

                  {/* Date + Guests */}
                  <div className="flex gap-3">
                    {/* Travel Dates */}
                    <div className="flex-1">
                      <div className="flex h-[43px] items-center gap-3 rounded-[9px] border border-gray-300 px-3">
                        {/* Calendar Icon */}
                        <CalendarFilled className="text-[20px] text-gray-900 " />

                        <span className="text-[14px] font-medium most-text-color">
                          {appliedSearchData?.checkIn
                            ? dayjs(appliedSearchData.checkIn).format("DD MMM, ddd")
                            : "30 Jul, Thu"}
                          {" - "}
                          {appliedSearchData?.checkOut
                            ? dayjs(appliedSearchData.checkOut).format("DD MMM, ddd")
                            : "31 Jul, Fri"}
                        </span>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="w-[200px]">
                      <div className="flex h-[43px] items-center gap-3 rounded-[9px] border border-gray-300 px-3">
                        {/* User Icon */}
                        <TeamOutlined className="text-[20px] text-gray-900" />

                        <span className="text-[14px] font-medium most-text-color">
                          {appliedSearchData?.guests || 2} Guests/
                          {appliedSearchData?.rooms || 1} Room
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Information */}
                  <div className="mt-4 flex items-start gap-2">
                    <FieldTimeOutlined className="text-[18px] text-black" />

                    <p className="m-0 text-[15px] leading-5 text-black">
                      Allows to extend guaranteed check-out as late as 3 PM at
                      <br className="hidden sm:block" />
                      extra charges
                    </p>
                  </div>
                </div>


              </div>
              {/* Price Card */}
              <div className="mt-6">
                <ViewHotelPriceCard
                  supplierData={supplierData}
                  ratePlans={ratePlans}
                  hotelDetailId={payload?.hotelDetailId || ""}
                />
              </div>

              {/* Info */}
              <div className="mt-6">
                <ViewHotelInfo supplierData={supplierData} />
              </div>
            </div>
          </div>

          {/* Hotel Sections */}
          <div className="mx-auto mt-6 w-full max-w-md px-3">
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

          <div className="mx-auto mt-8 w-full max-w-md px-3">
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
            <RelatedHotels
              cityId={appliedSearchData?.cityData?.id}
              cityName={appliedSearchData?.city}
              searchData={appliedSearchData}
              currentHotelId={payload?.hotelId}
            />
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
                <h2 className="mb-1! text-2xl leading-none font-bold text-white">
                  ₹
                  {Number(
                    FirstRoomPrice?.pricing?.totalAmount ||
                      FirstRoomPrice?.TotalAmount ||
                      0,
                  ).toLocaleString()}
                </h2>

                <span className="text-[10px] leading-none text-white/80">
                  incl. taxes
                </span>
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
                  supplierData={supplierData}
                  hotelDetailId={payload?.hotelDetailId || ""}
                />
                <RoomPagination
                  currentPage={roomPage}
                  total={roomPageTotal}
                  disabled={isFetching}
                  onChange={onRoomPageChange}
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
      )
      }
    </div >
  );
}

export default HotelDetailsMobile;
