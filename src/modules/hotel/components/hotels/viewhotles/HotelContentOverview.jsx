"use client";

import {
  BankOutlined,
  CarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const contentSections = [{ title: "Policies and fees", fields: ["policies"] }];

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

const getAddressLines = (address) => {
  if (typeof address === "string") {
    return [address.trim()].filter(Boolean);
  }

  if (!address || typeof address !== "object") {
    return [];
  }

  const cityLine = [
    address.city,
    address.state || address.region,
    address.postalCode || address.zipCode || address.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    address.line1 || address.addressLine1 || address.street,
    address.line2 || address.addressLine2,
    cityLine,
    address.country,
  ]
    .map((line) => String(line || "").trim())
    .filter(Boolean);
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
        return { name: String(entry).trim(), distance: "" };
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
  const contact = hotel?.contact || {};
  const addressLines = getAddressLines(contact.address || hotel?.address);
  const latitude = hotel?.geoCode?.lat ?? hotel?.geoCode?.latitude;
  const longitude = hotel?.geoCode?.long ?? hotel?.geoCode?.longitude;
  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;
  const nearbyPlaces = getNearbyPlaces(
    hotel?.nearByAttractions || hotel?.nearbyAttractions || hotel?.nearbyPlaces,
  );
  const phone = Array.isArray(contact.phones)
    ? contact.phones[0]?.number || contact.phones[0]
    : contact.phone || contact.phones;
  const hasPropertyLocation =
    addressLines.length > 0 || hasCoordinates || Boolean(phone);
  const hasLocationContent = hasPropertyLocation || nearbyPlaces.length > 0;

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
                <EnvironmentOutlined className="text-(--theme-primary)" />
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

      {hasLocationContent && (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-lg text-sky-700">
              <EnvironmentOutlined />
            </span>
            <div>
              <h2 className="m-0 text-base font-semibold text-gray-900">
                Location and nearby places
              </h2>
              <p className="m-0 mt-1 text-sm text-gray-500">
                Property address and nearby points of interest
              </p>
            </div>
          </header>

          <div
            className={`grid divide-y divide-gray-100 ${
              hasPropertyLocation && nearbyPlaces.length > 0
                ? "sm:grid-cols-2 sm:divide-x sm:divide-y-0"
                : ""
            }`}
          >
            {hasPropertyLocation && (
              <div className="space-y-4 p-4 sm:p-5">
                {addressLines.length > 0 && (
                  <div className="flex items-start gap-3">
                    <EnvironmentOutlined className="mt-1 text-base text-sky-700" />
                    <div className="min-w-0">
                      <h3 className="m-0 text-sm font-semibold text-gray-800">
                        Hotel address
                      </h3>
                      <div className="mt-1 space-y-0.5 text-sm leading-5 text-gray-600">
                        {addressLines.map((line, index) => (
                          <p key={`${line}-${index}`} className="m-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {hasCoordinates && (
                  <div className="flex items-start gap-3">
                    <EnvironmentOutlined className="mt-1 text-base text-gray-400" />
                    <div>
                      <h3 className="m-0 text-sm font-semibold text-gray-800">
                        Coordinates
                      </h3>
                      <p className="m-0 mt-1 text-sm text-gray-600">
                        {latitude}, {longitude}
                      </p>
                    </div>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-3">
                    <PhoneOutlined className="text-base text-gray-400" />
                    <a
                      href={`tel:${phone}`}
                      className="text-sm font-medium text-sky-700 hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                )}
              </div>
            )}

            {nearbyPlaces.length > 0 && (
              <div className="p-4 sm:p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <BankOutlined className="text-base text-sky-700" />
                  Nearby places
                </h3>
                <ul className="m-0 divide-y divide-gray-100 p-0">
                  {nearbyPlaces.map((place, index) => (
                    <li
                      key={`${place.name}-${index}`}
                      className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm leading-5 text-gray-700">
                        {place.name}
                      </span>
                      {place.distance && (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
                          <CarOutlined />
                          {place.distance}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
