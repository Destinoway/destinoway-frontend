"use client";

import { EnvironmentOutlined } from "@ant-design/icons";

const contentSections = [
  { title: "Policies and fees", fields: ["policies"] },
  {
    title: "Facilities and amenities",
    fields: ["facilityGroups", "facilities"],
  },
  {
    title: "Location and nearby places",
    fields: ["geoCode", "nearByAttractions", "contact"],
  },
  {
    title: "Descriptions, photos and reviews",
    fields: ["descriptions", "heroImage", "images", "reviews"],
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

export default function HotelContentOverview({ hotelContent = {} }) {
  const hotel = hotelContent?.hotel || {};

  return (
    <section className="space-y-3">
      {contentSections.map(({ title, fields }) => {
        const sectionData = fields
          .filter((field) => hotel?.[field] !== undefined)
          .map((field) => ({
            label: field.replace(/([a-z])([A-Z])/g, "$1 $2"),
            values: getDisplayValues(hotel[field]),
          }))
          .filter(({ values }) => values.length);

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
                <EnvironmentOutlined className="text-[var(--theme-primary)]" />
                {title}
              </span>
              <span className="text-xs text-[var(--theme-primary)] group-open:hidden">
                View details
              </span>
              <span className="hidden text-xs text-[var(--theme-primary)] group-open:inline">
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
    </section>
  );
}
