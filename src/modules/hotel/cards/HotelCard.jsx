"use client";

import useIsMobile from "@/hooks/useIsMobile";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useSelectedHotelStore } from "@/modules/hotel/store/selectedHotel.store";
import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import HotelBookingComingSoonModal from "@/modules/shared/home/components/HotelBookingComingSoonModal";
import { useToggleWishlist } from "@/modules/wishlist/hooks/useToggleWishlist";

import {
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  LockFilled,
  RightOutlined,
  ShareAltOutlined,
  StarFilled,
  TagsFilled,
  ThunderboltFilled,
} from "@ant-design/icons";

import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";

import { buildWishlistPayload } from "../utils/buildWishlistPayload";
import { navigateToHotelDetails } from "../utils/navigateToHotelDetails";
import { shareHotel } from "../utils/shareHotel";
import MobileHotelCard from "./MobileHotelCard";

const FALLBACK_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop";

function HotelCard({ hotel, wishlistIds }) {
  const router = useRouter();
  // Below 1024px the list column is too narrow for the 3-column card.
  const isMobile = useIsMobile(1024);

  const [openModal, setOpenModal] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [prevHotelId, setPrevHotelId] = useState(hotel?.id);
  const [failedImageUrl, setFailedImageUrl] = useState("");

  const { setSelectedHotel } = useSelectedHotelStore();
  const { appliedSearchData } = useHotelSearchStore();
  const { mutateAsync, isPending } = useToggleWishlist();
  const { requireAuth } = useAuthGuard();

  const isWishlisted = wishlistIds?.has(hotel?.id?.toString()) || false;

  const hotelName = useMemo(() => {
    return (
      hotel?.name ||
      hotel?.hotelName ||
      hotel?.hotel_name ||
      hotel?.propertyName ||
      hotel?.property_name ||
      "Hotel Name"
    );
  }, [
    hotel?.name,
    hotel?.hotelName,
    hotel?.hotel_name,
    hotel?.propertyName,
    hotel?.property_name,
  ]);

  const rating = useMemo(() => {
    const value = Number(hotel?.rating);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [hotel?.rating]);

  const reviews = useMemo(() => {
    return Number(hotel?.reviews) || 0;
  }, [hotel?.reviews]);

  const ratingLabel = useMemo(() => {
    if (rating >= 4.5) return "Exceptional";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating > 0) return "Average";
    return "Not rated";
  }, [rating]);

  const extractImageUrl = (image) => {
    if (!image) return null;

    if (typeof image === "string") {
      const url = image.trim();
      return url || null;
    }

    if (typeof image === "object") {
      const url =
        image?.ImageURL ||
        image?.imageURL ||
        image?.imageUrl ||
        image?.url ||
        image?.image ||
        image?.src ||
        image?.original ||
        image?.originalUrl ||
        image?.OriginalURL ||
        image?.OriginalUrl ||
        null;

      if (typeof url === "string" && url.trim()) {
        return url.trim();
      }
    }

    return null;
  };

  const hotelImages = useMemo(() => {
    const images = [];

    const addImage = (image) => {
      const url = extractImageUrl(image);

      if (url && !images.includes(url)) {
        images.push(url);
      }
    };

    /* API images */
    if (Array.isArray(hotel?.images)) {
      hotel.images.forEach(addImage);
    }

    /* Other possible API fields */
    if (Array.isArray(hotel?.hotelImages)) {
      hotel.hotelImages.forEach(addImage);
    }

    if (Array.isArray(hotel?.photos)) {
      hotel.photos.forEach(addImage);
    }

    if (Array.isArray(hotel?.gallery)) {
      hotel.gallery.forEach(addImage);
    }

    /* Single image fields */
    if (hotel?.image) {
      addImage(hotel.image);
    }

    if (hotel?.imageUrl) {
      addImage(hotel.imageUrl);
    }

    /*
      Dummy fallback ONLY when API image is unavailable.
    */
    if (images.length === 0) {
      images.push(
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      );
    }

    return images;
  }, [
    hotel?.images,
    hotel?.hotelImages,
    hotel?.photos,
    hotel?.gallery,
    hotel?.image,
    hotel?.imageUrl,
  ]);

  // Reset gallery/facilities when the card is reused for a different hotel.
  // Adjusting state during render avoids an extra effect-driven re-render.
  if (hotel?.id !== prevHotelId) {
    setPrevHotelId(hotel?.id);
    setImageIndex(0);
    setShowAllFacilities(false);
  }

  // Derived instead of corrected in an effect: fall back to the first image
  // if the list shrank below the stored index.
  const currentImage =
    imageIndex >= 0 && imageIndex < hotelImages.length ? imageIndex : 0;

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
          ? ` - ${hotel?.currencySymbol || "₹"}${couponDiscount.toLocaleString("en-IN", { maximumFractionDigits: 2 })} off!`
          : ""
      }`
    : hotel?.couponText || "Coupon applicable";

  const stars = useMemo(() => {
    return Math.min(Number(hotel?.starRating || 0), 5);
  }, [hotel?.starRating]);

  const rawFacilities = hotel?.facilities;
  const facilities = useMemo(() => {
    if (!Array.isArray(rawFacilities)) return [];

    return rawFacilities
      .map((facility) =>
        typeof facility === "string"
          ? facility.trim()
          : facility?.name?.toString().trim() || "",
      )
      .filter(Boolean);
  }, [rawFacilities]);

  const visibleFacilities = useMemo(() => {
    if (showAllFacilities) {
      return facilities;
    }

    return facilities.slice(0, 4);
  }, [facilities, showAllFacilities]);

  const handleNavigate = () => {
    navigateToHotelDetails({
      router,
      hotel,
      searchData: appliedSearchData,
      setSelectedHotel,
    });
  };

  const hotelBenefits = useMemo(() => {
    const source = hotel?.rawHotel ?? hotel;

    const benefits = [
      {
        key: "isRecommended",
        label: "Recommended",
        value: source?.isRecommended,
      },
      {
        key: "isRefundable",
        label: "Refundable",
        value: source?.isRefundable,
      },
      {
        key: "moreRatesExpected",
        label: "More rates available",
        value: source?.moreRatesExpected,
      },
      {
        key: "freeBreakfast",
        label: "Free breakfast",
        value: source?.freeBreakfast,
      },
      {
        key: "payAtHotel",
        label: "Pay at hotel",
        value: source?.payAtHotel,
      },
      {
        key: "freeCancellation",
        label: "Free cancellation",
        value: source?.freeCancellation,
      },
    ];

    return benefits.filter((benefit) => benefit.value === true);
  }, [hotel]);

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hotelImages.length <= 1) return;

    setImageIndex(currentImage >= hotelImages.length - 1 ? 0 : currentImage + 1);
  };

  const handlePreviousImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hotelImages.length <= 1) return;

    setImageIndex(currentImage <= 0 ? hotelImages.length - 1 : currentImage - 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(async () => {
      try {
        const payload = buildWishlistPayload({
          hotel,
          searchData: appliedSearchData,
        });

        await mutateAsync(payload);

        message.success(
          isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        );
      } catch {
        message.error("Wishlist update failed");
      }
    });
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    await shareHotel({
      hotelName,
      cityName: appliedSearchData?.city,
      hotelId: hotel?.id,
      searchId: hotel?.searchId,
      supplierHotelId: hotel?.supplierHotelId,
      hotelDetailId: hotel?.hotelDetailId,
    });
  };

  if (isMobile) {
    return <MobileHotelCard hotel={hotel} wishlistIds={wishlistIds} />;
  }

  const currencySymbol = hotel?.currencySymbol || "₹";
  const formatAmount = (value) =>
    value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target.closest("button") || e.target.closest("a")) {
            return;
          }

          handleNavigate();
        }}
        className="group relative isolate w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)]"
      >
        <div className="flex min-h-[230px] w-full items-stretch">
          {/* IMAGE */}
          <div className="relative w-[225px] shrink-0 self-stretch overflow-hidden min-[1100px]:w-[270px] min-[1200px]:w-[290px] min-[1300px]:w-[310px] min-[1400px]:w-[325px] min-[1536px]:w-[340px]">
            <Image
              key={`${hotel?.id}-${currentImage}`}
              src={
                failedImageUrl === hotelImages[currentImage]
                  ? FALLBACK_HOTEL_IMAGE
                  : hotelImages[currentImage]
              }
              alt={`${hotelName} image ${currentImage + 1}`}
              fill
              unoptimized
              onError={() => setFailedImageUrl(hotelImages[currentImage])}
              priority={currentImage === 0}
              sizes="
                (max-width: 1099px) 245px,
                (max-width: 1199px) 270px,
                (max-width: 1299px) 290px,
                (max-width: 1399px) 310px,
                (max-width: 1535px) 325px,
                340px
              "
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />

            <button
              type="button"
              disabled={isPending}
              onClick={handleWishlist}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className="absolute top-3 right-3 z-30 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-white/95 !text-[19px] !text-gray-500 shadow-[0_2px_10px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 min-[1280px]:h-[40px] min-[1280px]:w-[40px]"
            >
              {isWishlisted ? (
                <HeartFilled className="text-red-500!" />
              ) : (
                <HeartOutlined />
              )}
            </button>

            {hotelImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={handlePreviousImage}
                  className="absolute top-1/2 left-3 z-30 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[11px] text-gray-800 opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.20)] transition-all duration-200 group-hover:opacity-100 hover:scale-110 active:scale-95"
                >
                  <LeftOutlined />
                </button>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-3 z-30 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[11px] text-gray-800 opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.20)] transition-all duration-200 group-hover:opacity-100 hover:scale-110 active:scale-95"
                >
                  <RightOutlined />
                </button>

                <div className="absolute bottom-3 left-3 z-20 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {currentImage + 1}/{hotelImages.length}
                </div>
              </>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex min-w-0 flex-1 flex-col px-4 py-4 min-[1200px]:px-5">
            <div className="min-w-0">
              <h2
                title={hotelName}
                className="truncate text-[18px] leading-[24px] font-bold tracking-[-0.01em] text-[#111827] transition-colors group-hover:text-(--theme-secondary) min-[1200px]:text-[20px] min-[1400px]:text-[21px]"
              >
                {hotelName}
              </h2>

              {stars > 0 && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-[3px] text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200/70 min-[1200px]:text-[12px]">
                  <StarFilled className="text-[10px] text-amber-500" />
                  {stars} Star Rating
                </span>
              )}

              {/* LOCATION */}
              <div className="mt-2 flex min-w-0 items-start gap-1.5">
                <EnvironmentOutlined className="mt-[2px] shrink-0 text-[12px] text-[#2167d5] min-[1200px]:text-[13px]" />

                <div className="min-w-0 flex-1">
                  <p
                    title={hotel?.address || hotel?.location}
                    className="truncate text-[12px] leading-[17px] font-medium text-[#2167d5] min-[1200px]:text-[13px]"
                  >
                    {hotel?.address ||
                      hotel?.location ||
                      "Bandra Kurla Complex, Mumbai"}

                    {hotel?.distanceFromCenter && (
                      <span className="text-gray-500">
                        {" "}
                        - {hotel.distanceFromCenter} km to center
                      </span>
                    )}
                  </p>

                  {(hotel?.distance || hotel?.nearby) && (
                    <p className="truncate text-[11px] leading-[15px] text-gray-500">
                      {hotel?.distance || "265 m"} from Mumbai BKC
                      {hotel?.nearby
                        ? ` • ${hotel.nearby}`
                        : " • 4.8 km from Juhu Beach"}
                    </p>
                  )}
                </div>
              </div>

              {/* AVAILABILITY */}
              {(Number(hotel?.roomsLeft) > 0 || hotel?.isRecommended) && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {Number(hotel?.roomsLeft) > 0 && (
                    <span className="rounded-full bg-[#d9382b] px-2 py-[4px] text-[10px] leading-none font-semibold text-white">
                      Only {hotel.roomsLeft} left
                    </span>
                  )}
                  {hotel?.isRecommended && (
                    <span className="rounded-full border border-gray-300 px-2 py-[3px] text-[10px] leading-none font-medium text-gray-600">
                      Recommended
                    </span>
                  )}
                </div>
              )}

              {/* HIGHLIGHT */}
              <div className="mt-2.5 flex min-w-0 items-start gap-1.5">
                <ThunderboltFilled className="mt-[2px] shrink-0 text-[11px] text-[#657184] min-[1200px]:text-[13px]" />

                <p
                  title={hotel?.highlight}
                  className="line-clamp-2 text-[12px] leading-[16px] text-[#53657d] min-[1200px]:text-[13px] min-[1200px]:leading-[18px]"
                >
                  {hotel?.highlight ||
                    "Prime Location Near US Visa Centre, 32 m Infinity Pool"}
                </p>
              </div>
            </div>

            {/* Pinned to the bottom so cards line up regardless of content */}
            <div className="mt-auto space-y-2 pt-3">
              {facilities.length > 0 && (
                <div className="flex max-w-full flex-wrap items-center gap-1.5 overflow-hidden">
                  {visibleFacilities.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      title={tag}
                      className="max-w-[110px] truncate rounded-full border border-gray-200 bg-gray-50 px-2 py-[5px] text-[10px] leading-none font-medium text-gray-600 min-[1200px]:max-w-[130px] min-[1200px]:px-2.5 min-[1200px]:text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}

                  {facilities.length > 4 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setShowAllFacilities((prev) => !prev);
                      }}
                      className="shrink-0 cursor-pointer rounded-full bg-[#edf7ff] px-2 py-[5px] text-[10px] leading-none font-semibold whitespace-nowrap text-[#2167d5] transition-colors hover:bg-[#dcefff]! min-[1200px]:px-2.5 min-[1200px]:text-[11px]"
                    >
                      {showAllFacilities
                        ? "View Less"
                        : `+${facilities.length - 4} More`}
                    </button>
                  )}
                </div>
              )}

              {hotelBenefits.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {hotelBenefits.map((benefit) => (
                    <div
                      key={benefit.key}
                      className="flex items-center gap-1 text-[11px] font-medium text-green-700 min-[1200px]:text-[12px]"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-700">
                        ✓
                      </span>
                      <span>{benefit.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {(couponCode || hotel?.couponText || facilities.length > 0) && (
                <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-dashed border-green-300 bg-green-50 px-2.5 py-1">
                  <TagsFilled className="shrink-0 text-[12px] !text-[rgb(0,126,62)] min-[1200px]:text-[14px]" />
                  <span className="truncate text-[11px] font-semibold !text-[rgb(0,126,62)] min-[1200px]:text-[13px]">
                    {couponLabel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* PRICE */}
          <div className="flex w-[185px] shrink-0 flex-col border-l border-gray-100 bg-gradient-to-b from-white to-slate-50/80 px-3 py-4 text-right min-[1100px]:w-[200px] min-[1200px]:w-[215px] min-[1200px]:px-4 min-[1300px]:w-[225px] min-[1400px]:w-[235px] min-[1536px]:w-[245px]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col items-start text-left">
                {rating > 0 && (
                  <span className="flex shrink-0 items-center gap-[2px]">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const fill = Math.max(0, Math.min(1, rating - i));

                      return (
                        <span
                          key={i}
                          className="relative inline-block text-[12px] leading-none min-[1200px]:text-[14px]"
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

                <p className="mt-1 text-[11px] text-gray-500 min-[1200px]:text-[12px]">
                  {reviews.toLocaleString("en-IN")} reviews
                </p>
              </div>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share hotel"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-[14px] text-gray-500 transition-all duration-200 hover:border-[#2167d5] hover:text-[#2167d5]!"
              >
                <ShareAltOutlined />
              </button>
            </div>

            <p className="mt-2 self-start rounded-md bg-[#edf7ff] px-2 py-1 text-left text-[11px] font-semibold text-[#1f4f8f] min-[1200px]:text-[12px]">
              {hotel?.locationScore != null
                ? `${hotel.locationScore} Location score`
                : "9.2 Location score"}
            </p>

            <div className="mt-auto border-t border-dashed border-gray-200 pt-3">
              <p className="mb-1 text-[10px] text-gray-500 min-[1200px]:text-[11px]">
                Per night before taxes and fees
              </p>

              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[13px] font-medium text-gray-400 line-through min-[1200px]:text-[15px]">
                  {currencySymbol}
                  {formatAmount(beforeCouponPrice)}
                </span>

                <span className="rounded bg-red-50 px-1.5 py-[2px] text-[10px] font-bold text-[#d93025] min-[1200px]:text-[11px]">
                  -{formatAmount(discountPercent)}%
                </span>
              </div>

              <div className="mt-1 flex items-baseline justify-end gap-1">
                <span className="text-[13px] font-semibold text-[#d93025] min-[1200px]:text-[14px]">
                  {currencySymbol}
                </span>

                <span className="text-[22px] leading-none font-extrabold tracking-[-0.02em] text-[#d93025] min-[1200px]:text-[25px]">
                  {formatAmount(price)}
                </span>

                <LockFilled className="ml-0.5 self-center text-[10px] text-gray-500 min-[1200px]:text-[12px]" />
              </div>

              <p className="mt-1 text-[10px] text-gray-500 min-[1200px]:text-[11px]">
                + {currencySymbol} {formatAmount(tax)} taxes &amp; fees
              </p>
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

export default memo(HotelCard);
