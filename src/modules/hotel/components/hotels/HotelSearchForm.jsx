"use client";

import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRef, useState } from "react";

import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import DateRangeField from "@/modules/shared/home/components/DateRangeField";
import DestinationSearchField from "@/modules/shared/home/components/DestinationSearchField";
import GuestsField from "@/modules/shared/home/components/GuestsField/GuestsField";
import SearchButton from "@/modules/shared/home/components/hero_section/SearchButton";

export default function HotelSearchForm({
  destinationError,
  setDestinationError,
  onClose,
  showSearchButton = false,
  onSearch,
}) {
  const { draftSearchData, setDraftSearchData } = useHotelSearchStore();

  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const destinationClickedRef = useRef(false);

  const handleDestinationChange = (value) => {
    setDestinationError?.(false);

    const cityData = value?.cityData;

    setDraftSearchData({
      city: value?.city || "",
      cityData: cityData
        ? {
            ...cityData,
            id: cityData?.id || "",
            name: cityData?.name || "",
            type: cityData?.type || "",
            city: cityData?.city || cityData?.name || "",
            state: cityData?.state || cityData?.stateName || "",
            stateName: cityData?.state || cityData?.stateName || "",
            country: cityData?.country || "",
            countryCode: cityData?.countryCode || "",
            displayName: cityData?.displayName || "",
            normalizedCity: cityData?.city || cityData?.name || "",
          }
        : null,
    });

    if (destinationClickedRef.current && (value?.city || value?.cityData)) {
      requestAnimationFrame(() => {
        setDateOpen(true);
      });
    }
  };

  const handleDateChange = (dates) => {
    setDraftSearchData({
      checkIn: dates?.[0]?.format("YYYY-MM-DD"),
      checkOut: dates?.[1]?.format("YYYY-MM-DD"),
    });

    if (dates?.[0] && dates?.[1]) {
      setDateOpen(false);

      requestAnimationFrame(() => {
        setGuestOpen(true);
      });
    }
  };

  const handleGuestsChange = (value) => {
    setDraftSearchData(value);
  };

  return (
    <div className="w-full">
      <div className="mt-4 grid w-full grid-cols-1 items-end gap-3 min-[700px]:grid-cols-2 min-[1000px]:grid-cols-[minmax(220px,2fr)_minmax(170px,1.5fr)_minmax(170px,1.5fr)_auto] min-[1000px]:gap-2 xl:gap-4 2xl:gap-4">
        {/* Destination */}
        <div
          className="min-[700px]:col-span-2 min-[1000px]:col-span-1"
          onClick={() => {
            destinationClickedRef.current = true;
          }}
        >
          <DestinationSearchField
            value={{
              city: draftSearchData?.city,
              cityData: draftSearchData?.cityData,
            }}
            error={destinationError}
            onChange={handleDestinationChange}
            height="65px"
          />
        </div>

        {/* Check-in / Check-out */}
        <div className="relative z-[100] w-full">
          <DateRangeField
            icon={<CalendarOutlined className="text-[18px] text-gray-400" />}
            variant="default"
            value={[
              draftSearchData?.checkIn ? dayjs(draftSearchData.checkIn) : null,
              draftSearchData?.checkOut
                ? dayjs(draftSearchData.checkOut)
                : null,
            ]}
            open={dateOpen}
            setOpen={setDateOpen}
            onChange={handleDateChange}
          />
        </div>

        {/* Rooms & Guests */}
        <div className="relative z-40 w-full">
          <GuestsField
            icon={<TeamOutlined className="text-[22px] !text-gray-900" />}
            variant="default"
            value={draftSearchData}
            open={guestOpen}
            setOpen={setGuestOpen}
            onChange={handleGuestsChange}
          />
        </div>

        {/* Search Button */}
        <div className="w-full min-[700px]:col-span-2 min-[1000px]:col-span-1 min-[1000px]:w-auto">
          <div className="w-full min-[1000px]:w-auto">
            <SearchButton floating={false} onSearch={onSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}
