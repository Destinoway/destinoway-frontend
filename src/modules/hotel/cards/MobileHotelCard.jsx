"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useSelectedHotelStore } from "@/modules/hotel/store/selectedHotel.store";
import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import ImageGallery from "@/modules/profile/components/bookings/ImageGallery";
import HotelBookingComingSoonModal from "@/modules/shared/home/components/HotelBookingComingSoonModal";
import { useToggleWishlist } from "@/modules/wishlist/hooks/useToggleWishlist";
import { slugify } from "@/utils/slug/slugify";
import { navigateToHotelDetails } from "../utils/navigateToHotelDetails";

import {
  CheckOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
  StarFilled,
} from "@ant-design/icons";

import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";

function MobileHotelCard({ hotel, wishlistIds }) {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  const { setSelectedHotel } = useSelectedHotelStore();
  const { appliedSearchData } = useHotelSearchStore();

  const { mutateAsync, isPending } = useToggleWishlist();
  const { requireAuth } = useAuthGuard();

  const isWishlisted = wishlistIds?.has(hotel.id?.toString()) || false;

  const rating = useMemo(() => {
    return Number(hotel.rating) || Number(hotel.starRating) || 4.0;
  }, [hotel.rating, hotel.starRating]);

  const reviews = useMemo(() => {
    return Number(hotel.reviews || 0);
  }, [hotel.reviews]);

  const ratingLabel = useMemo(() => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    return "Average";
  }, [rating]);

  const hotelImages = useMemo(() => {
    const images = [];

    const addImage = (value) => {
      const url =
        typeof value === "string"
          ? value.trim()
          : value?.url ||
            value?.imageUrl ||
            value?.imageURL ||
            value?.ImageURL ||
            value?.src ||
            "";

      if (url && !images.includes(url)) {
        images.push(url);
      }
    };

    // Main image from the API / mapper
    addImage(hotel?.image);
    addImage(hotel?.heroImage);

    // Additional images, whenever the API provides them
    if (Array.isArray(hotel?.images)) {
      hotel.images.forEach(addImage);
    }

    return images;
  }, [hotel?.image, hotel?.heroImage, hotel?.images]);

  const price = useMemo(() => {
    return Number(hotel.price || 0);
  }, [hotel.price]);

  const tax = useMemo(() => {
    return Number(hotel.tax || 0);
  }, [hotel.tax]);

  const oldPrice = useMemo(() => {
    return Number(price + price * 0.1);
  }, [price]);

  const stars = useMemo(() => {
    return Math.min(Number(hotel.starRating || 0), 5);
  }, [hotel.starRating]);

  const facilities = useMemo(() => {
    if (hotel?.facilities?.length > 0) {
      return hotel.facilities
        .map((facility) => {
          if (typeof facility === "string") {
            return facility;
          }

          return facility?.name || "";
        })
        .filter(Boolean);
    }

    return [
      "Free WiFi",
      "Air Conditioning",
      "24x7 Front Desk",
      "Housekeeping",
      "Parking",
      "Restaurant",
      "Room Service",
    ];
  }, [hotel?.facilities]);

  const visibleFacilities = useMemo(() => {
    return showAllFacilities ? facilities : facilities.slice(0, 4);
  }, [showAllFacilities, facilities]);

  const handleNavigate = () => {
    navigateToHotelDetails({
      router,
      hotel,
      searchData: appliedSearchData,
      setSelectedHotel,
    });
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
        facilities: Array.isArray(hotel?.facilities)
          ? hotel.facilities
              .map((facility) =>
                typeof facility === "string" ? facility : facility?.name || "",
              )
              .filter(Boolean)
          : [],
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

    const url = `${window.location.origin}/hotel-details/${citySlug}/${hotelSlug}?hid=${hotelId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: hotel.name,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      message.success("Link copied");
    }
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target.closest("button") || e.target.closest("a")) return;
          handleNavigate();
        }}
        className="overflow-hidden rounded-2xl border border-[#E9EEF5] bg-white shadow-sm transition-all hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative p-3 pb-0">
          {hotelImages.length > 1 ? (
            <ImageGallery images={hotelImages} />
          ) : (
            <Image
              src={hotelImages[0]}
              alt={hotel.name}
              width={600}
              height={350}
              className="h-[230px] w-full rounded-[3px] object-cover"
            />
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="buttion-background-color rounded px-2 py-1 text-xs font-bold text-white">
                {rating.toFixed(1)}
              </span>

              <span className="most-text-color text-sm font-semibold">
                {ratingLabel}
              </span>

              <span className="text-xs text-gray-500">
                ({reviews.toLocaleString("en-IN")} Ratings)
              </span>
            </div>
            <div className="flex !gap-4">
              {/* Wishlist */}
              <button onClick={handleWishlist} disabled={isPending}>
                {isWishlisted ? (
                  <HeartFilled className="text-[20px] text-gray-500" />
                ) : (
                  <HeartOutlined className="text-[20px]" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="!-mt-2 !text-[22px] !text-gray-900"
              >
                <ShareAltOutlined />
              </button>
            </div>
          </div>

          {/* Hotel Name */}

          <h2 className="font-roboto! mt-4 text-[18px] leading-7 font-bold text-[#222]">
            {hotel.name}
          </h2>

          {/* Stars */}

          {stars > 0 && (
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: stars }).map((_, i) => (
                <StarFilled key={i} className="text-[13px] !text-yellow-500" />
              ))}

              <span className="ml-1 text-xs text-gray-600">
                {stars} Star Hotel
              </span>
            </div>
          )}

          {/* Address */}

          <div className="mt-2 flex items-start gap-2">
            <EnvironmentOutlined className="mt-1 text-[#4AA3DF]" />

            <p className="text-sm leading-5">
              <span className="most-text-color font-semibold">
                {hotel.address || hotel.location}
              </span>

              <span className="text-gray-500"> • Prime Location</span>
            </p>
          </div>

          {/* Facilities */}

          <div className="-mt-1 flex items-start justify-between gap-4">
            {/* Left Side */}
            <div className="flex flex-1 flex-col">
              {visibleFacilities.map((item, index) => {
                const isCashback = item.toLowerCase().includes("cashback");

                return (
                  <div key={index} className="flex items-start gap-2 py-[2px]">
                    {isCashback ? (
                      <TbCoinRupee className="shrink-0 !text-[14px] !text-gray-900" />
                    ) : (
                      <CheckOutlined className="mt-[2px] shrink-0 !text-[14px] !text-[#22C55E]" />
                    )}

                    <span className="!mt-0 text-[13px] leading-[18px] font-semibold!">
                      {item}
                    </span>
                  </div>
                );
              })}

              {facilities.length > 4 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllFacilities(!showAllFacilities);
                  }}
                  className="most-text-color mt-2 w-fit rounded bg-[#EDF7FF] px-3 py-1 text-[11px] font-semibold"
                >
                  {showAllFacilities
                    ? "View Less"
                    : `+${facilities.length - 4} More`}
                </button>
              )}
            </div>

            {/* Right Side Price */}
            <div className="shrink-0 text-right">
              <p className="!mb-0 text-[13px] text-gray-400 line-through">
                <span>{hotel.currencySymbol || "₹"}</span>
                {oldPrice.toLocaleString("en-IN")}
              </p>

              <h2 className="font-jost! mt-1 mb-0! truncate text-[18px]! font-bold!">
                <span className="mr-1 text-[12px]">
                  {hotel.currencySymbol || "₹"}
                </span>
                {price.toLocaleString("en-IN")}
              </h2>

              <p className="mt-1 text-[11px] leading-4 text-gray-500">
                + {hotel.currencySymbol || "₹"}
                {tax.toLocaleString("en-IN")} taxes & fees
              </p>

              <p className="most-text-color text-[14px]">Per Night</p>
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
