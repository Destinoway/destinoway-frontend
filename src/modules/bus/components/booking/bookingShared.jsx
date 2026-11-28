"use client";

import { AMENITIES, toDuration } from "@/modules/bus/data/busResultsData";
import dayjs from "dayjs";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

// Shared by the booking (passenger details) and payment pages.

const IMG = "/images/bus/booking";
const card = "rounded-xl bg-white p-4 sm:p-6";
const shadow = "shadow-[1px_1px_10px_rgba(0,0,0,0.2)]";

const AMENITY_PILLS = {
  wifi: { label: "High-Speed WiFi", icon: `${IMG}/wifi.svg`, size: [16, 11.33] },
  charging: { label: "USB Charging", icon: `${IMG}/charging.svg`, size: [8, 12] },
  blankets: { label: "Water Bottle", icon: `${IMG}/water.svg`, size: [12, 13.33] },
  gps: { label: "Live GPS Tracking", icon: `${IMG}/gps.svg`, size: [10.67, 13.33] },
};

const clock12 = (mins) => dayjs().startOf("day").add(mins, "minute").format("hh:mm a");

// Seat selection and booking progress are scoped to this browser tab.
export const bookingKey = (p) => `bus-booking:${p.bus}|${p.date}|${p.seats}|${p.pickup}|${p.drop}`;

export function readBookingSession(p) {
  try {
    return JSON.parse(sessionStorage.getItem(bookingKey(p)) || "null");
  } catch {
    return null;
  }
}

