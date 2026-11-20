"use client";

import SectionCard from "./SectionCard";

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
    <SectionCard
      icon={<AppstoreOutlined />}
      title="Amenities"
      subtitle="Facilities available at this property"
    >
      {normalizedAmenities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {visibleAmenities.map((item, index) => (
              <div
                key={item?.id || `${item?.name}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:border-(--theme-secondary)/30 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--theme-secondary)/8 text-[15px] text-(--theme-secondary)">
                  {getAmenityIcon(item.name)}
                </span>

                <span className="min-w-0 truncate text-[13px] font-medium text-gray-700">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-full border border-(--theme-secondary)/30 bg-white px-4 text-[13px] font-semibold text-(--theme-secondary) transition-colors hover:bg-(--theme-secondary)/5"
            >
              {showAll
                ? "View Less Amenities"
                : `View All Amenities (${normalizedAmenities.length})`}
            </button>
          )}
        </>
      ) : (
        <p className="m-0 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          No amenities available
        </p>
      )}
    </SectionCard>
  );
};

export default Amenities;
