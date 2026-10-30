"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import RoomDescription from "@/modules/hotel/components/hotels/viewhotles/RoomDescription";
import { buildRoomBookingUrl } from "@/modules/hotel/utils/buildRoomBookingUrl";
import { useHotelBookingStore } from "@/modules/hotel/store/booking.store";
import RoomPriceBreakdown from "../RoomPriceBreakdown";
import { Button, Modal } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const getText = (value) => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value).trim();
  }

  if (Array.isArray(value)) {
    return value.map(getText).filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    const text =
      value.description ||
      value.name ||
      value.title ||
      value.value ||
      value.text ||
      value.type ||
      value.bedType ||
      "";
    const count = value.count ?? value.quantity;

    if (text && count !== null && count !== undefined && count !== "") {
      return `${count} × ${text}`.trim();
    }

    if (text) {
      return String(text).trim();
    }

    const startDate = value.fromDate || value.startDate;
    const endDate = value.toDate || value.endDate;
    const charge = value.amount ?? value.penalty ?? value.charge;
    if (startDate || endDate || charge !== undefined) {
      const dateRange = [startDate, endDate].filter(Boolean).join(" – ");
      return [dateRange, charge !== undefined ? `Charge: ${charge}` : ""]
        .filter(Boolean)
        .join(" · ");
    }

    return "";
  }

  return "";
};

const getItems = (value) => {
  if (value === null || value === undefined || value === "") {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];
  return values.map(getText).filter(Boolean);
};

const getImageUrl = (value) => {
  if (typeof value === "string") {
    return value;
  }

  return value?.url || value?.image || value?.ImageURL || value?.src || "";
};

const getAvailabilityCount = (availability) => {
  if (typeof availability === "boolean") {
    return availability ? "Available" : "Unavailable";
  }

  if (typeof availability === "number" || typeof availability === "string") {
    return availability;
  }

  if (availability && typeof availability === "object") {
    return (
      availability.available ??
      availability.count ??
      availability.remaining ??
      availability.quantity ??
      ""
    );
  }

  return "";
};

const getAvailabilityLabel = (availability) => {
  const count = getAvailabilityCount(availability);

  if (count === "" || count === null || count === undefined) {
    return "";
  }

  return typeof count === "number" || /^\d+$/.test(String(count))
    ? `${count} available`
    : String(count);
};

const BOOLEAN_FIELDS = [
  ["isGSTInvoiceAvailable", "GST invoice available"],
  ["isPANRequired", "PAN required"],
  ["refundable", "Refundable"],
  ["allGuestsInfoRequired", "All guest details required"],
  ["onlineCancellable", "Online cancellation"],
  ["payAtHotel", "Pay at hotel"],
  ["cardRequired", "Card required"],
  ["guaranteeRequired", "Guarantee required"],
];

