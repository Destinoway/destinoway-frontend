"use client";

import {
  BadgeIndianRupee,
  CalendarDays,
  Check,
  Copy,
  TicketPercent,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function GiftCard({ card }) {
  const [copied, setCopied] = useState(false);

  const startDate = new Date(card.validity?.startDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const endDate = new Date(card.validity?.endDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(card.code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const discountLabel =
    card.discountType === "flat"
      ? `Flat ₹${card.discountValue} OFF`
      : `Up to ${card.discountValue}% OFF`;

  return (
    <div className="group overflow-hidden rounded border border-[#E5EEF5] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
      {/* Image */}
      <div className="relative h-42.5 overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Bottom Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />

        {/* Discount Badge */}
        <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 shadow-md backdrop-blur">
          <span className="font-roboto text-[13px] font-bold most-text-color">
            {card.discountType === "flat"
              ? `₹${card.discountValue} OFF`
              : `${card.discountValue}% OFF`}
          </span>
        </div>

        {/* Title */}
        <div className="absolute right-4 bottom-4 left-4 z-10">
          <h3 className="font-roboto text-lg font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {card.title}
          </h3>
        </div>
      </div>
      <div className="space-y-2 p-2">
        {/* Coupon */}
        <div className="flex items-center justify-between rounded-xl border border-dashed most-boder-colour  px-4 py-3">
          <span className="font-roboto text-[13px] text-gray-500">
            Coupon Code
          </span>

          <span className="font-roboto text-[15px] font-bold tracking-wider most-text-color">
            {card.code}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 rounded bg-[#FAFCFE] p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#E8F8FC] p-2">
                <BadgeIndianRupee size={18} className="text-[#0097B2]" />
              </div>

              <span className="font-roboto text-gray-600">Minimum Booking</span>
            </div>

            <span className="font-semibold text-[#111827]">
              ₹{card.minAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#E8F8FC] p-2">
                <CalendarDays size={18} className="text-[#0097B2]" />
              </div>

              <span className="font-roboto text-gray-600">Validity</span>
            </div>

            <div className="text-right">
              <p className="mb-0! text-[13px] font-semibold text-[#111827]">
                {startDate} - {endDate}
              </p>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#E8F8FC] p-2">
                <TicketPercent size={18} className="text-[#0097B2]" />
              </div>

              <span className="font-roboto text-gray-600">Applicable On</span>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              {card.applicableModules?.map((module) => (
                <span
                  key={module}
                  className="rounded-full bg-[#EAF8FC] px-3 py-1 text-xs font-semibold text-[#00748A] capitalize"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={card.comingSoon}
          className={`font-roboto h-12 w-full rounded-xl text-[15px] font-medium text-white! transition-all duration-300 ${card.comingSoon
            ? "cursor-not-allowed bg-gray-400"
            : "buttion-background-color hover:shadow-lg hover:brightness-110"
            }`}
        >
          {card.comingSoon ? "Coming Soon" : "Claim Offer →"}
        </button>
      </div>
    </div>
  );
}
