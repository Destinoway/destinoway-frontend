"use client";

import { LockOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Final checkout card: agreement + payable amount + the CTA passed as children.
export default function BookingAgreement({
  checked,
  onChange,
  bookingData,
  children,
}) {
  const pricing =
    bookingData?.rooms?.[0]?.pricing || bookingData?.pricing || {};
  const details = pricing?.priceDetails || pricing;
  const currency = details?.currency || pricing?.currency || "INR";
  const currencySymbol =
    currency === "INR" || currency === "₹" ? "₹" : currency;
  const totalPrice = details?.totalPrice;
  const hasTotal =
    totalPrice !== null && totalPrice !== undefined && totalPrice !== "";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="px-4 py-4 sm:px-6">
        <Checkbox
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="agreement-checkbox"
        >
          <span className="text-[13px] leading-6 text-gray-600 sm:text-[14px]">
            I agree to Destinoway&apos;s terms, cancellation policy and booking
            conditions.
          </span>
        </Checkbox>
      </div>

      {children && (
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center justify-between gap-3 sm:block">
            {hasTotal && (
              <>
                <p className="m-0 text-[12px] font-semibold text-gray-500">
                  Total payable
                </p>
                <p className="m-0 text-[20px] leading-tight font-bold text-(--theme-text-primary) sm:text-[22px]">
                  {currencySymbol} {formatPrice(totalPrice)}
                </p>
              </>
            )}
            <p className="m-0 mt-0.5 hidden items-center gap-1.5 text-[11px] text-gray-500 sm:flex">
              <LockOutlined /> Inclusive of all taxes & fees
            </p>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
