"use client";

import {
  EnvironmentOutlined,
} from "@ant-design/icons";

import HotelDataFieldTree from "./HotelDataFieldTree";

const contentSections = [
  {
    title: "Property details",
    fields: [
      "id",
      "type",
      "category",
      "starRating",
      "chainName",
      "distance",
      "locationName",
      "neighbourhoods",
    ],
  },
  {
    title: "Policies and fees",
    fields: ["policies", "fees"],
  },
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

export default function HotelContentOverview({ hotelContent = {} }) {
  const hotel = hotelContent?.hotel || {};

  return (
    <section className="space-y-3">
      {contentSections.map(({ title, fields }) => {
        const sectionData = Object.fromEntries(
          fields
            .filter((field) => hotel?.[field] !== undefined)
            .map((field) => [field, hotel[field]]),
        );

        if (Object.keys(sectionData).length === 0) {
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
              <HotelDataFieldTree data={sectionData} />
            </div>
          </details>
        );
      })}
    </section>
  );
}
