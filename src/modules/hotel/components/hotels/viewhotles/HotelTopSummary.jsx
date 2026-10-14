"use client";

import {
  CalendarOutlined,
  EnvironmentOutlined,
  StarFilled,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const formatDate = (value) => {
  if (!value) return "";
  const date = dayjs(value);
  return date.isValid() ? date.format("DD MMM YYYY") : value;
};

const getReviewSummary = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;

  const count = reviews.reduce(
    (total, review) => total + (Number(review?.count) || 0),
    0,
  );
  const weightedRating = reviews.reduce(
    (total, review) =>
      total +
      (Number(review?.rating) || 0) * (Number(review?.count) || 0),
    0,
  );

  return {
    count,
    rating: count ? (weightedRating / count).toFixed(1) : null,
  };
};

export default function HotelTopSummary({
  name,
  location,
  starRating,
  reviews,
  stayPeriod = {},
  checkinInfo = {},
  checkoutInfo = {},
  occupancies = [],
  fallbackGuests = 0,
  fallbackRooms = 1,
}) {
  const reviewSummary = getReviewSummary(reviews);
  const stars = Math.min(5, Math.max(0, Number(starRating) || 0));
  const checkInDate = formatDate(stayPeriod?.checkIn || stayPeriod?.start);
  const checkOutDate = formatDate(stayPeriod?.checkOut || stayPeriod?.end);
  const guestCount =
    occupancies.length > 0
      ? occupancies.reduce(
          (total, occupancy) =>
            total +
            (Number(occupancy?.numOfAdults) || 0) +
            (Number(occupancy?.numOfChildren) || 0),
          0,
        )
      : fallbackGuests;
  const roomCount = occupancies.length || fallbackRooms;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="!m-0 min-w-0 text-xl leading-tight font-bold text-gray-900 sm:text-2xl">
          {name || "Hotel"}
        </h1>
        {stars > 0 && (
          <span
            className="inline-flex items-center gap-0.5"
            aria-label={`${stars} star property`}
          >
            {Array.from({ length: stars }, (_, index) => (
              <StarFilled
                key={index}
                className="text-xs text-amber-500 sm:text-sm"
              />
            ))}
          </span>
        )}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 sm:text-sm">
        {location && (
          <span className="inline-flex items-center gap-1">
            <EnvironmentOutlined className="text-[var(--theme-primary)]" />
            {location}
          </span>
        )}
        {reviewSummary && (
          <span className="inline-flex items-center gap-1">
            <StarFilled className="text-amber-500" />
            {reviewSummary.rating && (
              <strong className="text-gray-800">{reviewSummary.rating}/5</strong>
            )}
            {reviewSummary.count > 0
              ? `${reviewSummary.count} reviews`
              : "Guest reviews"}
          </span>
        )}
      </div>

      {(checkInDate || checkOutDate || checkinInfo?.beginTime || checkoutInfo?.time) && (
        <div className="mt-3 grid gap-2 rounded-xl border border-gray-200 bg-gray-50/80 p-3 text-sm sm:grid-cols-2">
          <div className="flex min-w-0 items-start gap-2">
            <CalendarOutlined className="mt-0.5 text-[var(--theme-primary)]" />
            <div className="min-w-0">
              <p className="mb-0 font-semibold text-gray-800">
                Check-in{checkInDate ? ` · ${checkInDate}` : ""}
              </p>
              <p className="mb-0 text-xs text-gray-600">
                {checkinInfo?.beginTime || "Time unavailable"}
                {checkinInfo?.endTime ? ` – ${checkinInfo.endTime}` : ""}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <CalendarOutlined className="mt-0.5 text-[var(--theme-primary)]" />
            <div className="min-w-0">
              <p className="mb-0 font-semibold text-gray-800">
                Check-out{checkOutDate ? ` · ${checkOutDate}` : ""}
              </p>
              <p className="mb-0 text-xs text-gray-600">
                {checkoutInfo?.time || "Time unavailable"}
              </p>
            </div>
          </div>
          {(guestCount > 0 || roomCount > 0) && (
            <div className="flex items-center gap-2 text-xs text-gray-600 sm:col-span-2">
              <TeamOutlined className="text-[var(--theme-primary)]" />
              {guestCount} guests · {roomCount}{" "}
              {roomCount === 1 ? "room" : "rooms"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
