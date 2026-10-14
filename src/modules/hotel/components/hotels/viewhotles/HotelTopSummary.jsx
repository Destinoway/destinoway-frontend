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
      total + (Number(review?.rating) || 0) * (Number(review?.count) || 0),
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
                className="teb-text-color text-xs sm:text-sm"
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
            <StarFilled className="teb-text-color" />
            {reviewSummary.rating && (
              <strong className="teb-text-color">
                {reviewSummary.rating}/5
              </strong>
            )}
            {reviewSummary.count > 0
              ? `${reviewSummary.count} reviews`
              : "Guest reviews"}
          </span>
        )}
      </div>

     
    </div>
  );
}
