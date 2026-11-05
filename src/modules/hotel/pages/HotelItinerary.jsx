"use client";

import { FieldTimeOutlined } from "@ant-design/icons";
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

  if (!mounted) return <div className="min-h-screen" />;

  if (
    !itinerary ||
    (bookingId && (itinerary.bookingRefNo || itinerary.bookingId) !== bookingId)
  ) {
    return (
      <div className="background-color-bg flex min-h-[70vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--theme-secondary)/8 text-[24px] text-(--theme-secondary)">
            <FieldTimeOutlined />
          </span>
          <h2 className="m-0 mt-4 text-[20px] font-bold text-(--theme-text-primary)">
            Booking session not found
          </h2>
          <p className="m-0 mt-2 text-[14px] leading-6 text-gray-500">
            Your booking details have expired. Please search and book again.
          </p>
          <Button
            type="primary"
            size="large"
            className="buttion-background-color mt-6! h-11! rounded-xl! px-6!"
            onClick={() => router.replace("/hotels")}
          >
            Back to hotels
          </Button>
        </div>
      </div>
    );
  }

  return <ItineraryContent itinerary={itinerary} />;
}
