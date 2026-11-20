"use client";

import { CompassOutlined, EnvironmentOutlined } from "@ant-design/icons";

import SectionCard from "./HotelSections/SectionCard";

const ViewHotelLocation = ({ supplierData = {} }) => {
  const { Address, City, State, Country, Latitude, Longitude } = supplierData;

  const hasCoordinates =
    Latitude !== null &&
    Latitude !== undefined &&
    Longitude !== null &&
    Longitude !== undefined;
  const mapQuery = hasCoordinates
    ? `${Latitude},${Longitude}`
    : [Address, City, State, Country].filter(Boolean).join(", ");
  const hasLocation = Boolean(mapQuery);

  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery,
  )}`;

  return (
    <SectionCard
      icon={<EnvironmentOutlined />}
      title="Location"
      subtitle="Explore hotel map"
      bodyClassName="p-0! sm:p-0!"
      action={
        hasLocation && (
          // `!` on bg: antd's reset.css makes links transparent otherwise.
          <a
            href={googleMapLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-(--theme-secondary)/30 bg-white! px-3.5 text-[12px] font-semibold text-(--theme-secondary)! transition hover:bg-(--theme-secondary)/5!"
          >
            <CompassOutlined />
            Directions
          </a>
        )
      }
    >
      {hasLocation ? (
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            mapQuery,
          )}&z=16&output=embed`}
          title="hotel-map"
          loading="lazy"
          className="block h-60 w-full border-0"
        />
      ) : (
        <div className="flex h-60 items-center justify-center text-sm text-gray-500">
          Location information unavailable
        </div>
      )}
    </SectionCard>
  );
};

export default ViewHotelLocation;