function RoomOptionCard({ plan, hotelDetailId, hotelImageFallback }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const { setBookingData } = useHotelBookingStore();
  const images = (Array.isArray(plan?.images) ? plan.images : [])
    .map(getImageUrl)
    .filter(Boolean);
  const imageIndex = images.length ? activeImage % images.length : 0;
  const fallbackImage =
    getImageUrl(hotelImageFallback) || "/images/heroimage.jpg";
  const imageSrc = images[imageIndex] || fallbackImage;
  const availability = getAvailabilityLabel(plan?.availability);
  const roomName = plan?.roomType || "Room option";
  const items = [
    ["Policies", plan?.policies],
    ["Board basis", plan?.boardBasis],
    ["Includes", plan?.includes],
    ["Facilities", plan?.facilities],
    ["Room type", plan?.type],
  ]
    .map(([label, value]) => [label, getItems(value)])
    .filter(([, values]) => values.length);
  const policies = items.find(([label]) => label === "Policies")?.[1] || [];
  const stayIncludes = items.filter(([label]) =>
    ["Board basis", "Includes"].includes(label),
  );
  const roomFacilities = items.filter(([label]) =>
    ["Facilities", "Room type"].includes(label),
  );
  const roomHighlights = [
    [
      "Guests",
      plan?.maxGuestAllowed !== null && plan?.maxGuestAllowed !== undefined
        ? `Up to ${getText(plan.maxGuestAllowed)} guests`
        : "",
    ],
    [
      "Adults",
      plan?.maxAdultAllowed !== null && plan?.maxAdultAllowed !== undefined
        ? `Up to ${getText(plan.maxAdultAllowed)} adults`
        : "",
    ],
    [
      "Children",
      plan?.maxChildrenAllowed !== null &&
      plan?.maxChildrenAllowed !== undefined
        ? `Up to ${getText(plan.maxChildrenAllowed)} children`
        : "",
    ],
    ["Room size", getText(plan?.area)],
    ["Bed type", getText(plan?.beds)],
    ["View", getText(plan?.views)],
  ].filter(([, value]) => value !== "");
  const capacityDetails = [
    plan?.maxGuestAllowed,
    plan?.maxAdultAllowed,
    plan?.maxChildrenAllowed,
  ];
  const hasAdditionalDetails =
    items.length > 0 ||
    Boolean(plan?.bookNowPayLaterDate) ||
    capacityDetails.some((value) => value !== null && value !== undefined);
  const boardBasis = getItems(plan?.boardBasis || plan?.includes).slice(0, 2);
  const refundabilityText = getText(plan?.refundability).toLowerCase();
  const policyText = getItems(plan?.policies).join(" ").toLowerCase();
  const hasFreeCancellation =
    refundabilityText.includes("free cancellation") ||
    policyText.includes("free cancellation");
  const isRefundable =
    plan?.refundable === true || refundabilityText.includes("refundable");

  const selectRoom = () => {
    const recommendationId = plan?.recommendationId || "";

    if (!plan?.searchId || !plan?.supplierHotelId || !recommendationId) {
      console.error("Room selection is missing required search identifiers", {
        missing: [
          !plan?.searchId && "searchId",
          !plan?.supplierHotelId && "supplierHotelId",
          !recommendationId && "recommendationId",
        ].filter(Boolean),
        hotelDetailId,
        recommendationId,
        searchId: plan?.searchId,
        supplierHotelId: plan?.supplierHotelId,
        plan,
      });
      return;
    }

    setBookingData({ selectedRatePlan: plan, selectedRoom: plan });
    router.push(
      buildRoomBookingUrl({
        hotelDetailId,
        searchId: plan.searchId,
        supplierHotelId: plan.supplierHotelId,
        recommendationId,
      }),
    );
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[250px_minmax(0,1fr)_230px]">
        <div className="relative h-52 overflow-hidden rounded-xl bg-slate-100 sm:h-56 lg:h-full lg:min-h-56">
          <Image
            src={imageSrc}
            alt={roomName}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 250px"
            className="object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous room image"
                onClick={() =>
                  setActiveImage(
                    (index) => (index - 1 + images.length) % images.length,
                  )
                }
                className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-lg text-white"
              >
                <ChevronLeft aria-hidden="true" size={18} />
              </button>
              <button
                type="button"
                aria-label="Next room image"
                onClick={() =>
                  setActiveImage((index) => (index + 1) % images.length)
                }
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-lg text-white"
              >
                <ChevronRight aria-hidden="true" size={18} />
              </button>
              <span className="absolute right-2 bottom-2 rounded-full bg-black/65 px-2 py-1 text-xs text-white">
                {imageIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="m-0 text-lg font-bold text-slate-900 sm:text-xl">
              {roomName}
            </h3>
            {plan?.isPreffered === true && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                Recommended
              </span>
            )}
            {plan?.isHold === true && (
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">
                On hold
              </span>
            )}
          </div>

          {plan?.description && (
            <RoomDescription
              html={plan.description}
              className="mt-2 line-clamp-2"
            />
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {hasFreeCancellation && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Free cancellation
              </span>
            )}
            {!hasFreeCancellation && isRefundable && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Refundable
              </span>
            )}
            {boardBasis.map((basis) => (
              <span
                key={`board-${basis}`}
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800"
              >
                {basis}
              </span>
            ))}
            {availability !== "" && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {availability}
              </span>
            )}
            {plan?.roomCount !== null &&
              plan?.roomCount !== undefined &&
              plan.roomCount !== "" && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Room count: {getText(plan.roomCount)}
                </span>
              )}
            {plan?.smokingAllowed !== null &&
              plan?.smokingAllowed !== undefined && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {plan.smokingAllowed ? "Smoking allowed" : "Non-smoking"}
                </span>
              )}
            {plan?.area !== null &&
              plan?.area !== undefined &&
              plan.area !== "" && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Area: {getText(plan.area)}
                </span>
              )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {BOOLEAN_FIELDS.map(([field, label]) =>
              plan?.[field] === true ? (
                <span
                  key={field}
                  className="inline-flex items-center gap-1.5 font-medium text-emerald-600"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-xs font-bold text-emerald-600">
                      ✓
                    </span>
                  </span>
                  {label}
                </span>
              ) : null,
            )}
          </div>

          {hasAdditionalDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="mt-4 text-sm font-semibold text-[var(--theme-primary)] underline underline-offset-2"
            >
              Room details
            </button>
          )}
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-4">
          <RoomPriceBreakdown pricing={plan?.pricing} />
          <Button
            type="primary"
            size="large"
            onClick={() => requireAuth(selectRoom)}
            className="buttion-background-color !mt-4 !h-11 w-full rounded-lg text-sm font-semibold text-white!"
          >
            Select room
          </Button>
        </div>
      </div>

      <Modal
        title={
          <span className="pr-6 text-base font-bold text-slate-900 sm:text-lg">
            {roomName}
          </span>
        }
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={null}
        width={800}
        centered
        styles={{ body: { paddingTop: 8 } }}
      >
        <div className="max-h-[72vh] space-y-5 overflow-y-auto px-1 pb-1">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="relative h-52 overflow-hidden rounded-lg bg-slate-100 sm:h-60">
              <Image
                src={imageSrc}
                alt={roomName}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 420px"
                className="object-cover"
              />
              {images.length > 1 && (
                <>
                  <span className="absolute bottom-3 left-3 rounded bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                    {imageIndex + 1} / {images.length} photos
                  </span>
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button
                      type="button"
                      aria-label="Previous room image"
                      onClick={() =>
                        setActiveImage(
                          (index) =>
                            (index - 1 + images.length) % images.length,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded bg-black/65 text-lg text-white"
                    >
                      <ChevronLeft aria-hidden="true" size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next room image"
                      onClick={() =>
                        setActiveImage((index) => (index + 1) % images.length)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded bg-black/65 text-lg text-white"
                    >
                      <ChevronRight aria-hidden="true" size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div>
              <p className="mt-0 mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Room highlights
              </p>
              <dl className="divide-y divide-slate-100 border-y border-slate-100">
                {roomHighlights.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-3 py-2.5 text-sm"
                  >
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="m-0 text-right font-medium text-slate-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              {plan?.bookNowPayLaterDate && (
                <p className="mt-3 mb-0 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Book now, pay later:{" "}
                  <span className="font-semibold">
                    {getText(plan.bookNowPayLaterDate)}
                  </span>
                </p>
              )}
            </div>
          </div>
          {plan?.description && (
            <section className="border-t border-slate-200 pt-4">
              <h4 className="mb-2 text-sm font-bold text-slate-900">
                About the room
              </h4>
              <RoomDescription
                html={plan.description}
                className="text-sm leading-6 text-slate-600"
              />
            </section>
          )}
          {(stayIncludes.length > 0 || roomFacilities.length > 0) && (
            <section className="border-t border-slate-200 pt-4">
              <h4 className="mt-0 mb-3 text-sm font-bold text-slate-900">
                Room details
              </h4>
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {stayIncludes.map(([label, values]) => (
                  <div key={label}>
                    <h5 className="mb-2 text-sm font-semibold text-slate-700">
                      {label}
                    </h5>
                    <ul className="m-0 list-disc space-y-1 pl-5 text-sm leading-5 text-slate-600">
                      {values.map((value, index) => (
                        <li key={`${label}-${index}`}>{value}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {roomFacilities.map(([label, values]) => (
                  <div key={label}>
                    <h5 className="mb-2 text-sm font-semibold text-slate-700">
                      {label}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value, index) => (
                        <span
                          key={`${label}-${index}`}
                          className="rounded bg-slate-100 px-2.5 py-1.5 text-sm leading-5 text-slate-700"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {policies.length > 0 && (
            <section className="border-t border-slate-200 pt-4">
              <h4 className="mt-0 mb-2 text-sm font-bold text-slate-900">
                Policies
              </h4>
              <ul className="m-0 list-disc space-y-1 pl-5 text-sm leading-5 text-slate-600">
                {policies.map((policy, index) => (
                  <li key={`policy-${index}`}>{policy}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Modal>
    </article>
  );
}

const RoomOptions = ({
  ratePlans = [],
  hotelDetailId = "",
  hotelImageFallback = "",
  isRoomsLoading = false,
  roomError = null,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  onRetry,
}) => {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore || typeof onLoadMore !== "function") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="space-y-4">
      {!isRoomsLoading &&
        ratePlans.map((plan, index) => (
          <RoomOptionCard
            key={
              plan?.roomGroupId ||
              plan?.ratePlanId ||
              plan?.roomId ||
              `room-${index}`
            }
            plan={plan}
            hotelDetailId={hotelDetailId}
            hotelImageFallback={hotelImageFallback}
          />
        ))}
      {(isRoomsLoading || isLoadingMore) &&
        Array.from({ length: 2 }, (_, index) => (
          <div
            key={`room-skeleton-${index}`}
            aria-hidden="true"
            className="grid animate-pulse gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:grid-cols-[250px_minmax(0,1fr)_230px]"
          >
            <div className="h-52 rounded-xl bg-slate-200 sm:h-56 lg:h-full lg:min-h-56" />
            <div className="space-y-4 py-1">
              <div className="h-6 w-2/3 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-4/5 rounded bg-slate-100" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-slate-100" />
                <div className="h-6 w-24 rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-xl bg-slate-50 p-4">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
              <div className="h-6 w-2/3 rounded bg-slate-200" />
              <div className="h-11 w-full rounded-lg bg-slate-200" />
            </div>
          </div>
        ))}
      {roomError && !isRoomsLoading && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="m-0 font-semibold">Unable to load room options</p>
          <p className="m-0 mt-1 wrap-break-word">{roomError}</p>
          {typeof onRetry === "function" && (
            <Button type="link" onClick={() => onRetry()} className="px-0!">
              Retry loading rooms
            </Button>
          )}
        </div>
      )}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {!isLoadingMore && (
            <span className="text-sm text-gray-400">Scroll for more rooms</span>
          )}
        </div>
      )}
      {!hasMore && !!ratePlans.length && (
        <div className="flex justify-center py-4 text-sm text-gray-400">
          End of room options
        </div>
      )}
      {!ratePlans.length && !isRoomsLoading && !isLoadingMore && !roomError && (
        <div className="rounded border border-dashed p-8 text-center text-gray-500">
          No rooms available
        </div>
      )}
    </div>
  );
};

export default RoomOptions;
