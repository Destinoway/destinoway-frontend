import { TagsFilled } from "@ant-design/icons";

const getNumber = (...values) => {
  const value = values.find(
    (item) => item !== null && item !== undefined && item !== "",
  );

  if (value === undefined) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const formatAmount = (value) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function RoomPriceBreakdown({
  pricing = {},
  variant = "stacked",
}) {
  const price = pricing?.priceDetails || pricing || {};
  const currency = pricing?.currency || price?.currency || "INR";
  const currencySymbol =
    currency === "INR" || currency === "₹" ? "₹" : currency;
  const basePrice = getNumber(
    price?.basePrice,
    pricing?.basicAmount,
    pricing?.baseRate,
  );
  const beforeCouponPrice = getNumber(price?.totalPriceBeforeCoupon);
  const discountPercent = getNumber(price?.couponDiscountPercent);
  const platformTax = getNumber(
    price?.["platform&servicetax"],
    price?.taxes,
    pricing?.tax,
  );
  const couponDiscount = getNumber(price?.couponDiscount);
  const couponCode = price?.appliedCouponCode;
  const couponTitle = price?.appliedCouponTitle;
  const hasCoupon = Boolean(
    couponCode ||
    couponTitle ||
    (couponDiscount !== null && couponDiscount > 0),
  );

  // Single-row layout used in the room details modal footer.
  if (variant === "inline") {
    return (
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {hasCoupon ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-emerald-800">
            <TagsFilled />
            {couponCode || couponTitle} applied
            {couponDiscount !== null && couponDiscount > 0 && (
              <span>
                · {currencySymbol} {formatAmount(couponDiscount)} off
              </span>
            )}
          </span>
        ) : (
          <span className="hidden text-[12px] text-gray-500 sm:inline">
            Price per room for your selected stay
          </span>
        )}

        <div className="ml-auto text-right leading-tight">
          {(beforeCouponPrice !== null || discountPercent !== null) && (
            <div className="flex items-center justify-end gap-2 text-xs">
              {beforeCouponPrice !== null && (
                <span className="whitespace-nowrap text-slate-400 line-through">
                  {currencySymbol} {formatAmount(beforeCouponPrice)}
                </span>
              )}
              {discountPercent !== null && (
                <span className="rounded bg-red-50 px-1.5 py-0.5 font-bold whitespace-nowrap text-red-600">
                  -{formatAmount(discountPercent)}%
                </span>
              )}
            </div>
          )}

          <div className="mt-0.5 flex flex-wrap items-baseline justify-end gap-x-1.5">
            {basePrice !== null && (
              <span className="text-xl font-bold whitespace-nowrap text-red-600 sm:text-[22px]">
                {currencySymbol} {formatAmount(basePrice)}
              </span>
            )}
            {platformTax !== null && (
              <span className="text-[11px] whitespace-nowrap text-slate-500">
                + {currencySymbol} {formatAmount(platformTax)} taxes & fees
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        {beforeCouponPrice !== null && (
          <span className="text-sm whitespace-nowrap text-slate-500 line-through">
            {currencySymbol} {formatAmount(beforeCouponPrice)}
          </span>
        )}
        {discountPercent !== null && (
          <span className="text-xs font-semibold whitespace-nowrap text-red-600">
            -{formatAmount(discountPercent)}%
          </span>
        )}
      </div>

      {basePrice !== null && (
        <p className="m-0 mt-1 text-right text-2xl leading-tight font-bold whitespace-nowrap text-red-600">
          {currencySymbol} {formatAmount(basePrice)}
        </p>
      )}

      {platformTax !== null && (
        <p className="m-0 mt-1 text-right text-xs text-slate-500">
          + {currencySymbol} {formatAmount(platformTax)} taxes & fees
        </p>
      )}

      {hasCoupon && (
        <div
          className="mt-3 flex items-center gap-1 overflow-x-auto rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-2 text-[10px] text-emerald-900"
          style={{ scrollbarWidth: "none" }}
        >
          <TagsFilled className="shrink-0" />
          <span className="shrink-0 font-semibold">
            {couponCode || couponTitle} applied
          </span>

          {couponDiscount !== null && couponDiscount > 0 && (
            <span className="shrink-0 font-semibold">
              {currencySymbol} {formatAmount(couponDiscount)} off
            </span>
          )}
          {/* {discountPercent !== null && (
            <span className="shrink-0 font-semibold">
              {formatAmount(discountPercent)}% off
            </span>
          )} */}
        </div>
      )}
    </div>
  );
}
