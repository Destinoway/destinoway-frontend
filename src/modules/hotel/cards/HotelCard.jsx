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
import { memo, useEffect, useMemo, useState } from "react";

import { buildWishlistPayload } from "../utils/buildWishlistPayload";
import { navigateToHotelDetails } from "../utils/navigateToHotelDetails";
import { shareHotel } from "../utils/shareHotel";
import MobileHotelCard from "./MobileHotelCard";

function HotelCard({ hotel, wishlistIds }) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [openModal, setOpenModal] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const { setSelectedHotel } = useSelectedHotelStore();
  const { appliedSearchData } = useHotelSearchStore();
  const { mutateAsync, isPending } = useToggleWishlist();
  const { requireAuth } = useAuthGuard();

  /* =========================================================
     WISHLIST
  ========================================================= */

  const isWishlisted = wishlistIds?.has(hotel?.id?.toString()) || false;

  /* =========================================================
     HOTEL NAME
     
     API me name kisi bhi common field me aaye to support hoga.
  ========================================================= */

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

  /* =========================================================
     RATING
  ========================================================= */

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

  /* =========================================================
     IMAGE URL EXTRACTOR
  ========================================================= */

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

  /* =========================================================
     API IMAGES
     
     API image ko priority.
     Dummy image sirf tab jab API me kuch bhi na ho.
  ========================================================= */

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

  /* =========================================================
     RESET IMAGE WHEN HOTEL CHANGES
  ========================================================= */

  useEffect(() => {
    setCurrentImage(0);
    setShowAllFacilities(false);
  }, [hotel?.id]);

  /* =========================================================
     KEEP CURRENT IMAGE VALID
  ========================================================= */

  useEffect(() => {
    if (currentImage >= hotelImages.length || currentImage < 0) {
      setCurrentImage(0);
    }
  }, [currentImage, hotelImages.length]);

  /* =========================================================
     PRICE
  ========================================================= */

  const price = useMemo(() => {
    return Number(hotel?.price || 0);
  }, [hotel?.price]);

  const tax = useMemo(() => {
    return Number(hotel?.tax || 0);
  }, [hotel?.tax]);

  const oldPrice = useMemo(() => {
    if (!price) return 0;
    return Math.round(price + price * 0.1);
  }, [price]);

  /* =========================================================
     STARS
  ========================================================= */

  const stars = useMemo(() => {
    return Math.min(Number(hotel?.starRating || 0), 5);
  }, [hotel?.starRating]);

  /* =========================================================
     FACILITIES
  ========================================================= */

  const facilities = useMemo(() => {
    if (!Array.isArray(hotel?.facilities)) return [];

    return hotel.facilities
      .map((facility) =>
        typeof facility === "string"
          ? facility.trim()
          : facility?.name?.toString().trim() || "",
      )
      .filter(Boolean);
  }, [hotel?.facilities]);

  /* =========================================================
     VISIBLE FACILITIES
  ========================================================= */

  const visibleFacilities = useMemo(() => {
    if (showAllFacilities) {
      return facilities;
    }

    return facilities.slice(0, 4);
  }, [facilities, showAllFacilities]);

  /* =========================================================
     HOTEL NAVIGATION
  ========================================================= */

  const handleNavigate = () => {
    navigateToHotelDetails({
      router,
      hotel,
      searchData: appliedSearchData,
      setSelectedHotel,
    });
  };

  /* =========================================================
     NEXT IMAGE
  ========================================================= */

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hotelImages.length <= 1) return;

    setCurrentImage((prev) => (prev >= hotelImages.length - 1 ? 0 : prev + 1));
  };

  /* =========================================================
     PREVIOUS IMAGE
  ========================================================= */

  const handlePreviousImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hotelImages.length <= 1) return;

    setCurrentImage((prev) => (prev <= 0 ? hotelImages.length - 1 : prev - 1));
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

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

  /* =========================================================
     SHARE
  ========================================================= */

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    await shareHotel({
      hotelName,
      cityName: appliedSearchData?.city,
      hotelId: hotel?.id,
    });
  };

  /* =========================================================
     MOBILE
  ========================================================= */

  if (isMobile) {
    return <MobileHotelCard hotel={hotel} wishlistIds={wishlistIds} />;
  }

  /* =========================================================
     DESKTOP 1024+
     
     IMPORTANT:
     Card height content ke according.
     Image h-full se complete card height lega.
  ========================================================= */

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target.closest("button") || e.target.closest("a")) {
            return;
          }

          handleNavigate();
        }}
        className="group w-full cursor-pointer overflow-hidden rounded-xl border border-gray-300 bg-white transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
      >
        {/* =====================================================
            MAIN CARD

            1024+:
            min-height controlled
            height auto
        ===================================================== */}

        <div className="flex w-full items-stretch">
          {/* ===================================================
              IMAGE SECTION

              IMPORTANT:
              h-auto + self-stretch

              Isse image ki height exactly card ke equal
              rahegi.
          =================================================== */}

          <div className="relative w-[225px] shrink-0 self-stretch overflow-hidden min-[1100px]:w-[270px] min-[1200px]:w-[290px] min-[1300px]:w-[310px] min-[1400px]:w-[325px] min-[1536px]:w-[340px]">
            <Image
              key={`${hotel?.id}-${currentImage}`}
              src={hotelImages[currentImage]}
              alt={`${hotelName} image ${currentImage + 1}`}
              fill
              unoptimized
              priority={currentImage === 0}
              sizes="
                (max-width: 1099px) 245px,
                (max-width: 1199px) 270px,
                (max-width: 1299px) 290px,
                (max-width: 1399px) 310px,
                (max-width: 1535px) 325px,
                340px
              "
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* IMAGE GRADIENT */}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* =================================================
                WISHLIST
            ================================================= */}

            <button
              type="button"
              disabled={isPending}
              onClick={handleWishlist}
              className="absolute top-3 right-3 flex h-[37px] w-[37px] cursor-pointer items-center justify-center rounded-full bg-white !text-[21px] !text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-105 active:scale-95 min-[1280px]:h-[42px] min-[1280px]:w-[42px]"
            >
              {isWishlisted ? (
                <HeartFilled className="text-red-500!" />
              ) : (
                <HeartOutlined />
              )}
            </button>

            {/* =================================================
                PREVIOUS IMAGE
            ================================================= */}

            {hotelImages.length > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={handlePreviousImage}
                className="absolute top-1/2 left-3 z-30 flex h-[36px] w-[36px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[12px] text-gray-800 opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.20)] transition-all duration-200 group-hover:opacity-100 hover:scale-110 active:scale-95 min-[1280px]:h-[38px] min-[1280px]:w-[38px]"
              >
                <LeftOutlined />
              </button>
            )}

            {/* =================================================
                NEXT IMAGE
            ================================================= */}

            {hotelImages.length > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={handleNextImage}
                className="absolute top-1/2 right-3 z-30 flex h-[36px] w-[36px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[12px] text-gray-800 shadow-[0_3px_10px_rgba(0,0,0,0.22)] transition-all duration-200 hover:scale-110 active:scale-95 min-[1280px]:h-[38px] min-[1280px]:w-[38px]"
              >
                <RightOutlined />
              </button>
            )}

            {/* =================================================
                IMAGE COUNTER
            ================================================= */}

            {hotelImages.length > 1 && (
              <div className="absolute bottom-3 left-3 z-20 rounded-md bg-black/75 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                {currentImage + 1}/{hotelImages.length}
              </div>
            )}
          </div>

          {/* ===================================================
              HOTEL INFORMATION

              Flexible width
          =================================================== */}

          <div className="flex min-w-0 flex-1 flex-col border-l border-gray-300 px-3 py-3 min-[1200px]:px-4">
            {/* HOTEL NAME */}

            <div className="min-w-0">
              <h2
                title={hotelName}
                className="truncate text-[18px] leading-[23px] font-bold text-[#1f2937] min-[1200px]:text-[20px] min-[1400px]:text-[21px]"
              >
                {hotelName}
              </h2>
              {/* STARS */}
              {stars > 0 && (
                <div className="mt-1 flex items-center gap-[2px]">
                  {Array.from({
                    length: stars,
                  }).map((_, i) => (
                    <StarFilled
                      key={i}
                      className="text-[11px] text-[#C55A11]! min-[1200px]:text-[13px]"
                    />
                  ))}
                </div>
              )}
              {/* LOCATION */}
              <div className="mt-1 flex min-w-0 items-start gap-1.5">
                <EnvironmentOutlined className="mt-[2px] shrink-0 text-[12px] text-[#2167d5] min-[1200px]:text-[13px]" />

                <div className="min-w-0 flex-1">
                  <p
                    title={hotel?.address || hotel?.location}
                    className="truncate text-[12px] leading-[16px] font-medium text-[#2167d5] min-[1200px]:text-[13px]"
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

              {Number(hotel?.roomsLeft) > 0 && (
                <span className="rounded-sm bg-[#d9382b] px-2 py-[5px] text-[10px] leading-none font-semibold text-white">
                  Only {hotel.roomsLeft} left
                </span>
              )}
              {hotel?.isRecommended && (
                <span className="rounded-sm border border-gray-300 px-2 py-[4px] text-[10px] leading-none font-medium text-gray-600">
                  Recommended
                </span>
              )}

              {/* HIGHLIGHT */}
              <div className="mt-2 flex min-w-0 items-start gap-1.5 min-[1200px]:mt-3">
                <ThunderboltFilled className="mt-[2px] shrink-0 text-[11px] text-[#657184] min-[1200px]:text-[13px]" />

                <p
                  title={hotel?.highlight}
                  className="line-clamp-2 text-[11px] leading-[15px] text-[#53657d] min-[1200px]:text-[13px] min-[1200px]:leading-[17px]"
                >
                  {hotel?.highlight ||
                    "Prime Location Near US Visa Centre, 32 m Infinity Pool"}
                </p>
              </div>
              {/* COUPON */}
            </div>

            {/* =================================================
                FACILITIES

                More button always available
            ================================================= */}

            {facilities.length > 0 && (
              <div className="mt-0">
                <div className="flex max-w-full flex-wrap items-center gap-1 overflow-hidden min-[1200px]:gap-1.5">
                  {visibleFacilities.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      title={tag}
                      className="max-w-[105px] truncate rounded-md border border-gray-200 bg-gray-50 px-1.5 py-[4px] text-[9px] leading-none font-medium text-gray-600 min-[1200px]:max-w-[120px] min-[1200px]:px-2 min-[1200px]:text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}

                  {/* MORE BUTTON */}

                  {facilities.length > 4 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setShowAllFacilities((prev) => !prev);
                      }}
                      className="shrink-0 cursor-pointer rounded-md bg-[#edf7ff] px-1.5 py-[2px] text-[9px] leading-none font-semibold whitespace-nowrap text-[#2167d5] transition-colors hover:bg-[#dcefff]! min-[1200px]:px-2 min-[1200px]:text-[10px]"
                    >
                      {showAllFacilities
                        ? "View Less"
                        : `+${facilities.length - 4} More`}
                    </button>
                  )}
                </div>
                <TagsFilled className="shrink-0 text-[11px] !text-[rgb(0,126,62)] min-[1200px]:text-[15px]" />

                <span className="truncate pl-2 text-[11px] font-medium !text-[rgb(0,126,62)] min-[1200px]:text-[14px]">
                  {hotel?.couponText || "Coupon applicable"}
                </span>
              </div>
            )}
          </div>

          {/* ===================================================
              RIGHT RATING / PRICE

              Width responsive
          =================================================== */}

          <div className="flex w-[185px] shrink-0 flex-col justify-between border-l border-gray-300 px-2.5 py-3 min-[1100px]:w-[200px] min-[1200px]:w-[215px] min-[1300px]:w-[225px] min-[1400px]:w-[235px] min-[1536px]:w-[245px]">
            {/* SHARE */}

            <div
              className="flex justify-end text-[16px] text-gray-500 min-[1200px]:text-[18px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleShare}
                className="cursor-pointer transition-all duration-200 hover:scale-110 hover:text-[#2167d5]!"
              >
                <ShareAltOutlined />
              </button>
            </div>

            {/* RATING */}

            <div className="flex flex-col items-end">
              <div className="flex max-w-full items-center gap-1">
                <span className="text-[16px] font-bold text-[#2167d5] min-[1200px]:text-[18px]">
                  {rating > 0 ? rating.toFixed(1) : "N/A"}
                  {rating.toFixed(1)}
                </span>

                <span className="truncate text-[12px] font-semibold text-gray-800 min-[1200px]:text-[14px]">
                  {ratingLabel}
                </span>
              </div>

              <p className="mt-0.5 text-[11px] text-gray-500 min-[1200px]:text-[13px]">
                {reviews.toLocaleString("en-IN")} reviews
              </p>

              <p className="mt-1 text-right text-[11px] font-semibold text-gray-800 min-[1200px]:text-[14px]">
                {hotel?.locationScore
                  ? `${hotel.locationScore} Location score`
                  : "9.2 Location score"}
              </p>
            </div>

            {/* PRICE */}

            <div className="mt-auto pt-2 text-right">
              <p className="mb-1 text-[10px] text-gray-600 min-[1200px]:text-[11px]">
                Per night before taxes and fees
              </p>

              {/* OLD PRICE */}

              <div className="flex items-center justify-end gap-1">
                <span className="text-[15px] font-semibold text-gray-500 line-through min-[1200px]:text-[18px]">
                  {hotel?.currencySymbol || "₹"}
                  {oldPrice.toLocaleString("en-IN")}
                </span>

                <span className="text-[11px] font-medium text-[#d93025] min-[1200px]:text-[13px]">
                  -8%
                </span>
              </div>

              {/* CURRENT PRICE */}

              <div className="mt-0.5 flex items-center justify-end gap-1">
                <span className="text-[11px] font-semibold text-[#d93025] min-[1200px]:text-[13px]">
                  {hotel?.currencySymbol || "₹"}
                </span>

                <span className="text-[21px] leading-none font-bold text-[#d93025] min-[1200px]:text-[23px]">
                  {price.toLocaleString("en-IN")}
                </span>

                <LockFilled className="ml-1 text-[10px] text-gray-600 min-[1200px]:text-[12px]" />
              </div>

              {/* TAX */}

              <p className="mt-1 text-[9px] text-gray-500 min-[1200px]:text-[11px]">
                + <span className="mr-1">{hotel?.currencySymbol || "₹"}</span>
                {tax.toLocaleString("en-IN")} taxes & fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      <HotelBookingComingSoonModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

export default memo(HotelCard);
