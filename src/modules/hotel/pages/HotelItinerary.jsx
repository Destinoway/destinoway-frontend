"use client";

import { Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import ItineraryContent from "../components/hotel-itinerary/ItineraryContent";
import { useHotelBookingStore } from "../store/booking.store";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function HotelItinerary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const itinerary = useHotelBookingStore((state) => state.itineraryData);

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) return null;

  if (!itinerary || (bookingId && itinerary.bookingId !== bookingId)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h2 className="text-xl font-semibold text-[#05144b]">
          Booking session not found
        </h2>
        <p className="text-gray-500">
          Your booking details have expired. Please search and book again.
        </p>
        <Button
          type="primary"
          className="buttion-background-color"
          onClick={() => router.replace("/hotels")}
        >
          Back to hotels
        </Button>
      </div>
    );
  }

  return <ItineraryContent itinerary={itinerary} />;
}
