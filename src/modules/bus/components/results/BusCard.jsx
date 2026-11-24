"use client";

import { AMENITIES, RESULTS_IMG, toDuration } from "@/modules/bus/data/busResultsData";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// Seat map is only needed once a card is opened.
const SeatSelector = dynamic(() => import("./SeatSelector"), {
  loading: () => <div className="h-[420px] animate-pulse border-t border-[rgba(198,197,209,0.3)] bg-[#eff4ff]" />,
});

function StripButton({ icon, iconSize, label, open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex cursor-pointer items-center gap-1 text-xs leading-[14px] font-bold whitespace-nowrap text-[#45464f] hover:text-[#05144b] sm:text-sm"
    >
      <Image src={icon} alt="" width={iconSize[0]} height={iconSize[1]} />
      {label}
      <Image src={`${RESULTS_IMG}/c-chevron.svg`} alt="" width={5.55} height={9} className={`transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
    </button>
  );
}

export default function BusCard({ bus, query, expanded, onToggle }) {
  const [info, setInfo] = useState(null); // "policy" | "amenities" | null

  return (
    <article className="overflow-hidden rounded-md border border-[rgba(198,197,209,0.3)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-1 gap-4 px-4 pt-[14px] pb-4 sm:px-6 md:grid-cols-12 md:pb-6">
        <div className="flex flex-col justify-center gap-1.5 md:col-span-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 rounded bg-[#006d04] px-1.5 py-0.5 text-[11px] leading-5 font-bold text-white">
              {bus.rating.toFixed(1)}
              <Image src={`${RESULTS_IMG}/c-star.svg`} alt="" width={10} height={9.5} />
            </span>
            <span className="text-[11px] leading-5 text-[#45464f]">({bus.reviews.toLocaleString("en-IN")} reviews)</span>
          </div>
          <h2 className="text-lg leading-[22.5px] font-extrabold text-[#0b1c30]">{bus.operator}</h2>
          <p className="text-xs leading-4 text-[#45464f]">{bus.coach}</p>
        </div>

        <div className="flex items-center justify-between gap-2 md:col-span-5 md:px-2">
          <div className="flex flex-col">
            <span className="text-lg leading-6 font-extrabold text-[#0b1c30]">{bus.depTime}</span>
            <span className="max-w-[120px] truncate text-xs leading-4 font-semibold text-[#0b1c30]">{bus.boardingPoint}</span>
            <span className="text-[11px] leading-5 text-[#45464f]">{bus.depDate}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center px-2">
            <span className="pb-1 text-[10px] leading-[14px] font-medium text-[#45464f]">{toDuration(bus.duration)}</span>
            <div className="flex w-full items-center gap-1">
              <span className="size-2.5 shrink-0 rounded-full bg-[#05144b] shadow-[0_0_0_2px_rgba(5,20,75,0.2)]" />
              <span className="h-0.5 flex-1 bg-gradient-to-r from-[#05144b] via-[#e58a00] to-[#005952]" />
              <span className="size-2.5 shrink-0 rounded-full bg-[#e58a00]" />
            </div>
            <span className="truncate pt-1 text-[10px] leading-5 font-bold text-[#ba611e]">{bus.routeNote}</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-lg leading-6 font-extrabold text-[#0b1c30]">{bus.arrTime}</span>
            <span className="max-w-[120px] truncate text-xs leading-4 font-semibold text-[#0b1c30]">{bus.dropPoint}</span>
            <span className="text-[11px] leading-5 text-[#45464f]">{bus.arrDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2.5 md:col-span-3 md:flex-col md:items-end md:justify-center">
          <div className="flex flex-col md:items-end">
            <span className="text-xs leading-4 text-[#45464f] line-through">₹{bus.originalPrice}</span>
            <span className="text-[22px] leading-7 font-extrabold text-[#05144b]">₹{bus.price}</span>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-6 py-2.5 text-sm leading-5 font-bold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-colors ${
              expanded ? "bg-[#05144b] hover:bg-[#0c2fb1]" : "bg-[#e58a00] hover:bg-[#c97c00]"
            }`}
          >
            {expanded ? "Hide Seat" : "Select Seats"}
            <Image
              src={`${RESULTS_IMG}/c-chevron-down-white.svg`}
              alt=""
              width={9}
              height={5.55}
              className={expanded ? "rotate-180" : ""}
            />
          </button>
        </div>
      </div>

      {!expanded && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(198,197,209,0.2)] bg-[#eff4ff] px-4 pt-[9px] pb-2 sm:px-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <StripButton
                icon={`${RESULTS_IMG}/c-policy.svg`}
                iconSize={[11, 12]}
                label="Cancellation Policy"
                open={info === "policy"}
                onClick={() => setInfo(info === "policy" ? null : "policy")}
              />
              <StripButton
                icon={`${RESULTS_IMG}/c-amenities.svg`}
                iconSize={[18, 18]}
                label="Amenities"
                open={info === "amenities"}
                onClick={() => setInfo(info === "amenities" ? null : "amenities")}
              />
              <span className="flex items-center gap-1 text-xs leading-[14px] font-bold text-[#45464f] sm:text-sm">
                <Image src={`${RESULTS_IMG}/c-seat.svg`} alt="" width={18} height={18} />
                {bus.seatsLeft} Seats Left
              </span>
            </div>
            {bus.cashback > 0 && (
              <span className="flex items-center gap-1 text-[10px] leading-[14px] font-bold text-[#c47500]">
                <Image src={`${RESULTS_IMG}/c-rupee.svg`} alt="" width={7} height={10.5} />
                Extra ₹{bus.cashback} Wallet Cashback applied
              </span>
            )}
          </div>

          {info === "policy" && (
            <div className="border-t border-[rgba(198,197,209,0.2)] px-4 py-3 text-xs leading-5 text-[#45464f] sm:px-6">
              {bus.freeCancellation ? (
                <p>
                  <strong className="text-[#006d04]">Free cancellation</strong> up to 6 hours before departure. 50% refund
                  between 6 and 2 hours before departure; no refund after that.
                </p>
              ) : (
                <p>75% refund up to 12 hours before departure, 50% up to 4 hours before. No refund after that.</p>
              )}
            </div>
          )}
          {info === "amenities" && (
            <ul className="flex flex-wrap gap-2 border-t border-[rgba(198,197,209,0.2)] px-4 py-3 sm:px-6">
              {AMENITIES.filter((a) => bus.amenities.includes(a.key)).map((a) => (
                <li
                  key={a.key}
                  className="flex items-center gap-1.5 rounded border border-[rgba(198,197,209,0.2)] bg-[#f8f9ff] px-2 py-1 text-[11px] font-bold text-[#0b1c30]"
                >
                  <Image src={a.icon} alt="" width={a.size[0]} height={a.size[1]} />
                  {a.label}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {expanded && <SeatSelector bus={bus} query={query} />}
    </article>
  );
}
