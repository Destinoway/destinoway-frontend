"use client";

import { Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import HotelBookingContent from "../components/hotel-booking/HotelBookingContent";
import { useRoomPricing } from "../hooks/useRoomPricing";
import { useSelectedHotelStore } from "../store/selectedHotel.store";

export default function HotleBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelDetailId = searchParams.get("hotelDetailId") || "";
  const roomId = searchParams.get("roomId") || "";
  const searchId = searchParams.get("searchId") || "";
  const supplierHotelId = searchParams.get("supplierHotelId") || "";
  const recommendationId = searchParams.get("recommendationId") || roomId;
  const { selectedHotel } = useSelectedHotelStore();
  const selectedHotelMeta = selectedHotel?.hotelMeta || {};

  const {
    data: roomPricingData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useRoomPricing({
    hotelDetailId,
    searchId,
    supplierHotelId,
    recommendationId,
  });

  useEffect(() => {
    if (!searchId || !supplierHotelId || !recommendationId) {
      router.replace("/hotels");
    }
  }, [hotelDetailId, searchId, supplierHotelId, recommendationId, router]);

  // Missing required params
  if (!searchId || !supplierHotelId || !recommendationId) {
    return null;
  }

  // Loading state
  if (isLoading || isFetching) {
    return (
      <div className="background-color-bg flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (isError || !roomPricingData) {
    return (
      <div className="background-color-bg flex min-h-screen w-full flex-col items-center justify-center gap-4 overflow-x-hidden px-4 py-8 text-center">
        <h2 className="text-lg font-semibold sm:text-xl">
          Unable to load room details
        </h2>

        <p className="max-w-md text-sm text-gray-500 sm:text-base">
          {error?.message || "Please go back and select the room again."}
        </p>

        <button
          type="button"
          onClick={() => router.replace("/hotels")}
          className="buttion-background-color rounded-lg px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 sm:text-base"
        >
          Back To Hotels
        </button>
      </div>
    );
  }

  const bookingData = {
    ...roomPricingData,
    image:
      selectedHotelMeta?.image ||
      selectedHotel?.hotelImage ||
      selectedHotel?.image ||
      "",
    location: {
      ...roomPricingData?.location,
      city:
        roomPricingData?.location?.city ||
        selectedHotelMeta?.city ||
        selectedHotelMeta?.cityName ||
        "",
      state:
        roomPricingData?.location?.state ||
        selectedHotelMeta?.state ||
        selectedHotelMeta?.stateName ||
        "",
      country:
        roomPricingData?.location?.country || selectedHotelMeta?.country || "",
    },
  };

  return (
    <main className="background-color-bg min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-full py-0">
        <HotelBookingContent
          hotelBookingData={bookingData}
          hotelDetailId={hotelDetailId}
          roomId={roomId}
        />
      </div>
    </main>
  );
}
