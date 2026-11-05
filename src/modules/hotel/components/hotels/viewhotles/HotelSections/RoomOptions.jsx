"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import RoomDescription from "@/modules/hotel/components/hotels/viewhotles/RoomDescription";
import { useHotelBookingStore } from "@/modules/hotel/store/booking.store";
import { buildRoomBookingUrl } from "@/modules/hotel/utils/buildRoomBookingUrl";
import { Button, Modal } from "antd";
import {
  Baby,
  BedDouble,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Cigarette,
  CigaretteOff,
  DoorOpen,
  Eye,
  FileText,
  Maximize2,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RoomPriceBreakdown from "../RoomPriceBreakdown";

/* =========================
   HELPER FUNCTIONS
========================= */

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

/* =========================
   BOOLEAN ROOM FEATURES
========================= */

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

/* =========================
   MODAL SECTION
========================= */

function DetailSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--theme-secondary)/8 text-(--theme-secondary)">
          <Icon size={16} aria-hidden="true" />
        </span>
        <h4 className="m-0 text-[15px] font-bold text-(--theme-text-primary)">
          {title}
        </h4>
      </div>
      {children}
    </section>
  );
}

/* =========================
   ROOM OPTION CARD
========================= */

function RoomOptionCard({ plan, hotelDetailId, hotelImageFallback }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const router = useRouter();

  const { requireAuth } = useAuthGuard();

  const { setBookingData } = useHotelBookingStore();

  /* =========================
     ROOM IMAGES
  ========================= */

  const images = (Array.isArray(plan?.images) ? plan.images : [])
    .map(getImageUrl)
    .filter(Boolean);

  const imageIndex = images.length ? activeImage % images.length : 0;

  const fallbackImage =
    getImageUrl(hotelImageFallback) || "/images/heroimage.jpg";

  const imageSrc = images[imageIndex] || fallbackImage;

  /* =========================
     ROOM DATA
  ========================= */

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

  /* =========================
     ROOM HIGHLIGHTS
  ========================= */

  const hasValue = (value) =>
    value !== null && value !== undefined && value !== "";

  const roomHighlights = [
    [
      "Guests",
      hasValue(plan?.maxGuestAllowed)
        ? `Up to ${getText(plan.maxGuestAllowed)}`
        : "",
      Users,
    ],
    [
      "Adults",
      hasValue(plan?.maxAdultAllowed)
        ? `Up to ${getText(plan.maxAdultAllowed)}`
        : "",
      User,
    ],
    [
      "Children",
      hasValue(plan?.maxChildrenAllowed)
        ? `Up to ${getText(plan.maxChildrenAllowed)}`
        : "",
      Baby,
    ],
    ["Room size", getText(plan?.area), Maximize2],
    ["Bed type", getText(plan?.beds), BedDouble],
    ["View", getText(plan?.views), Eye],
    [
      "Rooms",
      hasValue(plan?.roomCount) ? getText(plan.roomCount) : "",
      DoorOpen,
    ],
    [
      "Smoking",
      hasValue(plan?.smokingAllowed)
        ? plan.smokingAllowed
          ? "Allowed"
          : "Non-smoking"
        : "",
      plan?.smokingAllowed ? Cigarette : CigaretteOff,
    ],
  ].filter(([, value]) => value !== "");

  const roomFeatures = BOOLEAN_FIELDS.filter(
    ([field]) => plan?.[field] === true,
  ).map(([, label]) => label);

  const capacityDetails = [
    plan?.maxGuestAllowed,
    plan?.maxAdultAllowed,
    plan?.maxChildrenAllowed,
  ];

  const hasAdditionalDetails =
    items.length > 0 ||
    roomHighlights.length > 0 ||
    Boolean(plan?.description) ||
    Boolean(plan?.bookNowPayLaterDate) ||
    capacityDetails.some((value) => value !== null && value !== undefined);

  /* =========================
     REFUND / BOARD DETAILS
  ========================= */

  const boardBasis = getItems(plan?.boardBasis || plan?.includes).slice(0, 2);

  const refundabilityText = getText(plan?.refundability).toLowerCase();

  const policyText = getItems(plan?.policies).join(" ").toLowerCase();

  const hasFreeCancellation =
    refundabilityText.includes("free cancellation") ||
    policyText.includes("free cancellation");

  const isRefundable =
    plan?.refundable === true || refundabilityText.includes("refundable");

  /* =========================
     SELECT ROOM
  ========================= */

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

    setBookingData({
      selectedRatePlan: plan,
      selectedRoom: plan,
    });

    router.push(
      buildRoomBookingUrl({
        hotelDetailId,
        searchId: plan.searchId,
        supplierHotelId: plan.supplierHotelId,
        recommendationId,
      }),
    );
  };

  /* =========================
     CARD UI
  ========================= */

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-gray-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
      <div className="grid gap-4 p-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-5 lg:grid-cols-[250px_minmax(0,1fr)_230px]">
        {/* =========================
            ROOM IMAGE
        ========================= */}

        <div className="relative h-48 overflow-hidden rounded-xl bg-slate-100 sm:h-full sm:min-h-48 lg:min-h-56">
          <Image
            src={imageSrc}
            alt={roomName}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 350px"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* IMAGE COUNTER */}

          {images.length > 0 && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-white/30 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
                {imageIndex + 1}
              </span>

              <span className="text-white/80">/</span>

              <span>{images.length}</span>
            </div>
          )}

          {/* IMAGE NAVIGATION */}

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
                className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md transition hover:bg-black/80"
              >
                <ChevronLeft aria-hidden="true" size={19} />
              </button>

              <button
                type="button"
                aria-label="Next room image"
                onClick={() =>
                  setActiveImage((index) => (index + 1) % images.length)
                }
                className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md transition hover:bg-black/80"
              >
                <ChevronRight aria-hidden="true" size={19} />
              </button>
            </>
          )}
        </div>

        {/* =========================
            ROOM INFORMATION
        ========================= */}

        <div className="flex min-w-0 flex-col">
          {/* ROOM TITLE */}

          <div className="flex flex-wrap items-center gap-2">
            <h3 className="m-0 text-[17px] leading-tight font-bold text-(--theme-text-primary) sm:text-xl">
              {roomName}
            </h3>

            {plan?.isPreffered === true && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                Recommended
              </span>
            )}

            {plan?.isHold === true && (
              <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-800">
                On hold
              </span>
            )}
          </div>

          {/* ROOM DESCRIPTION */}

          {plan?.description && (
            <RoomDescription
              html={plan.description}
              className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-slate-500 sm:text-sm"
            />
          )}

          {/* =========================
              HIGHLIGHTED ROOM OPTIONS
          ========================= */}

          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* REFUNDABLE */}

            {hasFreeCancellation && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:text-xs">
                <Check size={12} aria-hidden="true" />
                Free cancellation
              </span>
            )}

            {!hasFreeCancellation && isRefundable && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:text-xs">
                <Check size={12} aria-hidden="true" />
                Refundable
              </span>
            )}

            {/* BOARD BASIS */}

            {boardBasis.map((basis) => (
              <span
                key={`board-${basis}`}
                className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800 sm:text-xs"
              >
                {basis}
              </span>
            ))}

            {/* AVAILABILITY */}

            {availability !== "" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                {availability}
              </span>
            )}

            {/* ROOM COUNT */}

            {plan?.roomCount !== null &&
              plan?.roomCount !== undefined &&
              plan.roomCount !== "" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                  <span className="text-slate-400">Rooms:</span>

                  {getText(plan.roomCount)}
                </span>
              )}

            {/* SMOKING */}

            {plan?.smokingAllowed !== null &&
              plan?.smokingAllowed !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                  <span className="text-slate-400">
                    {plan.smokingAllowed ? "Smoking:" : "Smoking:"}
                  </span>

                  {plan.smokingAllowed ? "Allowed" : "Non-smoking"}
                </span>
              )}

            {/* ROOM AREA */}

            {plan?.area !== null &&
              plan?.area !== undefined &&
              plan.area !== "" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700 sm:text-xs">
                  <span className="text-violet-400">Area:</span>

                  {getText(plan.area)}
                </span>
              )}
          </div>

          {/* =========================
              ROOM FEATURES
          ========================= */}

          {roomFeatures.some((label) => label !== "Refundable") && (
            <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-x-4 gap-y-1.5 p-0 min-[420px]:grid-cols-2">
              {roomFeatures
                .filter((label) => label !== "Refundable")
                .map((label) => (
                  <li
                    key={label}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 sm:text-[13px]"
                  >
                    <Check
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 text-emerald-600"
                    />
                    {label}
                  </li>
                ))}
            </ul>
          )}

          {/* ROOM DETAILS BUTTON */}

          {hasAdditionalDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="mt-auto inline-flex w-fit cursor-pointer items-center gap-1 border-none bg-transparent p-0 pt-3 text-sm font-semibold text-(--theme-secondary) underline-offset-4 transition hover:underline sm:pt-4"
            >
              View room details
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* =========================
            PRICE AND SELECT ROOM
        ========================= */}

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:col-span-2 sm:p-4 lg:col-span-1 lg:flex-col lg:items-stretch lg:justify-center">
          <div className="min-w-0 flex-1 lg:hidden">
            <RoomPriceBreakdown pricing={plan?.pricing} variant="inline" />
          </div>
          <div className="hidden lg:block">
            <RoomPriceBreakdown pricing={plan?.pricing} />
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => requireAuth(selectRoom)}
            className="buttion-background-color h-11! shrink-0 rounded-lg! px-5! text-sm font-semibold text-white! lg:mt-4! lg:w-full"
          >
            Select room
          </Button>
        </div>
      </div>

      {/* =========================
          ROOM DETAILS MODAL
      ========================= */}

      <Modal
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={null}
        closable={false}
        width={960}
        centered
        styles={{
          container: { padding: 0, borderRadius: 20, overflow: "hidden" },
          body: { padding: 0 },
        }}
      >
        <div className="flex max-h-[90vh] flex-col bg-white">
          {/* HEADER */}

          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="m-0 text-[11px] font-bold tracking-[0.12em] text-(--theme-secondary) uppercase">
                Room details
              </p>

              <h3 className="m-0 mt-1 text-lg leading-tight font-bold text-(--theme-text-primary) sm:text-xl">
                {roomName}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {plan?.isPreffered === true && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                    Recommended
                  </span>
                )}

                {(hasFreeCancellation || isRefundable) && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    <Check size={12} aria-hidden="true" />
                    {hasFreeCancellation ? "Free cancellation" : "Refundable"}
                  </span>
                )}

                {boardBasis.map((basis) => (
                  <span
                    key={`modal-board-${basis}`}
                    className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-800"
                  >
                    {basis}
                  </span>
                ))}

                {availability !== "" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-bold text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {availability}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              aria-label="Close room details"
              onClick={() => setShowDetails(false)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* SCROLLABLE BODY */}

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/60 px-4 py-4 sm:px-6 sm:py-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              {/* GALLERY */}

              <div className="min-w-0">
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={imageSrc}
                    alt={roomName}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />

                  {images.length > 0 && (
                    <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {imageIndex + 1} / {images.length} photos
                    </span>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous room image"
                        onClick={() =>
                          setActiveImage(
                            (index) =>
                              (index - 1 + images.length) % images.length,
                          )
                        }
                        className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/90 text-gray-800 shadow-md transition hover:bg-white"
                      >
                        <ChevronLeft size={18} aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        aria-label="Next room image"
                        onClick={() =>
                          setActiveImage((index) => (index + 1) % images.length)
                        }
                        className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/90 text-gray-800 shadow-md transition hover:bg-white"
                      >
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div
                    className="mt-2.5 flex gap-2 overflow-x-auto pb-1"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {images.map((src, index) => (
                      <button
                        key={`${src}-${index}`}
                        type="button"
                        aria-label={`Show room image ${index + 1}`}
                        onClick={() => setActiveImage(index)}
                        className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-slate-100 p-0 transition ${
                          index === imageIndex
                            ? "border-(--theme-secondary)"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* HIGHLIGHTS */}

              <div className="flex min-w-0 flex-col gap-4">
                {roomHighlights.length > 0 && (
                  <DetailSection icon={Sparkles} title="Room highlights">
                    <div className="grid grid-cols-2 gap-2.5">
                      {roomHighlights.map(([label, value, Icon]) => (
                        <div
                          key={label}
                          className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-100 bg-slate-50 px-3 py-2.5"
                        >
                          <Icon
                            size={18}
                            aria-hidden="true"
                            className="shrink-0 text-(--theme-secondary)"
                          />
                          <div className="min-w-0">
                            <p className="m-0 text-[11px] text-gray-500">
                              {label}
                            </p>
                            <p className="m-0 truncate text-[13px] font-semibold text-gray-800">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DetailSection>
                )}

                {plan?.bookNowPayLaterDate && (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CalendarClock
                      size={20}
                      aria-hidden="true"
                      className="shrink-0 text-emerald-700"
                    />
                    <p className="m-0 text-sm text-emerald-800">
                      Book now, pay later by{" "}
                      <span className="font-bold">
                        {getText(plan.bookNowPayLaterDate)}
                      </span>
                    </p>
                  </div>
                )}

                {roomFeatures.length > 0 && (
                  <DetailSection icon={ShieldCheck} title="Booking benefits">
                    <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                      {roomFeatures.map((label) => (
                        <li
                          key={label}
                          className="flex items-center gap-2 text-[13px] font-medium text-gray-700"
                        >
                          <Check
                            size={15}
                            aria-hidden="true"
                            className="shrink-0 text-emerald-600"
                          />
                          {label}
                        </li>
                      ))}
                    </ul>
                  </DetailSection>
                )}
              </div>
            </div>

            {/* ABOUT ROOM */}

            {plan?.description && (
              <DetailSection icon={FileText} title="About the room">
                <RoomDescription
                  html={plan.description}
                  className="text-sm leading-6 text-gray-600"
                />
              </DetailSection>
            )}

            {/* INCLUSIONS */}

            {stayIncludes.length > 0 && (
              <DetailSection icon={UtensilsCrossed} title="Inclusions">
                <div className="space-y-4">
                  {stayIncludes.map(([label, values]) => (
                    <div key={label}>
                      <p className="m-0 mb-2 text-[12px] font-bold tracking-wide text-gray-500 uppercase">
                        {label}
                      </p>
                      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                        {values.map((value, index) => (
                          <li
                            key={`${label}-${index}`}
                            className="flex items-start gap-2 text-sm leading-5 text-gray-700"
                          >
                            <Check
                              size={15}
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-emerald-600"
                            />
                            <span className="min-w-0 wrap-break-word">
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

            {/* FACILITIES */}

            {roomFacilities.length > 0 && (
              <DetailSection icon={BedDouble} title="Room amenities">
                <div className="space-y-4">
                  {roomFacilities.map(([label, values]) => (
                    <div key={label}>
                      <p className="m-0 mb-2 text-[12px] font-bold tracking-wide text-gray-500 uppercase">
                        {label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value, index) => (
                          <span
                            key={`${label}-${index}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-slate-50 px-3 py-1.5 text-[13px] leading-5 text-gray-700"
                          >
                            <Check
                              size={13}
                              aria-hidden="true"
                              className="shrink-0 text-(--theme-secondary)"
                            />
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

            {/* POLICIES */}

            {policies.length > 0 && (
              <DetailSection icon={ShieldCheck} title="Room policies">
                <ul className="m-0 list-none space-y-2.5 p-0">
                  {policies.map((policy, index) => (
                    <li
                      key={`policy-${index}`}
                      className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--theme-secondary)" />
                      <span className="min-w-0 wrap-break-word">{policy}</span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}
          </div>

          {/* FOOTER: PRICE + CTA */}

          <div className="flex items-center gap-4 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-6px_16px_rgba(15,23,42,0.04)] sm:px-6">
            <RoomPriceBreakdown pricing={plan?.pricing} variant="inline" />

            <Button
              type="primary"
              size="large"
              onClick={() => {
                setShowDetails(false);
                requireAuth(selectRoom);
              }}
              className="buttion-background-color h-11! shrink-0 rounded-lg px-6! text-sm font-semibold text-white!"
            >
              Select room
            </Button>
          </div>
        </div>
      </Modal>
    </article>
  );
}

/* =========================
   ROOM OPTIONS
========================= */

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

  /* =========================
     INFINITE SCROLL
  ========================= */

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
      {
        rootMargin: "300px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-4">
      {/* ROOM CARDS */}

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

      {/* LOADING SKELETON */}

      {(isRoomsLoading || isLoadingMore) &&
        Array.from({ length: 2 }, (_, index) => (
          <div
            key={`room-skeleton-${index}`}
            aria-hidden="true"
            className="grid animate-pulse gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:grid-cols-[250px_minmax(0,1fr)_230px]"
          >
            <div className="h-52 rounded-xl bg-slate-200 sm:h-56 lg:h-full lg:min-h-56" />

            <div className="space-y-4 py-1">
              <div className="h-6 w-2/3 rounded bg-slate-200" />

              <div className="h-4 w-full rounded bg-slate-100" />

              <div className="h-4 w-4/5 rounded bg-slate-100" />

              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-md bg-slate-100" />

                <div className="h-6 w-24 rounded-md bg-slate-100" />
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

      {/* ROOM ERROR */}

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

      {/* LOAD MORE */}

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {!isLoadingMore && (
            <span className="text-sm text-gray-400">Scroll for more rooms</span>
          )}
        </div>
      )}

      {/* END OF ROOM LIST */}

      {!hasMore && !!ratePlans.length && (
        <div className="flex justify-center py-4 text-sm text-gray-400">
          End of room options
        </div>
      )}

      {/* NO ROOMS */}

      {!ratePlans.length && !isRoomsLoading && !isLoadingMore && !roomError && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No rooms available
        </div>
      )}
    </div>
  );
};

export default RoomOptions;
