
"use client";

import useIsMobile from "@/hooks/useIsMobile";
import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";

import DateRangeField from "@/modules/shared/home/components/DateRangeField";
import DestinationSearchField from "@/modules/shared/home/components/DestinationSearchField";
import GuestsField from "@/modules/shared/home/components/GuestsField/GuestsField";

import {
  CalendarOutlined,
  EditOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { Modal } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { navigateToHotels } from "../../utils/hotelNavigation";
import HotelSearchForm from "./HotelSearchForm";

export default function SearchBar({ onSearch }) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const {
    draftSearchData,
    appliedSearchData,
    setDraftSearchData,
    applySearch,
  } = useHotelSearchStore();

  const [destinationError, setDestinationError] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleSearch = () => {
    if (!draftSearchData?.city?.trim()) {
      setDestinationError(true);
      return;
    }

    setDestinationError(false);

    onSearch?.();
    applySearch();

    setSearchModalOpen(false);

    navigateToHotels(router, draftSearchData);
  };

  return (
    <>
      {/* DESKTOP SEARCH BAR */}
      {isMobile === false && (
        <div className="navbar-background-color sticky top-0 z-10">
          <div className="h-[146px] px-4 !py-[20px]">
            <div className="mx-auto h-[60px] max-w-[1250px]">
              <div className="flex h-[83px] w-full items-center gap-[14px] rounded-[5px] bg-[#f5f7f9] px-4 !py-[6px]">
                {/* DESTINATION */}
                <div className="!h-[52px] min-w-0 rounded-[6px] border border-[#8f99a5] bg-white md:flex-[1.55]">
                  <DestinationSearchField
                    error={destinationError}
                    value={{
                      city: draftSearchData?.city,
                      cityData: draftSearchData?.cityData,
                    }}
                    onChange={(val) => {
                      setDestinationError(false);

                      setDraftSearchData({
                        city: val?.city || "",
                        cityData: {
                          ...val?.cityData,
                          stateName:
                            val?.cityData?.stateName ||
                            val?.cityData?.state ||
                            "",
                          countryCode:
                            val?.cityData?.countryCode ||
                            val?.cityData?.country ||
                            "",
                        },
                      });
                    }}
                    compact
                    fontSize="16px"
                    height="42px"
                    wrapperClassName="
                      !h-[42px]
                      !min-h-[42px]
                      !max-h-[42px]
                      !rounded-[6px]
                      !border-0
                      !bg-white
                      !py-0
                      !px-3
                      !font-medium
                    "
                  />
                </div>

                {/* DATE */}
                <div className="relative z-[60] min-w-0 rounded-[6px] border border-[#8f99a5] bg-[#f5f7f9] md:flex-[1.25]">
                  <DateRangeField
                    icon={
                      <CalendarOutlined className="text-[17px] text-[#1677ff]" />
                    }
                    variant="compact"
                    open={dateOpen}
                    setOpen={setDateOpen}
                    value={[
                      draftSearchData?.checkIn
                        ? dayjs(draftSearchData.checkIn)
                        : null,
                      draftSearchData?.checkOut
                        ? dayjs(draftSearchData.checkOut)
                        : null,
                    ]}
                    onChange={(dates) => {
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
                    }}
                  />
                </div>

                {/* GUESTS */}
                <div className="relative z-[50] min-w-0 rounded-[6px] border border-[#8f99a5] bg-white md:flex-[1.05]">
                  <GuestsField
                    icon={
                      <TeamOutlined className="text-[17px] text-[#1677ff]" />
                    }
                    variant="compact"
                    open={guestOpen}
                    setOpen={setGuestOpen}
                    value={draftSearchData}
                    onChange={(val) => {
                      setDraftSearchData(val);
                    }}
                  />
                </div>

                {/* SEARCH BUTTON */}
                <div className="w-[158px] shrink-0">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="buttion-background-color h-[50px] w-full rounded-[22px] border-0 px-2 !text-[18px] font-medium !text-white shadow-none transition-all duration-200 outline-none active:scale-[0.98]"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SEARCH SUMMARY */}
      {isMobile === true && (
        <div className="background-color-bg sticky top-0 z-30 p-1">
          <div className="rounded border border-gray-200 bg-white p-2 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h2 className="font-jost! mb-0! truncate text-[14px]! font-bold!">
                  {appliedSearchData?.city || "Select Destination"}
                </h2>

                <div className="mt-0! flex flex-wrap items-center gap-1 text-[12px]! text-gray-500">
                  <span>
                    {appliedSearchData?.checkIn
                      ? dayjs(appliedSearchData.checkIn).format("DD MMM")
                      : "--"}
                  </span>

                  <span>-</span>

                  <span>
                    {appliedSearchData?.checkOut
                      ? dayjs(appliedSearchData.checkOut).format("DD MMM")
                      : "--"}
                  </span>

                  <span>•</span>

                  <span>{appliedSearchData?.adults || 0} Adults</span>

                  <span>•</span>

                  <span>{appliedSearchData?.rooms || 0} Room</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="rounded-full bg-blue-50 p-2 transition hover:bg-blue-100"
              >
                <EditOutlined className="text-lg text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SEARCH MODAL */}
      <Modal
        open={searchModalOpen}
        footer={null}
        destroyOnHidden
        centered
        width={700}
        styles={{
          body: {
            padding: 20,
            maxHeight: "85vh",
            overflowY: "auto",
          },
        }}
        className="md:!max-w-[700px]"
        onCancel={() => setSearchModalOpen(false)}
      >
        <HotelSearchForm
          showSearchButton
          onSearch={handleSearch}
          onClose={() => setSearchModalOpen(false)}
        />
      </Modal>
    </>
  );
}
