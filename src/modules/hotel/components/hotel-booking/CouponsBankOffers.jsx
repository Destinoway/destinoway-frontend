"use client";

import {
  CheckOutlined,
  DownOutlined,
  RightOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const CouponsBankOffers = () => {
  const [couponCode, setCouponCode] = useState("BESTDEAL");
  const [appliedCoupon, setAppliedCoupon] = useState("BESTDEAL");
  const [showMore, setShowMore] = useState(false);

  const offers = [
    {
      code: "TRAVEL10",
      badge: "10% OFF",
      badgeColor: "green",
      title: "Flat 10% OFF up to ₹1,500",
      description: "Valid on luxury & resort stays",
    },
    {
      code: "HOTELNOW",
      badge: "SAVE ₹500",
      badgeColor: "orange",
      title: "Flat ₹500 instant discount",
      description: "On pre-paid domestic hotel stays",
    },
    {
      code: "WELCOME",
      badge: "NEW USER",
      badgeColor: "blue",
      title: "Special welcome discount",
      description: "Applicable on your first 3 bookings",
    },
    {
      code: "FIRST20",
      badge: "20% OFF",
      badgeColor: "purple",
      title: "Flat 20% OFF on selected hotels",
      description: "Valid on selected premium properties",
    },
    {
      code: "STAY500",
      badge: "SAVE ₹500",
      badgeColor: "orange",
      title: "Extra ₹500 off on hotel bookings",
      description: "Applicable on selected stays",
    },
  ];

  const visibleOffers = showMore ? offers : offers.slice(0, 3);

  // ------------------------------------------------------------
  // APPLY COUPON
  // ------------------------------------------------------------

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    setAppliedCoupon(code);
  };

  // ------------------------------------------------------------
  // APPLY OFFER
  // ------------------------------------------------------------

  const handleOfferApply = (code) => {
    setCouponCode(code);
    setAppliedCoupon(code);
  };

  // ------------------------------------------------------------
  // REMOVE COUPON
  // ------------------------------------------------------------

  const handleRemove = () => {
    setAppliedCoupon("");
    setCouponCode("");
  };

  // ------------------------------------------------------------
  // BADGE CLASS
  // ------------------------------------------------------------

  const getBadgeClass = (color) => {
    switch (color) {
      case "green":
        return "bg-[#eafaf4] text-[#079b6d]";

      case "orange":
        return "bg-[#fff5e8] text-[#d97706]";

      case "blue":
        return "bg-[#edf7ff] text-[#1681c4]";

      case "purple":
        return "bg-[#f4efff] text-[#7c3aed]";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#edf0f4] bg-white px-4 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] sm:px-5 sm:py-[18px]">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">
          {/* ICON */}

          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-[#fff7ed]">
            <TagOutlined className="text-[18px] text-[#c6571d]" />
          </div>

          {/* TITLE */}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="m-0 text-[18px] leading-[22px] font-bold text-[#172033] sm:text-[20px] sm:leading-[24px]">
                Coupons & Offers
              </h2>

              <span className="rounded-full bg-[#fff4e9] px-2.5 py-[3px] text-[10px] font-bold tracking-wide text-[#c6571d]">
                5 OFFERS
              </span>
            </div>

            <p className="mt-[2px] mb-0 text-[12px] leading-4 text-[#697386] sm:text-[13px]">
              Save extra on your hotel stay
            </p>
          </div>
        </div>

        {/* VIEW ALL */}

        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="hidden shrink-0 items-center gap-1 border-none bg-transparent p-0 text-[13px] font-semibold text-[#c6571d] transition hover:text-[#a94312] sm:flex"
        >
          View All (5)
          <RightOutlined className="text-[10px]" />
        </button>
      </div>

      {/* ======================================================
          COUPON INPUT
      ====================================================== */}

      <div className="mt-4 grid h-[50px] grid-cols-[20px_minmax(0,1fr)_88px] items-center gap-2 rounded-[8px] border-2 border-dashed border-[#d1d7df] bg-white px-3">
        <TagOutlined className="text-[18px] text-[#a5afbd]" />

        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApplyCoupon();
            }
          }}
          placeholder="ENTER COUPON CODE"
          className="h-full w-full min-w-0 border-none bg-transparent p-0 text-[14px] leading-normal font-bold tracking-wide text-[#172033] outline-none placeholder:text-[#a1aab7]"
        />

        <button
          type="button"
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim()}
          className="inline-flex h-[38px] w-[88px] items-center justify-center rounded-[7px] bg-[#c6571d] px-3 text-[13px] leading-none font-bold text-white transition-all duration-200 hover:bg-[#ad4715] disabled:cursor-not-allowed disabled:opacity-60"
        >
          APPLY
        </button>
      </div>

      {/* ======================================================
          APPLIED COUPON
      ====================================================== */}

      {appliedCoupon && (
        <div className="mt-2 flex min-h-[70px] items-center justify-between gap-3 rounded-[10px] border border-[#62e6b3] bg-[#effff8] px-4 py-3 sm:px-[18px]">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">
            {/* CHECK */}

            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#079b6d]">
              <CheckOutlined className="text-[14px] font-bold text-white" />
            </div>

            {/* TEXT */}

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <p className="m-0 break-words text-[14px] leading-5 font-bold text-[#075c43]">
                  {appliedCoupon} Applied!
                </p>

                <span className="rounded-[4px] bg-[#079b6d] px-2 py-[2px] text-[9px] font-bold tracking-wide text-white">
                  APPLIED
                </span>
              </div>

              <p className="mt-[2px] mb-0 text-[12px] text-[#28745d] sm:text-[13px]">
                You saved ₹1,000 with this coupon!
              </p>
            </div>
          </div>

          {/* REMOVE */}

          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 border-none bg-transparent p-0 text-[13px] font-bold text-[#ff1744] transition-colors hover:text-[#d9002f]"
          >
            Remove
          </button>
        </div>
      )}

      {/* ======================================================
          MORE OFFERS
      ====================================================== */}

      <div className="mt-4">
        <p className="m-0 text-[12px] font-bold tracking-wide text-[#98a2b2] uppercase">
          More Offers For You
        </p>

        {/* ====================================================
            OFFER LIST
        ==================================================== */}

        <div className="mt-3 space-y-2.5">
          {visibleOffers.map((offer) => (
            <div
              key={offer.code}
              className="flex h-[68px] items-center rounded-[9px] border border-dashed border-[#ccd3dd] bg-white px-3 transition-all duration-200 hover:border-[#c6571d] hover:shadow-[0_2px_8px_rgba(15,23,42,0.05)] sm:px-3.5"
            >
              {/* ==================================================
                  LEFT CODE
              ================================================== */}

              <div className="flex h-full w-[90px] shrink-0 flex-col items-center justify-center border-r border-dashed border-[#d5dbe3] pr-2 sm:w-[105px]">
                <p className="m-0 text-[14px] font-bold tracking-wide text-[#293446]">
                  {offer.code}
                </p>

                <span
                  className={`mt-[2px] rounded-[4px] px-2 py-[2px] text-[9px] font-bold ${getBadgeClass(
                    offer.badgeColor,
                  )} `}
                >
                  {offer.badge}
                </span>
              </div>

              {/* ==================================================
                  MIDDLE CONTENT
              ================================================== */}

              <div className="min-w-0 flex-1 px-3 sm:px-3.5">
                <p className="m-0 truncate text-[13px] leading-5 font-bold text-[#293446] sm:text-[14px]">
                  {offer.title}
                </p>

                <p className="mt-0 truncate text-[11px] leading-4 text-[#687385] sm:text-[12px]">
                  {offer.description}
                </p>
              </div>

              {/* ==================================================
                  APPLY BUTTON
              ================================================== */}

              <button
                type="button"
                onClick={() => handleOfferApply(offer.code)}
                className="h-[36px] min-w-[76px] shrink-0 rounded-full border-[1.5px] border-[#c6571d] bg-white px-3 text-[12px] font-bold text-[#c6571d] transition-all duration-200 hover:bg-[#c6571d] hover:text-white"
              >
                APPLY
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================
          SEE MORE COUPONS
      ====================================================== */}

      {!showMore && offers.length > 3 && (
        <div className="mt-4 border-t border-[#edf0f4] pt-3">
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="mx-auto flex items-center justify-center gap-2 border-none bg-transparent text-[13px] font-bold text-[#172b4d] transition-colors hover:text-[#c6571d]"
          >
            See more coupons (3)
            <DownOutlined className="text-[10px] text-[#687385]" />
          </button>
        </div>
      )}

      {/* ======================================================
          MOBILE VIEW ALL
      ====================================================== */}

      {!showMore && (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="mt-2.5 flex w-full items-center justify-center gap-1 border-none bg-transparent text-[12px] font-semibold text-[#c6571d] sm:hidden"
        >
          View All (5)
          <RightOutlined className="text-[9px]" />
        </button>
      )}
    </div>
  );
};

export default CouponsBankOffers;
