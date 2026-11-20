"use client";

import { updateHotelItineraryCoupon } from "@/modules/hotel/services/hotelItineraryCoupon.service";
import { CheckOutlined, DownOutlined, TagOutlined } from "@ant-design/icons";
import { App } from "antd";
import { useState } from "react";

const VISIBLE_COUNT = 3;

const CouponsBankOffers = ({ bookingData = {}, onCouponUpdate }) => {
  const { message } = App.useApp();
  const [couponCode, setCouponCode] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const availableCoupons = Array.isArray(bookingData?.availableCoupons)
    ? bookingData.availableCoupons
    : [];
  const pricing =
    bookingData?.rooms?.[0]?.pricing || bookingData?.pricing || {};
  const priceDetails = pricing?.priceDetails || pricing;
  const appliedCoupon =
    bookingData?.appliedCoupon ?? priceDetails?.appliedCouponCode ?? "";
  const couponDiscount = Number(
    bookingData?.couponDiscount ?? priceDetails?.couponDiscount ?? 0,
  );
  const totalSaved = Number.isFinite(couponDiscount) ? couponDiscount : 0;
  const currency = bookingData?.currency || priceDetails?.currency || "INR";
  const currencySymbol =
    currency === "INR" || currency === "₹" ? "₹" : currency;
  const visibleCoupons = showMore
    ? availableCoupons
    : availableCoupons.slice(0, VISIBLE_COUNT);

  const appliedCouponDetails = availableCoupons.find(
    (coupon) => coupon?.code === appliedCoupon,
  );

  const handleCouponUpdate = async (code) => {
    const normalizedCode =
      typeof code === "string" ? code.trim().toUpperCase() : null;

    if (typeof code === "string" && !normalizedCode) return;

    setIsUpdating(true);
    try {
      await updateHotelItineraryCoupon({
        itineraryId: bookingData?.itineraryId,
        couponCode: normalizedCode,
      });
    } catch (error) {
      message.error(error?.message || "Unable to update the coupon.");
      setIsUpdating(false);
      return;
    }

    setCouponCode("");
    try {
      // Coupon changes the price, so re-fetch itinerary pricing.
      await onCouponUpdate?.();
      message.success(
        normalizedCode ? "Coupon applied successfully" : "Coupon removed",
      );
    } catch (error) {
      message.error(
        error?.message ||
          "Coupon updated, but the latest price could not be loaded.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getDiscountLabel = (coupon) => {
    if (coupon?.discountType === "percent") {
      return `UP TO ${coupon?.discountValue ?? coupon?.discount}% OFF`;
    }

    return `SAVE ${currencySymbol}${formatAmount(coupon?.discount)}`;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary)">
            <TagOutlined />
          </span>
          <div className="min-w-0">
            <h2 className="m-0 text-[17px] leading-snug font-bold text-(--theme-text-primary)">
              Coupons & Offers
            </h2>
            <p className="m-0 mt-0.5 text-[12px] text-gray-500">
              Save extra on your hotel stay
            </p>
          </div>
        </div>
        {availableCoupons.length > 0 && (
          <span className="shrink-0 rounded-full bg-(--theme-secondary)/8 px-2.5 py-1 text-[11px] font-bold text-(--theme-secondary)">
            {availableCoupons.length}{" "}
            {availableCoupons.length === 1 ? "offer" : "offers"}
          </span>
        )}
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5">
        {/* MANUAL CODE */}

        <div className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-slate-50 pr-1.5 pl-3 transition focus-within:border-(--theme-secondary) focus-within:bg-white">
          <TagOutlined className="text-[16px] text-gray-400" />
          <input
            type="text"
            value={couponCode}
            onChange={(event) =>
              setCouponCode(event.target.value.toUpperCase())
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCouponUpdate(couponCode);
              }
            }}
            placeholder="Enter coupon code"
            aria-label="Coupon code"
            className="h-full w-full min-w-0 border-none bg-transparent p-0 text-[14px] font-semibold tracking-wide text-gray-900 uppercase outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 placeholder:normal-case"
          />
          <button
            type="button"
            onClick={() => handleCouponUpdate(couponCode)}
            disabled={!couponCode.trim() || isUpdating}
            className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-(--theme-secondary)! px-4 text-[12px] font-bold text-white! transition hover:bg-(--theme-hover)! disabled:cursor-not-allowed disabled:opacity-50"
          >
            APPLY
          </button>
        </div>

        {/* APPLIED */}

        {appliedCoupon && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <CheckOutlined className="text-[13px]" />
              </span>
              <div className="min-w-0">
                <p className="m-0 text-[13px] font-bold break-all text-emerald-800">
                  {appliedCoupon} applied
                </p>
                <p className="m-0 text-[12px] text-emerald-700">
                  {totalSaved > 0
                    ? `You saved ${currencySymbol} ${formatAmount(totalSaved)}`
                    : appliedCouponDetails?.title || "Coupon applied"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCouponUpdate(null)}
              disabled={isUpdating}
              className="shrink-0 cursor-pointer border-none bg-transparent p-0 text-[12px] font-bold text-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}

        {/* LIST */}

        <div>
          <p className="m-0 text-[11px] font-bold tracking-[0.08em] text-gray-400 uppercase">
            Available offers
          </p>

          {availableCoupons.length ? (
            <div className="mt-3 space-y-2.5">
              {visibleCoupons.map((coupon) => {
                const isApplied = coupon?.code === appliedCoupon;

                return (
                  <div
                    key={coupon.code}
                    className={`relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 transition ${
                      isApplied
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-gray-200 bg-white hover:border-(--theme-secondary)/40"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-1 ${isApplied ? "bg-emerald-500" : "bg-(--theme-secondary)"}`}
                    />

                    <div className="min-w-0 flex-1 pl-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md border border-dashed border-gray-300 bg-slate-50 px-2 py-0.5 text-[12px] font-bold tracking-wide text-gray-800">
                          {coupon?.code}
                        </span>
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          {getDiscountLabel(coupon)}
                        </span>
                      </div>
                      <p className="m-0 mt-1.5 line-clamp-2 text-[12px] leading-4.25 text-gray-600">
                        {coupon?.title || coupon?.code}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCouponUpdate(coupon?.code)}
                      disabled={isUpdating || isApplied}
                      className={`inline-flex h-8 min-w-18 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 text-[11px] font-bold transition disabled:cursor-not-allowed ${
                        isApplied
                          ? "border-emerald-500 bg-emerald-500! text-white!"
                          : "border-(--theme-secondary) bg-white! text-(--theme-secondary)! hover:bg-(--theme-secondary)! hover:text-white! disabled:opacity-50"
                      }`}
                    >
                      {isApplied ? "APPLIED" : "APPLY"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="m-0 mt-3 rounded-xl bg-slate-50 p-3 text-[13px] text-gray-500">
              No coupons are available for this stay.
            </p>
          )}
        </div>

        {availableCoupons.length > VISIBLE_COUNT && (
          <button
            type="button"
            onClick={() => setShowMore((value) => !value)}
            className="mx-auto flex cursor-pointer items-center justify-center gap-1.5 border-none bg-transparent p-0 text-[13px] font-semibold text-(--theme-secondary)"
          >
            {showMore
              ? "Show fewer coupons"
              : `See ${availableCoupons.length - VISIBLE_COUNT} more coupons`}
            <DownOutlined
              className={`text-[10px] transition-transform ${showMore ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default CouponsBankOffers;
