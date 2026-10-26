"use client";

import { updateHotelItineraryCoupon } from "@/modules/hotel/services/hotelItineraryCoupon.service";
import {
  CheckOutlined,
  DownOutlined,
  RightOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import Image from "next/image";
import { useState } from "react";

const CouponsBankOffers = ({
  bookingData = {},
  onCouponUpdate,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const availableCoupons = Array.isArray(bookingData?.availableCoupons)
    ? bookingData.availableCoupons
    : [];
  const pricing = bookingData?.rooms?.[0]?.pricing || bookingData?.pricing || {};
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
    : availableCoupons.slice(0, 3);

  const appliedCouponDetails = availableCoupons.find(
    (coupon) => coupon?.code === appliedCoupon,
  );

  const commitCouponUpdate = (response, nextCouponCode) => {
    const undiscountedTotal =
      Number(bookingData?.totalPayable) + totalSaved ||
      Number(
      priceDetails?.totalPriceBeforeCoupon ?? priceDetails?.totalPrice ?? 0,
      );
    const selectedCoupon = availableCoupons.find(
      (coupon) => coupon?.code === nextCouponCode,
    );
    const fallbackDiscount = nextCouponCode
      ? Number(
          nextCouponCode === appliedCoupon
            ? totalSaved
            : selectedCoupon?.discount,
        ) || 0
      : 0;
    onCouponUpdate?.({
      ...(response || {}),
      availableCoupons:
        Array.isArray(response?.availableCoupons)
          ? response.availableCoupons
          : availableCoupons,
      appliedCoupon:
        response?.appliedCoupon !== undefined
          ? response.appliedCoupon || ""
          : nextCouponCode || "",
      couponDiscount:
        response?.couponDiscount !== undefined
          ? Number(response.couponDiscount) || 0
          : fallbackDiscount,
      couponDiscountPercent:
        response?.couponDiscountPercent ??
        (selectedCoupon?.discountType === "percent"
          ? selectedCoupon?.discountValue
          : null),
      totalPayable:
        response?.totalPayable !== undefined
          ? Number(response.totalPayable) || 0
          : Math.max(undiscountedTotal - fallbackDiscount, 0),
    });
  };

  const handleCouponUpdate = async (code) => {
    const normalizedCode =
      typeof code === "string" ? code.trim().toUpperCase() : null;

    if (typeof code === "string" && !normalizedCode) return;

    setIsUpdating(true);
    try {
      const response = await updateHotelItineraryCoupon({
        itineraryId: bookingData?.itineraryId,
        couponCode: normalizedCode,
      });
      commitCouponUpdate(response, normalizedCode);
      setCouponCode("");
      message.success(
        normalizedCode ? "Coupon applied successfully" : "Coupon removed",
      );
    } catch (error) {
      message.error(error?.message || "Unable to update the coupon.");
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
      return `${coupon?.discountValue ?? coupon?.discount}% OFF`;
    }

    return `SAVE ${currencySymbol}${formatAmount(coupon?.discount)}`;
  };

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#edf0f4] bg-white px-4 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] sm:px-5 sm:py-[18px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-[#fff7ed]">
            <TagOutlined className="text-[18px] text-[#c6571d]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="m-0 text-[18px] leading-[22px] font-bold text-[#172033] sm:text-[20px]">
                Coupons & Offers
              </h2>
              <span className="rounded-full bg-[#fff4e9] px-2.5 py-[3px] text-[10px] font-bold tracking-wide text-[#c6571d]">
                {availableCoupons.length} OFFERS
              </span>
            </div>
            <p className="mt-[2px] mb-0 text-[12px] text-[#697386] sm:text-[13px]">
              Save extra on your hotel stay
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid h-[50px] grid-cols-[20px_minmax(0,1fr)_88px] items-center gap-2 rounded-[8px] border-2 border-dashed border-[#d1d7df] bg-white px-3">
        <TagOutlined className="text-[18px] text-[#a5afbd]" />
        <input
          type="text"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleCouponUpdate(couponCode);
            }
          }}
          placeholder="ENTER COUPON CODE"
          aria-label="Coupon code"
          className="h-full w-full min-w-0 border-none bg-transparent p-0 text-[14px] font-bold tracking-wide text-[#172033] outline-none placeholder:text-[#a1aab7]"
        />
        <button
          type="button"
          onClick={() => handleCouponUpdate(couponCode)}
          disabled={!couponCode.trim() || isUpdating}
          className="inline-flex h-[38px] w-[88px] items-center justify-center rounded-[7px] bg-[#c6571d] px-3 text-[13px] font-bold text-white transition hover:bg-[#ad4715] disabled:cursor-not-allowed disabled:opacity-60"
        >
          APPLY
        </button>
      </div>

      {appliedCoupon && (
        <div className="mt-2 flex min-h-[70px] items-center justify-between gap-3 rounded-[10px] border border-[#62e6b3] bg-[#effff8] px-3 py-3 sm:px-[18px]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#079b6d]">
              <CheckOutlined className="text-[14px] font-bold text-white" />
            </div>
            <div className="min-w-0">
              <p className="m-0 break-all text-[14px] leading-5 font-bold text-[#075c43]">
                {appliedCoupon} Applied!
              </p>
              <p className="mt-[2px] mb-0 text-[12px] text-[#28745d] sm:text-[13px]">
                {totalSaved > 0
                  ? `You saved ${currencySymbol} ${formatAmount(totalSaved)} with this coupon.`
                  : appliedCouponDetails?.title || "Coupon applied"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCouponUpdate(null)}
            disabled={isUpdating}
            className="shrink-0 border-none bg-transparent p-0 text-[13px] font-bold text-[#ff1744] disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      <div className="mt-4">
        <p className="m-0 text-[12px] font-bold tracking-wide text-[#98a2b2] uppercase">
          Available Offers
        </p>
        {availableCoupons.length ? (
          <div className="mt-3 space-y-2.5">
            {visibleCoupons.map((coupon) => {
              const isApplied = coupon?.code === appliedCoupon;

              return (
                <div
                  key={coupon.code}
                  className="flex min-h-[68px] items-center rounded-[9px] border border-dashed border-[#ccd3dd] bg-white px-2.5 transition hover:border-[#c6571d] sm:px-3.5"
                >
                  {coupon?.image && (
                    <Image
                      src={coupon.image}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="mr-2 h-10 w-10 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="flex h-full w-[86px] shrink-0 flex-col items-center justify-center border-r border-dashed border-[#d5dbe3] pr-2">
                    <p className="m-0 break-all text-center text-[12px] font-bold tracking-wide text-[#293446] sm:text-[14px]">
                      {coupon?.code}
                    </p>
                    <span className="mt-1 rounded-[4px] bg-[#eafaf4] px-2 py-[2px] text-[9px] font-bold text-[#079b6d]">
                      {getDiscountLabel(coupon)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 px-2.5 sm:px-3.5">
                    <p className="m-0 line-clamp-2 text-[12px] leading-4 font-bold text-[#293446] sm:text-[14px]">
                      {coupon?.title || coupon?.code}
                    </p>
                    {coupon?.discount > 0 && (
                      <p className="m-0 mt-1 text-[11px] text-[#687385]">
                        Save {currencySymbol} {formatAmount(coupon.discount)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCouponUpdate(coupon?.code)}
                    disabled={isUpdating || isApplied}
                    className="h-[34px] min-w-[68px] shrink-0 rounded-full border border-[#c6571d] bg-white px-2 text-[11px] font-bold text-[#c6571d] transition hover:bg-[#c6571d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[76px] sm:px-3 sm:text-[12px]"
                  >
                    {isApplied ? "APPLIED" : "APPLY"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            No coupons are available for this stay.
          </p>
        )}
      </div>

      {!showMore && availableCoupons.length > 3 && (
        <div className="mt-4 border-t border-[#edf0f4] pt-3">
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="mx-auto flex items-center justify-center gap-2 border-none bg-transparent text-[13px] font-bold text-[#172b4d]"
          >
            See more coupons ({availableCoupons.length - 3})
            <DownOutlined className="text-[10px] text-[#687385]" />
          </button>
        </div>
      )}

      {!showMore && availableCoupons.length > 3 && (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="mt-2.5 flex w-full items-center justify-center gap-1 border-none bg-transparent text-[12px] font-semibold text-[#c6571d] sm:hidden"
        >
          View All ({availableCoupons.length})
          <RightOutlined className="text-[9px]" />
        </button>
      )}
    </div>
  );
};

export default CouponsBankOffers;
