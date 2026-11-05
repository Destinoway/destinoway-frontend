"use client";

import { EnvironmentOutlined } from "@ant-design/icons";

export default function RelatedHotelCard({ hotel, onClick }) {
  const location = hotel?.location || {};

  const hotelName =
    hotel?.name || hotel?.hotelName || hotel?.HotelName || "Hotel";

  const image = hotel?.image || hotel?.thumbnail || hotel?.hotelImage || "";

  const locationText =
    [
      location?.city || hotel?.city,
      location?.state || hotel?.state,
      location?.country || hotel?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    location?.address ||
    hotel?.address ||
    "Location";

  const rating =
    Number(hotel?.rating?.id ?? hotel?.rating ?? hotel?.starRating) || 4;

  const price = Number(hotel?.pricing?.basicAmount ?? hotel?.price ?? 0) || 0;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded border border-[#e5edf3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* IMAGE */}

      <div className="overflow-hidden">
        <img
          src={image}
          alt={hotelName}
          className="h-45 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* CONTENT */}

      <div className="p-4">
        {/* NAME */}

        <h4 className="line-clamp-2 text-[16px] font-semibold text-[#303030]">
          {hotelName}
        </h4>

        {/* LOCATION */}

        <div className="mt-2 flex items-start gap-2">
          <EnvironmentOutlined className="mt-0.5 text-[#72C0F0]" />

          <p className="line-clamp-1 text-[12px] text-[#667085]">
            {locationText}
          </p>
        </div>

        {/* RATING + PRICE */}

        <div className="mt-4 flex items-end justify-between">
          <div className="rounded border border-blue-100 bg-blue-50 px-2 py-1">
            <span className="text-[12px] font-medium text-[#72C0F0]">
              {rating}★
            </span>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-gray-400">Per Night</p>

            <p className="text-[20px] font-bold text-[#303030]">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
