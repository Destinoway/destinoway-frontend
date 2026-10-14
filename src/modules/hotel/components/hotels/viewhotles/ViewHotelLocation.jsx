"use client";

import { CompassOutlined, EnvironmentOutlined } from "@ant-design/icons";

const ViewHotelLocation = ({ supplierData = {} }) => {
  console.log("supplierData", supplierData);
  const { Address, City, State, Country, Latitude, Longitude } = supplierData;

  const mapQuery =
    Latitude && Longitude
      ? `${Latitude},${Longitude}`
      : [Address, City, State, Country].filter(Boolean).join(", ");

  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery,
  )}`;

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="most-boder-colour flex items-center justify-between border-b px-4 py-1">
        <div>
          <h3 className="flex items-center gap-2 text-[17px] font-semibold text-gray-800">
            <EnvironmentOutlined className="most-text-color" />
            Location
          </h3>

          <p className="mt-1 text-xs text-gray-500">Explore hotel map</p>
        </div>

        {/* Directions */}
        <a
          href={googleMapLink}
          target="_blank"
          rel="noreferrer"
          className="most-boder-colour most-text-color flex items-center gap-2 rounded border px-3 py-2 text-xs font-medium transition hover:bg-[#eef8fd]"
        >
          <CompassOutlined />
          Directions
        </a>
      </div>

      {/* Google Map */}
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          mapQuery,
        )}&z=16&output=embed`}
        title="hotel-map"
        loading="lazy"
        className="h-[240px] w-full border-0"
      />
    </div>
  );
};

export default ViewHotelLocation;
