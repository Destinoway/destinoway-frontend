"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import HotelBookingContent from "../components/hotel-booking/HotelBookingContent";
import HotelBookingSkeleton from "../components/hotel-booking/HotelBookingSkeleton";
import { useItineraryPricing } from "../hooks/useItineraryPricing";
import { useRoomPricing } from "../hooks/useRoomPricing";
import { mergeItineraryPricing } from "../utils/normalizeRoomPriceCheckResponse";
import { useHotelBookingStore } from "../store/booking.store";
import { useSelectedHotelStore } from "../store/selectedHotel.store";

export default function HotleBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelDetailId = searchParams.get("hotelDetailId") || "";
  const roomId = searchParams.get("roomId") || "";
  const searchId = searchParams.get("searchId") || "";
  const supplierHotelId = searchParams.get("supplierHotelId") || "";
  const recommendationId = searchParams.get("recommendationId") || "";
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

  const itineraryId = roomPricingData?.itineraryId || "";
  const {
    data: itineraryPricingData,
    isLoading: isPricingLoading,
    isError: isPricingError,
    error: pricingError,
    refetch: refetchItineraryPricing,
  } = useItineraryPricing(itineraryId);

  // Called after a coupon is applied/removed so the price reflects it.
  const refreshItineraryPricing = async () => {
    const result = await refetchItineraryPricing();
    if (result?.isError) {
      throw result.error || new Error("Unable to refresh room pricing.");
    }
    return result?.data;
  };

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
  if (
    (!roomPricingData && (isLoading || isFetching)) ||
    (!itineraryPricingData && isPricingLoading)
  ) {
    return <HotelBookingSkeleton />;
  }

  // Error state
  const hasPricingError =
    !itineraryPricingData && (isPricingError || !itineraryId);

  if (isError || !roomPricingData || hasPricingError) {
    return (
      <div className="background-color-bg flex min-h-screen w-full flex-col items-center justify-center gap-4 overflow-x-hidden px-4 py-8 text-center">
        <h2 className="text-lg font-semibold sm:text-xl">
          Unable to load room details
        </h2>

        <p className="max-w-md text-sm text-gray-500 sm:text-base">
          {error?.message ||
            pricingError?.message ||
            (!itineraryId && roomPricingData
              ? "Room pricing is unavailable right now."
              : "") ||
            "Please go back and select the room again."}
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

  const pricedData = mergeItineraryPricing(
    roomPricingData,
    itineraryPricingData,
  );

  const bookingData = {
    ...pricedData,
    rooms: (pricedData?.rooms || []).map((room) => ({
      ...room,
      roomType:
        room?.name ||
        room?.roomName ||
        room?.roomType ||
        "Selected Room",
    })),
    image:
      pricedData?.image ||
      pricedData?.hotel?.image ||
      selectedHotel?.hotelImage ||
      selectedHotel?.image ||
      selectedHotelMeta?.image ||
      "",
  };

  return (
    <main className="background-color-bg min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-full py-0">
        <HotelBookingContent
          hotelBookingData={bookingData}
          hotelDetailId={hotelDetailId}
          roomId={roomId}
          onPricingRefresh={refreshItineraryPricing}
        />
      </div>
    </main>
  );
}
