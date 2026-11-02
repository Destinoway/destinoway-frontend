"use client";

import {
  AppstoreOutlined,
  CarOutlined,
  CloudOutlined,
  CoffeeOutlined,
  HomeOutlined,
  RestOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const getAmenityName = (amenity) => {
  if (typeof amenity === "string") {
    return amenity.trim();
  }

  if (amenity && typeof amenity === "object") {
    return (
      amenity?.name ||
      amenity?.title ||
      amenity?.description ||
      ""
    ).trim();
  }

  return "";
};

const getAmenityIcon = (amenity = "") => {
  const name = getAmenityName(amenity).toLowerCase();

  if (name.includes("wifi") || name.includes("wi-fi")) {
    return <WifiOutlined />;
  }

  if (name.includes("pool") || name.includes("swimming")) {
    return <CloudOutlined />;
  }

  if (
    name.includes("bar") ||
    name.includes("coffee") ||
    name.includes("restaurant")
  ) {
    return <CoffeeOutlined />;
  }

  if (name.includes("parking") || name.includes("car")) {
    return <CarOutlined />;
  }

  if (name.includes("power") || name.includes("electric")) {
    return <ThunderboltOutlined />;
  }

  if (
    name.includes("room") ||
    name.includes("lounge") ||
    name.includes("house")
  ) {
    return <HomeOutlined />;
  }

  if (
    name.includes("refrigerator") ||
    name.includes("fridge") ||
    name.includes("shop")
  ) {
    return <ShopOutlined />;
  }

  if (name.includes("smoking") || name.includes("rest")) {
    return <RestOutlined />;
  }

  return <AppstoreOutlined />;
};

const Amenities = ({ amenities = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const normalizedAmenities = Array.isArray(amenities)
    ? amenities
        .map((item) => ({
          name: getAmenityName(item),
          id: typeof item === "object" ? item?.id || "" : "",
        }))
        .filter((item) => item.name)
    : [];

  const hasMore = normalizedAmenities.length > 8;

  const visibleAmenities = showAll
    ? normalizedAmenities
    : normalizedAmenities.slice(0, 8);

  return (
    <div className="rounded-xl border border-gray-300 p-6">
      <h2 className="mb-5 text-xl font-semibold text-gray-800">Amenities</h2>

      {normalizedAmenities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleAmenities.map((item, index) => (
              <div
                key={item?.id || `${item?.name}-${index}`}
                className="most-boder-colour flex items-center gap-3 rounded border bg-gray-50 p-3"
              >
                <div className="most-text-color text-[18px]">
                  {getAmenityIcon(item.name)}
                </div>

                <span className="text-sm font-medium text-gray-700">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="cursor-pointer border-b border-dotted border-[#0f172a] pb-1 text-sm font-semibold text-[#0f172a]! transition hover:text-[#0ea5e9]"
              >
                {showAll ? "View Less Amenities" : "View All Amenities"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded border border-dashed p-6 text-center text-gray-500">
          No amenities available
        </div>
      )}
    </div>
  );
};

export default Amenities;
