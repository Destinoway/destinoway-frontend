"use client";

import { COUPONS, findCoupon, inr } from "@/modules/bus/data/busResultsData";
import Image from "next/image";
import { useState } from "react";

const IMG = "/images/bus/booking";
const card = "rounded-xl bg-white p-5 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.2)] sm:p-6";

export function PriceDetails({ fare, seatCount, price, estimatedTotal }) {
  const isEstimate = estimatedTotal != null;
  const row = "flex items-center justify-between text-sm leading-5";
  return (
    <section className={card} aria-labelledby="price-details">
      <div className="flex items-center justify-between pb-2">
        <h2 id="price-details" className="text-xl leading-6 font-semibold text-[#0b1c30]">
          Price Details
        </h2>
        <span className="rounded-full bg-[#e5eeff] px-2 py-0.5 text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">
          {seatCount} {seatCount === 1 ? "Passenger" : "Passengers"}
        </span>
      </div>
      <div className="flex flex-col gap-[7.5px] pt-2 pb-6">
        {isEstimate ? (
          <div className={row}>
            <span className="text-[#45464f]">Selected seat fares</span>
            <span className="font-medium text-[#0b1c30]">{inr(estimatedTotal)}</span>
          </div>
        ) : <>
        <div className={row}>
          <span className="text-[#45464f]">
            Base Fare ({seatCount} {seatCount === 1 ? "Seat" : "Seats"} × {inr(price)})
          </span>
          <span className="font-medium text-[#0b1c30]">{inr(fare.base)}</span>
        </div>
        <div className={row}>
          <span className="text-[#45464f]">Applicable GST &amp; Surcharges (5%)</span>
          <span className="font-medium text-[#0b1c30]">{inr(fare.gst)}</span>
        </div>
        {fare.coupon && (
          <div className={`${row} text-[#ba611e]`}>
            <span className="flex items-center gap-1 font-medium">
              <Image src={`${IMG}/tag.svg`} alt="" width={13.32} height={13.33} />
              Coupon Discount ({fare.coupon.code})
            </span>
            <span className="font-bold">- {inr(fare.discount)}</span>
          </div>
        )}
        </>}
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-[#eff4ff] p-4">
        <div className="flex items-start justify-between pt-1.5">
          <div className="flex flex-col gap-1">
            <span className="text-base leading-[22px] font-bold text-[#0b1c30]">{isEstimate ? "Estimated Total" : "Total Amount"}</span>
            <span className="text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">
              {isEstimate ? "Final fare shown before payment" : "Taxes & levies included"}
            </span>
          </div>
          <span className="text-xl leading-8 font-bold tracking-[-0.24px] text-[#0b1c30]">{inr(isEstimate ? estimatedTotal : fare.total)}</span>
        </div>
        {!isEstimate && fare.discount > 0 && (
          <p className="flex min-h-[46px] items-center gap-1 rounded bg-[#ffdcbd] px-2 py-1 text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#0b1c30]">
            <Image src={`${IMG}/piggy.svg`} alt="" width={13.33} height={12.67} />
            <span>
              Awesome! You are saving <strong>{inr(fare.discount)}</strong> on this booking.
            </span>
          </p>
        )}
      </div>
    </section>
  );
}

export function PromoCard({ fare, couponCode, setCouponCode, onFeedback }) {
  const [input, setInput] = useState("");
  const others = COUPONS.filter((c) => c.code !== fare.coupon?.code);

  const apply = (code) => {
    const c = findCoupon(code);
    if (!c) {
      onFeedback("error", "That coupon code isn't valid.");
      return;
    }
    if (c.minFare && fare.base < c.minFare) {
      onFeedback("warning", `${c.code} needs a base fare of at least ${inr(c.minFare)}.`);
      return;
    }
    setCouponCode(c.code);
    setInput("");
    onFeedback("success", `${c.code} applied`);
  };

  return (
    <section className={card} aria-labelledby="promo-title">
      <div className="flex items-center justify-between pb-2">
        <h2 id="promo-title" className="text-xl leading-[22px] font-semibold text-[#0b1c30]">
          Offers &amp; Promo Code
        </h2>
        <Image src={`${IMG}/ticket.svg`} alt="" width={15} height={12} />
      </div>

      {fare.coupon && (
        <div className="flex flex-col gap-1.5 rounded-xl bg-[#eff4ff] p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-base leading-[22px] font-bold tracking-[0.4px] text-[#0b1c30]">
              <Image src={`${IMG}/applied.svg`} alt="" width={16.67} height={16.67} />
              {fare.coupon.code}
            </span>
            <button
              type="button"
              onClick={() => setCouponCode(null)}
              className="cursor-pointer text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#dc2626]"
            >
              Remove
            </button>
          </div>
          <p className="text-xs leading-4 text-[#45464f]">
            Congratulations! {fare.coupon.title} applied. You saved <strong>{inr(fare.discount)}</strong>.
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) apply(input);
        }}
        className="flex items-center gap-1 pt-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="ENTER COUPON CODE"
          aria-label="Coupon code"
          className="h-8 min-w-0 flex-1 rounded-lg bg-[#eff4ff] px-4 text-xs text-[#0b1c30] uppercase outline-none placeholder:text-[#999] focus:ring-1 focus:ring-[#05144b]"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-[#ba611e] px-4 py-2 text-xs leading-4 font-semibold tracking-[0.24px] text-white hover:bg-[#a35419]"
        >
          Apply
        </button>
      </form>

      {others.length > 0 && (
        <div className="flex flex-col gap-2 pt-5">
          <p className="text-[11px] leading-[14px] font-medium tracking-[0.55px] text-[#45464f] uppercase">More available offers</p>
          {others.map((c) => {
            const save = Math.min(c.calc(fare.base), fare.base);
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => apply(c.code)}
                className="flex w-full cursor-pointer items-start gap-2 rounded-lg bg-[#eff4ff] p-2 text-left hover:ring-1 hover:ring-[#05144b]/30"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-black" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs leading-4 font-bold tracking-[0.24px] text-[#0b1c30]">{c.code}</span>
                    <span className="text-[11px] leading-[14px] font-bold tracking-[0.33px] text-[#ba611e]">Save {inr(save)}</span>
                  </span>
                  <span className="truncate text-xs leading-4 text-[#45464f]">{c.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
