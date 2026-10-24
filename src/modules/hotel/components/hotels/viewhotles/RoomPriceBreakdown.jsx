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

export default function RoomPriceBreakdown({ pricing = {} }) {
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

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        {beforeCouponPrice !== null && (
          <span className="whitespace-nowrap text-sm text-slate-500 line-through">
            {currencySymbol} {formatAmount(beforeCouponPrice)}
          </span>
        )}
        {discountPercent !== null && (
          <span className="whitespace-nowrap text-xs font-semibold text-red-600">
            -{formatAmount(discountPercent)}%
          </span>
        )}
      </div>

      {basePrice !== null && (
        <p className="m-0 mt-1 whitespace-nowrap text-right text-2xl leading-tight font-bold text-red-600">
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
