"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useSelectedHotelStore } from "@/modules/hotel/store/selectedHotel.store";
import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import HotelBookingComingSoonModal from "@/modules/shared/home/components/HotelBookingComingSoonModal";
import { useToggleWishlist } from "@/modules/wishlist/hooks/useToggleWishlist";
import { slugify } from "@/utils/slug/slugify";
import { navigateToHotelDetails } from "../utils/navigateToHotelDetails";

import {
  CheckOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  LockFilled,
  RightOutlined,
  ShareAltOutlined,
  StarFilled,
  TagsFilled,
  WalletOutlined,
} from "@ant-design/icons";

import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";

const FALLBACK_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop";

const getImageUrl = (value) =>
  typeof value === "string"
    ? value.trim()
    : value?.url ||
      value?.imageUrl ||
      value?.imageURL ||
      value?.ImageURL ||
      value?.src ||
      "";

const getFacilityName = (facility) =>
  typeof facility === "string" ? facility : facility?.name || "";

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// Card for phones/tablets. Uses a container query so it stacks in narrow
// columns and switches to image-left layout when there is enough width.
function MobileHotelCard({ hotel, wishlistIds }) {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [failedImageUrl, setFailedImageUrl] = useState("");

  const { setSelectedHotel } = useSelectedHotelStore();
  const { appliedSearchData } = useHotelSearchStore();

  const { mutateAsync, isPending } = useToggleWishlist();
  const { requireAuth } = useAuthGuard();

  const isWishlisted = wishlistIds?.has(hotel?.id?.toString()) || false;
  const currencySymbol = hotel?.currencySymbol || "₹";

  // Same as desktop: only real guest ratings, no placeholder value.
  const ratingValue = Number(hotel?.rating);
  const rating =
    Number.isFinite(ratingValue) && ratingValue > 0 ? ratingValue : 0;
  const reviews = Number(hotel?.reviews || 0);
  const stars = Math.min(Number(hotel?.starRating || 0), 5);

  // Main image first, then any extra images the API provides.
  const hotelImages = [
    getImageUrl(hotel?.image),
    getImageUrl(hotel?.heroImage),
    ...(Array.isArray(hotel?.images) ? hotel.images.map(getImageUrl) : []),
  ].filter((url, index, list) => url && list.indexOf(url) === index);

  const currentImage =
    imageIndex >= 0 && imageIndex < hotelImages.length ? imageIndex : 0;
  const imageSrc =
    !hotelImages[currentImage] || failedImageUrl === hotelImages[currentImage]
      ? FALLBACK_HOTEL_IMAGE
      : hotelImages[currentImage];

  const priceDetails = hotel?.priceDetails || hotel?.rawHotel?.price || {};
  const price = Number(priceDetails?.basePrice ?? hotel?.price ?? 0) || 0;
  const tax =
    Number(priceDetails?.["platform&servicetax"] ?? hotel?.tax ?? 0) || 0;
  const beforeCouponPrice =
    Number(priceDetails?.totalPriceBeforeCoupon ?? hotel?.oldPrice) ||
    (price ? Math.round(price + price * 0.1) : 0);

  const couponDiscountPercent = Number(priceDetails?.couponDiscountPercent);
  const discountPercent = Number.isFinite(couponDiscountPercent)
    ? couponDiscountPercent
    : 8;
  const couponCode = priceDetails?.appliedCouponCode || "";
  const couponDiscount = Number(priceDetails?.couponDiscount);
  const couponLabel = couponCode
    ? `${couponCode} applied${
        Number.isFinite(couponDiscount) && couponDiscount > 0
          ? ` - ${currencySymbol}${formatAmount(couponDiscount)} off!`
          : ""
      }`
    : hotel?.couponText || "Coupon applicable";

  const facilities = Array.isArray(hotel?.facilities)
    ? hotel.facilities.map(getFacilityName).filter(Boolean)
    : [];
  const visibleFacilities = showAllFacilities
    ? facilities
    : facilities.slice(0, 4);

  const handleNavigate = () => {
    navigateToHotelDetails({
      router,
      hotel,
      searchData: appliedSearchData,
      setSelectedHotel,
    });
  };

  const changeImage = (e, step) => {
    e.preventDefault();
    e.stopPropagation();
    if (hotelImages.length <= 1) return;
    setImageIndex(
      (currentImage + step + hotelImages.length) % hotelImages.length,
    );
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    requireAuth(async () => {
      const payload = {
        hotelId: hotel.id?.toString(),
        hotelName: hotel.name,
        hotelSlug: slugify(hotel.name || hotel.hotelName),
        hotelImage: hotel.image,
        address: hotel.address || "",
        starRating: Number(hotel.starRating || 0),
        facilities,
        freeCancellation: hotel.freeCancellation || false,
        savedPrice: Number(hotel.price) || 0,
        savedTax: Number(hotel.tax) || 0,
        cityId: appliedSearchData?.cityData?.id,
        cityName: appliedSearchData?.city || "",
        stateName: appliedSearchData?.cityData?.stateName || "",
        countryCode: appliedSearchData?.cityData?.countryCode || "",
        countryName: appliedSearchData?.cityData?.country || "",
        searchType: appliedSearchData?.cityData?.type || "",
      };

      try {
        await mutateAsync(payload);

        message.success(
          isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        );
      } catch (error) {
        message.error(
          error?.response?.data?.message || "Wishlist update failed",
        );
      }
    });
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    const citySlug = slugify(
      appliedSearchData?.city?.split(",")[0] || hotel?.cityName || "hotel",
    );
    const hotelSlug = slugify(hotel?.name || hotel?.hotelName || "hotel");
    const hotelId = hotel?.hotelId || hotel?.HotelId || hotel?.id;
    const query = new URLSearchParams();

    if (hotelId) query.set("hid", String(hotelId));
    if (hotel?.searchId) query.set("searchId", String(hotel.searchId));
    if (hotel?.hotelDetailId) {
      query.set("hotelDetailId", String(hotel.hotelDetailId));
    }

    const url = `${window.location.origin}/hotel-details/${citySlug}/${hotelSlug}?${query.toString()}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: hotel.name, text: hotel.name, url });
      } catch {
        // User cancelled the share sheet.
      }
    } else {
      await navigator.clipboard.writeText(url);
      message.success("Link copied");
    }
  };

  const overlayButtonClass =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-white/95 shadow-[0_2px_10px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-transform duration-200 active:scale-90";

  return (
    <>
      <div className="@container">
        <div
          onClick={(e) => {
            if (e.target.closest("button") || e.target.closest("a")) return;
            handleNavigate();
          }}
          className="group relative isolate flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition-all duration-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] active:scale-[0.995] @[560px]:flex-row"
        >
          {/* IMAGE */}
          <div className="relative h-[210px] w-full shrink-0 overflow-hidden min-[480px]:h-[240px] @[560px]:h-auto @[560px]:min-h-[250px] @[560px]:w-[42%]">
            <Image
              key={imageSrc}
              src={imageSrc}
              alt={`${hotel?.name || "Hotel"} image ${currentImage + 1}`}
              fill
              unoptimized
              sizes="(max-width: 560px) 100vw, 320px"
              onError={() => setFailedImageUrl(hotelImages[currentImage])}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-black/15" />

            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share hotel"
                className={`${overlayButtonClass} text-[15px] text-gray-700`}
              >
                <ShareAltOutlined />
              </button>
              <button
                type="button"
                onClick={handleWishlist}
                disabled={isPending}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`${overlayButtonClass} text-[17px] text-gray-500`}
              >
                {isWishlisted ? (
                  <HeartFilled className="text-red-500!" />
                ) : (
                  <HeartOutlined />
                )}
              </button>
            </div>

            {hotelImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(e) => changeImage(e, -1)}
                  className={`${overlayButtonClass} absolute top-1/2 left-2.5 z-10 h-8! w-8! -translate-y-1/2 text-[11px] text-gray-800`}
                >
                  <LeftOutlined />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(e) => changeImage(e, 1)}
                  className={`${overlayButtonClass} absolute top-1/2 right-2.5 z-10 h-8! w-8! -translate-y-1/2 text-[11px] text-gray-800`}
                >
                  <RightOutlined />
                </button>
                <span className="absolute right-3 bottom-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {currentImage + 1}/{hotelImages.length}
                </span>
              </>
            )}

            {stars > 0 && (
              <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-amber-700 shadow-sm">
                <StarFilled className="text-[10px] text-amber-500" />
                {stars} Star Hotel
              </span>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex min-w-0 flex-1 flex-col p-4 @[560px]:p-5">
            <h2 className="line-clamp-2 text-[17px] leading-[23px] font-bold tracking-[-0.01em] text-[#111827] @[560px]:text-[19px] @[560px]:leading-[25px]">
              {hotel?.name}
            </h2>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {rating > 0 && (
                <span className="flex items-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const fill = Math.max(0, Math.min(1, rating - i));

                    return (
                      <span
                        key={i}
                        className="relative inline-block text-[12px] leading-none"
                      >
                        <StarFilled className="text-gray-300!" />
                        <span
                          className="absolute inset-y-0 left-0 overflow-hidden"
                          style={{ width: `${fill * 100}%` }}
                        >
                          <StarFilled className="text-[#C55A11]!" />
                        </span>
                      </span>
                    );
                  })}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {reviews.toLocaleString("en-IN")} reviews
              </span>
            </div>

            {(hotel?.address || hotel?.location) && (
              <div className="mt-2 flex min-w-0 items-start gap-1.5">
                <EnvironmentOutlined className="mt-[3px] shrink-0 text-[12px] text-[#2167d5]" />
                <p className="line-clamp-2 text-[13px] leading-[18px] font-medium text-[#2167d5]">
                  {hotel?.address || hotel?.location}
                </p>
              </div>
            )}

            {/* FACILITIES */}
            {facilities.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {visibleFacilities.map((item, index) => {
                  const isCashback = item.toLowerCase().includes("cashback");

                  return (
                    <span
                      key={`${item}-${index}`}
                      className="inline-flex max-w-[150px] items-center gap-1 truncate rounded-full border border-gray-200 bg-gray-50 px-2.5 py-[5px] text-[11px] leading-none font-medium text-gray-600"
                    >
                      {isCashback ? (
                        <WalletOutlined className="shrink-0 text-[10px] text-gray-700" />
                      ) : (
                        <CheckOutlined className="shrink-0 text-[9px] text-emerald-500" />
                      )}
                      <span className="truncate">{item}</span>
                    </span>
                  );
                })}

                {facilities.length > 4 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllFacilities((prev) => !prev);
                    }}
                    className="cursor-pointer rounded-full border-none bg-[#edf7ff] px-2.5 py-[5px] text-[11px] leading-none font-semibold text-[#2167d5]"
                  >
                    {showAllFacilities
                      ? "View Less"
                      : `+${facilities.length - 4} More`}
                  </button>
                )}
              </div>
            )}

            {(couponCode || hotel?.couponText) && (
              <div className="mt-3 inline-flex max-w-full items-center gap-1.5 self-start rounded-lg border border-dashed border-green-300 bg-green-50 px-2.5 py-1">
                <TagsFilled className="shrink-0 text-[12px] text-[rgb(0,126,62)]!" />
                <span className="truncate text-[12px] font-semibold text-[rgb(0,126,62)]!">
                  {couponLabel}
                </span>
              </div>
            )}

            {/* PRICE */}
            <div className="mt-auto pt-3">
              <div className="flex items-end justify-between gap-3 border-t border-dashed border-gray-200 pt-3">
                <p className="text-[11px] leading-4 text-gray-500">
                  Per night
                  <br />+ {currencySymbol} {formatAmount(tax)} taxes &amp; fees
                </p>

                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[12px] font-medium text-gray-400 line-through">
                      {currencySymbol}
                      {formatAmount(beforeCouponPrice)}
                    </span>
                    <span className="rounded bg-red-50 px-1.5 py-[2px] text-[10px] font-bold text-[#d93025]">
                      -{formatAmount(discountPercent)}%
                    </span>
                  </div>

                  <div className="mt-1 flex items-baseline justify-end gap-1">
                    <span className="text-[13px] font-semibold text-[#d93025]">
                      {currencySymbol}
                    </span>
                    <span className="text-[22px] leading-none font-extrabold tracking-[-0.02em] text-[#d93025]">
                      {formatAmount(price)}
                    </span>
                    <LockFilled className="ml-0.5 self-center text-[10px] text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HotelBookingComingSoonModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

export default memo(MobileHotelCard);
