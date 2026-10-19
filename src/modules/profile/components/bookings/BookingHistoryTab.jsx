"use client";

import {
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Input, Skeleton } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMyBookings } from "../../hooks/useMyBookings";
import {
  getBookingStatusMeta,
  STATUS_TONE_CLASSES,
} from "../../utils/bookingStatus";

const FILTERS = [
  { key: "all", label: "All", icon: <CalendarOutlined /> },
  { key: "confirmed", label: "Confirmed", icon: <CheckCircleFilled /> },
  { key: "pending", label: "Awaiting Payment", icon: <ClockCircleOutlined /> },
];

const formatDate = (value) => {
  const date = dayjs(value);
  return date.isValid() ? date.format("DD MMM YYYY") : "--";
};

export default function BookingHistoryTab() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useMyBookings();

  const bookings = useMemo(() => {
    const list = Array.isArray(data) ? data : [];

    return list.map((item, index) => {
      const checkIn = dayjs(item.checkInDate);
      const checkOut = dayjs(item.checkOutDate);
      const nights =
        checkIn.isValid() && checkOut.isValid()
          ? Math.max(checkOut.diff(checkIn, "day"), 1)
          : 0;

      return {
        key: `${item.bookingRefNo}-${index}`,
        hotelName: item.hotelName || "Hotel",
        address: item.address || "",
        rating: Math.max(Number(item.starRating) || 0, 0),
        bookingRefNo: item.bookingRefNo || "",
        confirmationNumber: item.confirmationNumber || "",
        checkIn: formatDate(item.checkInDate),
        checkOut: formatDate(item.checkOutDate),
        checkInDay: checkIn.isValid() ? checkIn.format("ddd") : "",
        checkOutDay: checkOut.isValid() ? checkOut.format("ddd") : "",
        nights,
        status: getBookingStatusMeta(item.status),
      };
    });
  }, [data]);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      confirmed: bookings.filter((b) => b.status.group === "confirmed").length,
      pending: bookings.filter((b) => b.status.group === "pending").length,
    }),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((item) => {
      const matchesFilter =
        activeFilter === "all" || item.status.group === activeFilter;

      const matchesSearch =
        !term ||
        item.hotelName.toLowerCase().includes(term) ||
        item.bookingRefNo.toLowerCase().includes(term) ||
        item.address.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [bookings, activeFilter, search]);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-[0_10px_35px_rgba(5,20,75,0.08)]">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-white py-14 text-center shadow-[0_10px_35px_rgba(5,20,75,0.08)]">
        <p className="text-[18px] font-semibold text-[#05144b]">
          Unable to load your bookings
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="buttion-background-color mt-4 h-10 rounded-lg px-6 text-[14px] font-semibold text-white!"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-[#E5EEF7] bg-white shadow-[0_10px_35px_rgba(5,20,75,0.08)]">
        <div className="flex flex-col gap-1 bg-linear-to-r from-[#05144b] to-[#0c2fb1] px-5 py-5 text-white">
          <h2 className="font-roboto mb-0! text-[22px] leading-tight font-semibold text-white!">
            My Bookings
          </h2>
          <p className="mb-0! text-[13px] text-white/75">
            {counts.all} booking{counts.all !== 1 ? "s" : ""} • {counts.confirmed}{" "}
            confirmed • {counts.pending} awaiting payment
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((tab) => {
              const active = activeFilter === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[14px] font-medium transition-all ${
                    active
                      ? "border-[#05144b] bg-[#05144b] text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#05144b]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`rounded-full px-2 text-[12px] ${
                      active ? "bg-white/20" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {counts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-[320px]">
            <Input
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search hotel, city or booking ID"
              className="h-10 rounded-lg"
            />
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-[#E5EEF7] bg-white py-14 text-center shadow-[0_10px_35px_rgba(5,20,75,0.08)]">
          <p className="text-[18px] font-semibold text-[#05144b]">
            No Bookings Found
          </p>
          <p className="mt-2 text-[14px] text-gray-500">
            Try changing filters or search
          </p>
        </div>
      ) : (
        filteredBookings.map((item) => (
          <div
            key={item.key}
            className="group overflow-hidden rounded-2xl border border-[#E5EEF7] bg-white shadow-[0_10px_35px_rgba(5,20,75,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(5,20,75,0.14)]"
          >
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#05144b] to-[#0c2fb1] text-[26px] text-[#fda20f]">
                  <HomeOutlined />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-roboto! mb-0! truncate text-[19px] leading-tight font-semibold! text-[#05144b]">
                      {item.hotelName}
                    </h3>
                    <span
                      className={`rounded-full border px-3 py-[2px] text-[12px] font-semibold ${STATUS_TONE_CLASSES[item.status.tone]}`}
                    >
                      {item.status.label}
                    </span>
                  </div>

                  {item.rating > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <StarFilled
                          key={i}
                          className="text-[13px] !text-[#fda20f]"
                        />
                      ))}
                    </div>
                  )}

                  {item.address && (
                    <div className="mt-2 flex items-start gap-2 text-gray-500">
                      <EnvironmentOutlined className="mt-1" />
                      <span className="text-[13px] leading-5">
                        {item.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/profile?tab=booking-details&bookingRefNo=${encodeURIComponent(item.bookingRefNo)}`,
                  )
                }
                className="buttion-background-color flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-[14px]! font-semibold text-white! transition-all md:w-[150px]"
              >
                View Booking
                <ArrowRightOutlined />
              </button>
            </div>

            <div className="mx-5 mb-5 grid grid-cols-1 gap-3 rounded-xl border border-[#E5EEF7] bg-[#FAFCFF] p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="mb-1 text-[11px] tracking-wide text-gray-500 uppercase">
                  Check-in
                </p>
                <p className="mb-0! text-[15px] font-semibold text-[#05144b]">
                  {item.checkIn}
                </p>
                <p className="mb-0! text-[12px] text-gray-500">
                  {item.checkInDay}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[11px] tracking-wide text-gray-500 uppercase">
                  Check-out
                </p>
                <p className="mb-0! text-[15px] font-semibold text-[#05144b]">
                  {item.checkOut}
                </p>
                <p className="mb-0! text-[12px] text-gray-500">
                  {item.checkOutDay}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[11px] tracking-wide text-gray-500 uppercase">
                  Duration
                </p>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#fda20f] px-3 py-[2px] text-[13px] font-medium text-[#05144b]">
                  <ClockCircleOutlined />
                  {item.nights} Night{item.nights > 1 ? "s" : ""}
                </span>
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[11px] tracking-wide text-gray-500 uppercase">
                  Booking ID
                </p>
                <p className="mb-0! truncate text-[15px] font-semibold text-[#05144b]">
                  {item.bookingRefNo}
                </p>
                {item.confirmationNumber && (
                  <p className="mb-0! truncate text-[12px] text-gray-500">
                    CNF {item.confirmationNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
