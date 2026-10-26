"use client";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
  const couponDiscount =
    bookingData?.couponDiscount ?? details?.couponDiscount;
  const discountPercent =
    bookingData?.couponDiscountPercent ?? details?.couponDiscountPercent;

  const renderPrice = (value) =>
    value !== null && value !== undefined && value !== ""
      ? `${currencySymbol} ${formatPrice(value)}`
      : "—";

  return (
    <Card
      className="!mb-3 rounded-xl border-0 shadow-[0_4px_6px_rgba(0,0,0,0.12)]"
      styles={{ body: { padding: 16 } }}
    >
      <div className="flex items-center justify-between gap-3">
        <Title level={5} className="!m-0 !font-['Roboto'] !font-semibold">
          Price Breakup
        </Title>
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="flex shrink-0 items-center gap-2 border-0 bg-transparent p-0 text-xs font-semibold text-[#1677ff]!  sm:text-sm cursor-pointer"
        >
          {isExpanded ? "Hide Price Breakup" : "Show Price Breakup"}
          {isExpanded ? (
            <UpOutlined aria-hidden="true" />
          ) : (
            <DownOutlined aria-hidden="true" />
          )}
        </button>
      </div>

      {!isExpanded && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-semibold text-gray-700">Total Price</span>
          <span className="text-lg font-bold text-gray-900">
            {renderPrice(totalPrice)}
          </span>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-600">Base Price</span>
            <span className="text-right font-medium text-gray-900">
              {renderPrice(basePrice)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-600">Platform &amp; Service Tax</span>
            <span className="text-right font-medium text-gray-900">
              {renderPrice(platformTax)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 font-semibold">
            <span className="text-gray-800">Total Price</span>
            <span className="text-right text-gray-900">
              {renderPrice(totalPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Price Before Coupon</span>
            <span className="text-right text-gray-500 line-through">
              {renderPrice(beforeCoupon)}
            </span>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between gap-3 text-emerald-700">
              <span className="min-w-0 truncate">
                Coupon{appliedCouponTitle ? `: ${appliedCouponTitle}` : ""}
                <span className="ml-1 font-semibold">({appliedCoupon})</span>
              </span>
              <span className="shrink-0 text-right font-medium">
                {renderPrice(couponDiscount)}
                {Number(couponDiscount) > 0 ? " off" : ""}
              </span>
            </div>
          )}

          {discountPercent !== null &&
            discountPercent !== undefined &&
            discountPercent !== "" && (
              <div className="flex items-center justify-between gap-3 text-emerald-700">
                <span>Coupon Discount</span>
                <span className="font-medium">
                  -{formatPrice(discountPercent)}%
                </span>
              </div>
            )}
        </div>
      )}
    </Card>
  );
}
