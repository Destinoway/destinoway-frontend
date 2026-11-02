"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { searchHotels } from "../services/hotel.service";
import { useSelectedHotelStore } from "../store/selectedHotel.store";
import { useHotelSearchStore } from "../store/serchData.store";

export const useHotelSessionRecovery = ({ hotelDetails, rawRatePlans }) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [reloadingHotels, setReloadingHotels] = useState(false);
  const { appliedSearchData } = useHotelSearchStore();
  const { selectedHotel, setSelectedHotel } = useSelectedHotelStore();
  const isSessionExpired = hotelDetails && rawRatePlans === null;

  useEffect(() => {
    if (isSessionExpired) {
      setSessionExpired(true);
    }
  }, [isSessionExpired]);

  const handleReloadHotels = async () => {
    try {
      setReloadingHotels(true);
      const payload = {
        HotelSeedValue: "",
        CheckInDate: dayjs(appliedSearchData?.checkIn).format("MM/DD/YYYY"),
        CheckOutDate: dayjs(appliedSearchData?.checkOut).format("MM/DD/YYYY"),

        AdultCount: appliedSearchData?.adults || 1,
        ChildCount: appliedSearchData?.children || 0,

        Child1Age: appliedSearchData?.childAges?.[0] || 0,
        Child2Age: appliedSearchData?.childAges?.[1] || 0,

        fullName: appliedSearchData?.city || "",
        id: appliedSearchData?.cityData?.id || "",

        RoomCount: appliedSearchData?.rooms || 1,
        filters: {},
        sort: "",
      };
      const response = await searchHotels(payload);
      const hotels = response?.data?.hotels || [];
      const sameHotel = hotels.find(
        (hotel) => hotel?.hotelId === selectedHotel?.hotelMeta?.hotelId,
      );
      if (sameHotel) {
        setSelectedHotel(sameHotel);
        setSessionExpired(false);
      } else {
        setSessionExpired(false);
        window.location.href = "/hotels";
      }
    } catch {
      console.error("Unable to reload hotel search results.");
    } finally {
      setReloadingHotels(false);
    }
  };

  return {
    sessionExpired,
    reloadingHotels,
    handleReloadHotels,
  };
};
