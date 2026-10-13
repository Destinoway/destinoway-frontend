"use client";

import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import RelatedHotelCard from "../cards/RelatedHotelCard";
import { useInfiniteHotels } from "../hooks/useInfiniteHotels";
import { useSelectedHotelStore } from "../store/selectedHotel.store";
import { buildHotelPayload } from "../utils/buildHotelPayload";
import { navigateToHotelDetails } from "../utils/navigateToHotelDetails";

export default function RelatedHotels({
  cityId,
  currentHotelId,
  cityName,
  searchData,
}) {
  const router = useRouter();

  const { setSelectedHotel } = useSelectedHotelStore();

  const params = useMemo(() => {
    return buildHotelPayload({
      searchData,
    });
  }, [searchData]);

  const { data, isLoading, searchId } = useInfiniteHotels(params);

  const rawHotels = useMemo(() => {
    const page = data?.pages?.[0];
    const hotelDetailId = page?.data?.hotelDetailId || "";

    return (page?.data?.hotels || []).map((hotel) => ({
      ...hotel,
      hotelDetailId,
      searchId,
    }));
  }, [data, searchId]);

  const hotels = useMemo(() => {
    const filtered = rawHotels.filter((hotel) => {
      const hotelId = hotel?.id || hotel?.hotelId || hotel?.HotelId || "";

      return String(hotelId) !== String(currentHotelId);
    });

    const uniqueHotels = filtered.filter((hotel, index, self) => {
      const hotelId = hotel?.id || hotel?.hotelId || hotel?.HotelId || "";

      return (
        index ===
        self.findIndex((h) => {
          const otherHotelId = h?.id || h?.hotelId || h?.HotelId || "";

          return String(otherHotelId) === String(hotelId);
        })
      );
    });

    return uniqueHotels.slice(0, 4);
  }, [rawHotels, currentHotelId]);

  if (!cityId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <Spin />
      </div>
    );
  }

  if (!hotels.length) {
    return null;
  }

  const handleHotelClick = (hotel) => {
    navigateToHotelDetails({
      router,
      hotel,
      searchData,
      setSelectedHotel,
    });
  };

  return (
    <div className="!mt-8">
      <h3 className="mb-5 text-2xl font-semibold text-[#303030]">
        Similar Hotels
      </h3>

      <div className="pb-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hotels.map((hotel, index) => {
          const hotelId =
            hotel?.id ||
            hotel?.hotelId ||
            hotel?.HotelId ||
            `related-hotel-${index}`;

          return (
            <RelatedHotelCard
              key={String(hotelId)}
              hotel={hotel}
              onClick={() => handleHotelClick(hotel)}
            />
          );
        })}
      </div>
    </div>
  );
}
