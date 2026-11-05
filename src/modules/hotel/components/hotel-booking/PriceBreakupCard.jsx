"use client";

import { DownOutlined, GiftOutlined, WalletOutlined } from "@ant-design/icons";
import { useState } from "react";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Row = ({ label, value, className = "" }) => (
  <div className={`flex items-center justify-between gap-3 ${className}`}>
    <span className="min-w-0">{label}</span>
    <span className="shrink-0 text-right">{value}</span>
  </div>
);

export default function PriceBreakupCard({ bookingData = {} }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pricing =
    bookingData?.rooms?.[0]?.pricing || bookingData?.pricing || {};
  const details = pricing?.priceDetails || pricing;
  const currency = details?.currency || pricing?.currency || "INR";
  const currencySymbol =
    currency === "INR" || currency === "₹" ? "₹" : currency;
  const basePrice = details?.basePrice;
  const platformTax = details?.["platform&servicetax"];
  const totalPrice = details?.totalPrice;
  const beforeCoupon = details?.totalPriceBeforeCoupon;
  const appliedCoupon =
    bookingData?.appliedCoupon ?? details?.appliedCouponCode ?? "";
  const appliedCouponDetails = bookingData?.availableCoupons?.find(
    (coupon) => coupon?.code === appliedCoupon,
  );
  const appliedCouponTitle =
    appliedCouponDetails?.title || details?.appliedCouponTitle;
  const couponDiscount = bookingData?.couponDiscount ?? details?.couponDiscount;
  const discountPercent =
    bookingData?.couponDiscountPercent ?? details?.couponDiscountPercent;
  // Coupon rows are only meaningful when a discount is actually applied.
  const hasCouponDiscount = Number(couponDiscount) > 0;
  const hasDiscountPercent =
    discountPercent !== null &&
    discountPercent !== undefined &&
    discountPercent !== "";

  const renderPrice = (value) =>
    value !== null && value !== undefined && value !== ""
      ? `${currencySymbol} ${formatPrice(value)}`
      : "—";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary)">
            <WalletOutlined />
          </span>
          <div className="min-w-0">
            <h2 className="m-0 text-[17px] leading-snug font-bold text-(--theme-text-primary)">
              Price Summary
            </h2>
            <p className="m-0 mt-0.5 text-[12px] text-gray-500">
              Inclusive of all taxes & fees
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[12px] font-semibold text-(--theme-secondary)"
        >
          {isExpanded ? "Hide" : "Details"}
          <DownOutlined
            className={`text-[10px] transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 px-4 pt-4 text-[13px] text-gray-600 sm:px-5 sm:text-sm">
          <Row
            label="Base price"
            value={
              <span className="font-semibold text-gray-900">
                {renderPrice(basePrice)}
              </span>
            }
          />

          <Row
            label="Platform & service tax"
            value={
              <span className="font-semibold text-gray-900">
                {renderPrice(platformTax)}
              </span>
            }
          />

          {hasCouponDiscount && (
            <Row
              label="Price before coupon"
              value={
                <span className="text-gray-400 line-through">
                  {renderPrice(beforeCoupon)}
                </span>
              }
            />
          )}

          {hasCouponDiscount && appliedCoupon && (
            <Row
              className="text-emerald-700"
              label={
                <span className="block truncate">
                  Coupon{appliedCouponTitle ? ` · ${appliedCouponTitle}` : ""}
                  <span className="ml-1 font-bold">({appliedCoupon})</span>
                </span>
              }
              value={
                <span className="font-semibold">
                  − {renderPrice(couponDiscount)}
                  {hasDiscountPercent && (
                    <span className="ml-1 text-[11px] font-medium">
                      ({formatPrice(discountPercent)}%)
                    </span>
                  )}
                </span>
              }
            />
          )}
        </div>
      )}

      <div className="px-4 pt-4 pb-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-(--theme-secondary)/6 px-4 py-3">
          <span className="text-[14px] font-bold text-(--theme-text-primary)">
            Total amount
          </span>
          <span className="text-[20px] leading-tight font-bold text-(--theme-text-primary)">
            {renderPrice(totalPrice)}
          </span>
        </div>

        {hasCouponDiscount && (
          <p className="m-0 mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700">
            <GiftOutlined />
            You are saving {renderPrice(couponDiscount)} on this booking
          </p>
        )}
      </div>
    </div>
  );
}