export function writeBookingSession(p, patch) {
  try {
    const next = { ...(readBookingSession(p) || {}), ...patch };
    sessionStorage.setItem(bookingKey(p), JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function TripSummary({ bus, seats, pickup, drop, date }) {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState(false);
  const from = date.from.split(",")[0];
  const to = date.to.split(",")[0];
  const amenities = Array.isArray(bus.amenities) ? bus.amenities : [];

  return (
    <section className={`${card} ${shadow} flex flex-col gap-4`} aria-labelledby="booking-details">
      <div className="flex items-center justify-between">
        <h2 id="booking-details" className="text-xl leading-4 font-bold text-[#05144b]">
          Booking Details
        </h2>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium tracking-[0.33px] text-[#0b1c30] sm:text-base"
        >
          PREVIEW
          <Image src={`${IMG}/chevron-small.svg`} alt="" width={8} height={4.93} className={open ? "rotate-180" : ""} />
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#07164c]">
            <Image src={`${IMG}/bus.svg`} alt="" width={16} height={19} />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="flex items-center gap-1 text-xl leading-7 font-bold tracking-[-0.5px] text-[#0b1c30]">
              {from}
              <Image src={`${IMG}/arrow-right.svg`} alt="to" width={13.33} height={13.33} />
              {to}
            </p>
            <p className="flex flex-wrap items-center gap-1 text-xs leading-4 text-[#45464f]">
              <Image src={`${IMG}/calendar.svg`} alt="" width={10.5} height={11.67} />
              {dayjs(date.date).format("dddd, DD MMM YYYY")}
              <span className="size-1 rounded-full bg-[#767680]" />
              <span className="font-medium text-[#ba611e]">{clock12(bus.depMins)}</span>
            </p>
            <p className="pt-1 text-base leading-7 font-medium text-[#727272]">{bus.operator}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] leading-[14px] font-medium tracking-[0.55px] text-[#45464f] uppercase">Assigned Seats</span>
            <span className="flex flex-wrap justify-end gap-1.5">
              {seats.map((s) => (
                <span key={s.id} className="rounded bg-[#ffdcbd] px-2 py-0.5 text-xs leading-4 font-bold tracking-[0.24px] text-[#2c1600]">
                  {s.id}
                </span>
              ))}
            </span>
          </div>
          <span className="h-8 w-px bg-[#dce9ff]" />
          <div className="flex flex-col items-end">
            <span className="text-[11px] leading-[14px] font-medium tracking-[0.55px] text-[#45464f] uppercase">Travellers</span>
            <span className="text-base leading-[22px] font-bold text-[#0b1c30]">
              {seats.length} {seats.length === 1 ? "Adult" : "Adults"}
            </span>
          </div>
        </div>
      </div>

      {open && (
        <>
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#eff4ff] p-4 md:grid-cols-12">
            <div className="flex flex-col md:col-span-4">
              <span className="text-[11px] leading-[14px] font-medium tracking-[0.55px] text-[#45464f] uppercase">Boarding</span>
              <span className="pt-0.5 text-xl leading-7 font-semibold text-[#0b1c30]">{pickup.time}</span>
              <span className="text-xs leading-4 font-semibold tracking-[0.24px] text-[#0b1c30]">{bus.depDate}</span>
              <span className="pt-1 text-xs leading-4 text-[#45464f]">
                {pickup.name}, {pickup.address}
              </span>
            </div>
            <div className="order-last col-span-2 flex flex-col items-center justify-center py-1 md:order-none md:col-span-4">
              <span className="text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">{toDuration(bus.duration)}</span>
              <span className="relative my-1.5 flex h-2.5 w-full max-w-[220px] items-center">
                <span className="absolute left-0 size-2.5 rounded-full bg-black" />
                <span className="mx-[18px] h-0.5 flex-1 bg-[#c6c5d1]" />
                <span className="absolute left-1/2 flex size-3 -translate-x-1/2 items-center justify-center rounded-full bg-[#fd9d25]">
                  <span className="size-1.5 rounded-full bg-[#673b00]" />
                </span>
                <span className="absolute right-0 size-2.5 rounded-full bg-[#fd9d25]" />
              </span>
              <span className="text-xs leading-4 font-medium text-[#8a5100]">{bus.routeNote}</span>
            </div>
            <div className="flex flex-col items-end text-right md:col-span-4">
              <span className="text-[11px] leading-[14px] font-medium tracking-[0.55px] text-[#45464f] uppercase">Dropping</span>
              <span className="pt-0.5 text-xl leading-7 font-semibold text-[#0b1c30]">{drop.time}</span>
              <span className="text-xs leading-4 font-semibold tracking-[0.24px] text-[#0b1c30]">{bus.arrDate}</span>
              <span className="pt-1 text-xs leading-4 text-[#45464f]">
                {drop.name}, {drop.address}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-1">
              {AMENITIES.filter((a) => amenities.includes(a.key) && AMENITY_PILLS[a.key]).map((a) => {
                const pill = AMENITY_PILLS[a.key];
                return (
                  <li
                    key={a.key}
                    className="flex items-center gap-1 rounded bg-[#e5eeff] px-2 py-1 text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#0b1c30]"
                  >
                    <Image src={pill.icon} alt="" width={pill.size[0]} height={pill.size[1]} />
                    {pill.label}
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setTerms(!terms)}
              aria-expanded={terms}
              className="flex cursor-pointer items-center gap-1 self-start text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#0b1c30]"
            >
              <Image src={`${IMG}/terms.svg`} alt="" width={13.33} height={13.33} />
              Cancellation Terms
              <Image src={`${IMG}/chevron-small.svg`} alt="" width={8} height={4.93} className={terms ? "rotate-180" : ""} />
            </button>
          </div>
          {terms && (
            <p className="rounded-lg bg-[#f8f9ff] p-3 text-xs leading-5 text-[#45464f]">
              {bus.freeCancellation
                ? "Free cancellation up to 6 hours before departure. 50% refund between 6 and 2 hours before departure; no refund after that."
                : "75% refund up to 12 hours before departure, 50% up to 4 hours before. No refund after that."}
            </p>
          )}
        </>
      )}
    </section>
  );
}

// true only after hydration on the client — lets pages read sessionStorage
// without server/client markup mismatches.
const noopSubscribe = () => () => {};
export const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);
