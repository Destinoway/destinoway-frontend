"use client";

import { CarOutlined, EnvironmentOutlined } from "@ant-design/icons";

const contentSections = [
  {
    title: "Policies and fees",
    fields: ["policies"],
  },
];

const getDisplayValues = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return [String(value).trim()].filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap(getDisplayValues);
  }

  if (value && typeof value === "object") {
    const selectedValue =
      value.text ||
      value.description ||
      value.name ||
      value.title ||
      value.address ||
      value.city ||
      value.country ||
      "";

    return getDisplayValues(selectedValue);
  }

  return [];
};

const getDistanceLabel = (place) => {
  const rawDistance =
    place?.distance ??
    place?.distanceValue ??
    place?.distanceInKm ??
    place?.distanceInMeters;

  if (rawDistance === null || rawDistance === undefined || rawDistance === "") {
    return "";
  }

  if (typeof rawDistance === "object") {
    const value =
      rawDistance.value ?? rawDistance.amount ?? rawDistance.distance;

    const unit = rawDistance.unit || rawDistance.units || "";

    return value === null || value === undefined
      ? ""
      : `${value}${unit ? ` ${unit}` : ""}`;
  }

  const unit =
    place?.distanceUnit ||
    place?.distanceUnits ||
    (place?.distanceInKm !== undefined
      ? "km"
      : place?.distanceInMeters !== undefined
        ? "m"
        : "");

  return `${rawDistance}${unit ? ` ${unit}` : ""}`;
};

const getNearbyPlaces = (value) => {
  const entries = Array.isArray(value) ? value : value ? [value] : [];

  return entries
    .map((entry) => {
      if (typeof entry === "string" || typeof entry === "number") {
        return {
          name: String(entry).trim(),
          distance: "",
        };
      }

      if (!entry || typeof entry !== "object") {
        return null;
      }

      return {
        name: String(
          entry.name ||
            entry.title ||
            entry.placeName ||
            entry.attractionName ||
            entry.landmark ||
            entry.description ||
            "",
        ).trim(),
        distance: getDistanceLabel(entry),
      };
    })
    .filter((place) => place?.name);
};

export default function HotelContentOverview({ hotelContent = {} }) {
  const hotel = hotelContent?.hotel || {};

  const nearbyPlaces = getNearbyPlaces(
    hotel?.nearByAttractions || hotel?.nearbyAttractions || hotel?.nearbyPlaces,
  );

  return (
    <section className="space-y-3">
      {/* Policies and Fees */}
      {contentSections.map(({ title, fields }) => {
        const sectionData = fields
          .filter((field) => hotel?.[field] !== undefined)
          .map((field) => ({
            label: field.replace(/([a-z])([A-Z])/g, "$1 $2"),
            values: getDisplayValues(hotel[field]),
          }))
          .filter(({ values }) => values.length > 0);

        if (sectionData.length === 0) {
          return null;
        }

        return (
          <details
            key={title}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 marker:hidden sm:px-5">
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                {title}
              </span>

              <span className="text-xs text-(--theme-primary) group-open:hidden">
                View details
              </span>

              <span className="hidden text-xs text-(--theme-primary) group-open:inline">
                Hide details
              </span>
            </summary>

            <div className="border-t border-gray-100 bg-gray-50/70 p-3 sm:p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {sectionData.map(({ label, values }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-gray-100 bg-white p-3"
                  >
                    <h3 className="mb-1 text-xs font-semibold tracking-wide text-gray-500 capitalize">
                      {label}
                    </h3>

                    <ul className="m-0 list-inside list-disc space-y-1 p-0 text-sm leading-6 text-gray-800">
                      {values.map((value, index) => (
                        <li key={`${label}-${index}`}>{value}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </details>
        );
      })}

      {/* Location and Nearby Places */}
      {nearbyPlaces.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-5 sm:px-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-xl text-sky-700">
              <EnvironmentOutlined />
            </span>

            <div>
              <h2 className="m-0 text-base font-semibold text-gray-900">
                Location and nearby places
              </h2>

              <p className="m-0 mt-1 text-sm text-gray-500">
                Nearby points of interest
              </p>
            </div>
          </header>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-gray-100">
            {[
              nearbyPlaces.slice(0, Math.ceil(nearbyPlaces.length / 2)),
              nearbyPlaces.slice(Math.ceil(nearbyPlaces.length / 2)),
            ].map((places, columnIndex) => (
              <div key={columnIndex} className="min-w-0">
                {places.map((place, index) => (
                  <div
                    key={`${place.name}-${index}`}
                    className="flex min-h-[60px] items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 sm:px-5"
                  >
                    {/* Place name */}
                    <span className="min-w-0 text-sm leading-5 text-gray-700">
                      {place.name}
                    </span>

                    {/* Distance badge */}
                    {place.distance && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700">
                        <CarOutlined />
                        {place.distance}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
