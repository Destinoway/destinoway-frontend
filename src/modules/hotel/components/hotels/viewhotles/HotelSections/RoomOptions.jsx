"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HotelDataFieldTree from "../HotelDataFieldTree";

const RoomOptions = ({
  ratePlans = [],
  supplierData = {},
  hotelDetailId = "",
}) => {
  const router = useRouter();

  const { requireAuth } = useAuthGuard();

  const galleryImages = Array.isArray(supplierData?.HotelGallery)
    ? supplierData.HotelGallery.map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.url || item?.image || item?.ImageURL || item?.src || "";
      }).filter(Boolean)
    : [];

  const getHDImage = (url) => {
    if (!url) {
      return "/no-room.jpg";
    }

    return url.replace("_b.", "_z.");
  };

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getList = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const handleSelectRoom = ({ plan }) => {
    const roomId = plan?.roomId || "";

    if (!hotelDetailId || !roomId) {
      console.error("Hotel detail id or room id not found", {
        hotelDetailId,
        roomId,
        plan,
      });
      return;
    }

    router.push(
      `/hotel-booking?hotelDetailId=${encodeURIComponent(
        hotelDetailId,
      )}&roomId=${encodeURIComponent(roomId)}`,
    );
  };

  return (
    <div className="space-y-4">
      {supplierData?.RoomResponseFields?.status && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <h2 className="!m-0 text-lg font-bold text-gray-900">
            Available room options
          </h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium capitalize text-emerald-700">
            {supplierData.RoomResponseFields.status}
          </span>
        </div>
      )}
      {ratePlans.map((plan, index) => {
        const pricing = plan?.pricing || {};
        const payment = plan?.payment || {};
        const cancellationPolicy = plan?.cancellationPolicy || null;

        const basicAmount = Number(pricing?.basicAmount || 0);

        const tax = Number(pricing?.tax || 0);

        const serviceFee = Number(pricing?.serviceFee || 0);

        const markup = Number(pricing?.markup || 0);

        const gst = Number(pricing?.gst || 0);

        const totalAmount = Number(pricing?.totalAmount || 0);

        const currency = pricing?.currency || "INR";

        const currencySymbol =
          currency === "INR" || currency === "₹" ? "₹" : currency;

        const inclusionList = getList(plan?.inclusion);

        const additionalInfoList = getList(plan?.additionalInfo);

        const roomImages = Array.isArray(plan?.images)
          ? plan.images
              .map((item) => {
                if (typeof item === "string") {
                  return item;
                }

                return (
                  item?.url || item?.image || item?.ImageURL || item?.src || ""
                );
              })
              .filter(Boolean)
          : [];

        const roomImage =
          roomImages[0] ||
          galleryImages[index % galleryImages.length] ||
          supplierData?.HotelImage ||
          "";

        const hasPaymentRequirement =
          payment?.creditCardRequired === true ||
          payment?.panMandatory === true;

        const hasCancellationPolicy = Boolean(cancellationPolicy);

        return (
          <div
            key={plan?.ratePlanId || plan?.roomTypeId || `room-${index}`}
            className="mt-6 overflow-hidden rounded border border-gray-200 bg-white text-[#0f172a]! shadow-sm"
          >
            <div className="grid items-stretch gap-5 p-5 lg:grid-cols-[280px_1fr_300px]">
              <div className="relative h-[240px] overflow-hidden rounded bg-gray-100 lg:h-full lg:min-h-[260px]">
                <Image
                  src={getHDImage(roomImage)}
                  alt={plan?.roomType || "Hotel room"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                {hasCancellationPolicy && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-roboto rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Cancellation Available
                    </span>
                  </div>
                )}

                {!hasCancellationPolicy && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-roboto rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      Cancellation Policy Unavailable
                    </span>
                  </div>
                )}

                {payment?.creditCardRequired === true && (
                  <span className="font-roboto mt-2 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    Credit Card Required
                  </span>
                )}

                {payment?.panMandatory === true && (
                  <span className="font-roboto mt-2 ml-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    PAN Required
                  </span>
                )}

                <h3 className="font-roboto mt-3! mb-1! text-2xl font-bold text-[#0f172a]">
                  {plan?.roomType || "Room Not Available"}
                </h3>

                {!!additionalInfoList.length && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-bold tracking-wide text-gray-400 uppercase">
                      Additional Information
                    </p>

                    <div className="space-y-1">
                      {additionalInfoList.map((item, itemIndex) => (
                        <p
                          key={itemIndex}
                          className="font-roboto text-sm leading-6 text-gray-500"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {!!inclusionList.length && (
                  <div className="my-4">
                    <p className="mb-2 text-xs font-bold tracking-wide text-gray-400 uppercase">
                      Included
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {inclusionList.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="font-roboto rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasPaymentRequirement && (
                  <div className="mt-4 rounded bg-[#f8fafc] p-3">
                    <p className="mb-2 text-xs font-bold tracking-wide text-gray-400 uppercase">
                      Payment Information
                    </p>

                    <div className="space-y-1 text-sm text-gray-600">
                      {payment?.creditCardRequired === true && (
                        <p>Credit card required</p>
                      )}

                      {payment?.panMandatory === true && (
                        <p>PAN required for booking</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex h-full flex-col rounded border border-gray-100 bg-[#fafafa] p-4">
                <p className="mb-4 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  Price Breakdown
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Basic Price</span>

                    <span className="font-medium text-gray-700">
                      {currencySymbol} {formatPrice(basicAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Tax</span>

                    <span className="font-medium text-gray-700">
                      {currencySymbol} {formatPrice(tax)}
                    </span>
                  </div>

                  {serviceFee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Service Fee</span>

                      <span className="font-medium text-gray-700">
                        {currencySymbol} {formatPrice(serviceFee)}
                      </span>
                    </div>
                  )}

                  {markup > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Markup</span>

                      <span className="font-medium text-gray-700">
                        {currencySymbol} {formatPrice(markup)}
                      </span>
                    </div>
                  )}

                  {gst > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">GST</span>

                      <span className="font-medium text-gray-700">
                        {currencySymbol} {formatPrice(gst)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-dashed pt-3">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[11px] tracking-wide text-gray-400 uppercase">
                          Total Price
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Taxes included
                        </p>
                      </div>

                      <span className="text-base leading-none font-bold text-[#0f172a] sm:text-lg lg:text-2xl">
                        {currencySymbol} {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  onClick={() =>
                    requireAuth(() =>
                      handleSelectRoom({
                        plan,
                      }),
                    )
                  }
                  className="buttion-background-color !mt-5 !h-[48px] w-full rounded! text-sm font-semibold tracking-wide text-white!"
                >
                  Select Room
                </Button>
              </div>
            </div>

            {hasCancellationPolicy && (
              <div className="mx-5 mt-2 mb-5 rounded border border-[#fde7cf] bg-[#fffaf5] p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-[#ea580c]" />

                  <p className="mb-0! font-semibold text-[#9a3412]">
                    Cancellation Policy
                  </p>
                </div>

                <div className="mt-3 text-sm leading-6 text-[#7c2d12]">
                  {typeof cancellationPolicy === "string" ? (
                    <p>{cancellationPolicy}</p>
                  ) : (
                    <p>Cancellation policy available for this room.</p>
                  )}
                </div>
              </div>
            )}

            {plan?.rawRecommendation && (
              <details className="mx-5 mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[var(--theme-primary)] marker:hidden">
                  View all room and rate details
                </summary>
                <div className="border-t border-gray-100 bg-gray-50/70 p-3 sm:p-4">
                  <HotelDataFieldTree data={plan.rawRecommendation} />
                </div>
              </details>
            )}
          </div>
        );
      })}

      {!ratePlans.length && (
        <div className="rounded border border-dashed p-8 text-center text-gray-500">
          No rooms available
        </div>
      )}
    </div>
  );
};

export default RoomOptions;
