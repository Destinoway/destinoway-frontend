"use client";

import { CompassOutlined, EnvironmentOutlined } from "@ant-design/icons";

import SectionCard from "./SectionCard";

const LocationSection = ({ supplierData = {} }) => {
  const location = supplierData?.location || {};
  const address = location?.address || supplierData?.Address || "";
  const city = location?.city || supplierData?.City || "";
  const state = location?.state || supplierData?.State || "";
  const country = location?.country || supplierData?.Country || "";
  const pincode =
    location?.pincode ||
    supplierData?.Pincode ||
    supplierData?.PostalCode ||
    "";
  const latitude = location?.latitude ?? supplierData?.Latitude ?? null;
  const longitude = location?.longitude ?? supplierData?.Longitude ?? null;
  const mapQuery =
    latitude !== null && longitude !== null
      ? `${latitude},${longitude}`
      : [address, city, state, country, pincode].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const hasLocation =
    Boolean(address) || Boolean(city) || Boolean(state) || Boolean(country);

  const details = [
    ["City", city],
    ["State", state],
    ["Country", country],
    ["Postal Code", pincode],
    [
      "Coordinates",
      latitude !== null && longitude !== null ? `${latitude}, ${longitude}` : "",
    ],
  ].filter(([, value]) => value);

  return (
    <SectionCard
      icon={<EnvironmentOutlined />}
      title="Hotel Location"
      subtitle="Address & nearby area"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr] lg:gap-5">
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-gray-200 bg-slate-50/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-(--theme-secondary)">
              <CompassOutlined />
              <span className="text-[12px] font-bold tracking-[0.08em] uppercase">
                Property Address
              </span>
            </div>
            <p className="m-0 text-[14px] leading-6 font-medium text-gray-800">
              {address || "Address unavailable"}
            </p>
          </div>

          {details.length > 0 && (
            <dl className="m-0 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white px-4 text-sm">
              {details.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="m-0 text-right font-semibold text-gray-800">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {hasLocation && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto flex h-11 items-center justify-center gap-2 rounded-xl bg-(--theme-secondary)! text-sm font-semibold text-white! shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition hover:bg-(--theme-hover)!"
            >
              <CompassOutlined /> Get Directions
            </a>
          )}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-slate-100">
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live Map
          </span>
          {mapQuery ? (
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
              className="block h-65 w-full border-0 sm:h-85 lg:h-full lg:min-h-85"
              loading="lazy"
              title="hotel-map"
            />
          ) : (
            <div className="flex h-65 items-center justify-center text-sm text-gray-500 sm:h-85">
              Location information unavailable
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default LocationSection;
