"use client";

import { RESULTS_IMG } from "@/modules/bus/data/busResultsData";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { busSearchHref } from "@/modules/bus/utils/busSearchHref";

const WINDOW = 10;

function label(d, today) {
  if (d.isSame(today, "day")) return "Today";
  if (d.isSame(today.add(1, "day"), "day")) return "Tomorrow";
  return d.format("ddd, MMM D");
}

export default function DateStrip({ query }) {
  const today = dayjs().startOf("day");
  const selected = dayjs(query.date);
  // Start the window so the selected date is visible (3rd slot when possible).
  const initialStart = selected.subtract(3, "day").isBefore(today) ? today : selected.subtract(3, "day");
  const [start, setStart] = useState(initialStart);
  const days = Array.from({ length: WINDOW }, (_, i) => start.add(i, "day"));
  const canGoBack = start.isAfter(today, "day");

  const arrow = "flex w-[30px] shrink-0 cursor-pointer items-center justify-center bg-white py-3 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <nav aria-label="Travel date" className="flex overflow-hidden rounded-md border border-[rgba(198,197,209,0.2)] bg-white">
      <button
        type="button"
        aria-label="Previous dates"
        disabled={!canGoBack}
        onClick={() => {
          const s = start.subtract(7, "day");
          setStart(s.isBefore(today) ? today : s);
        }}
        className={`${arrow} border-r border-[rgba(198,197,209,0.2)]`}
      >
        <Image src={`${RESULTS_IMG}/d-chevron.svg`} alt="" width={5.55} height={9} className="rotate-180" />
      </button>

      <ul className="flex flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {days.map((d) => {
          const active = d.isSame(selected, "day");
          return (
            <li key={d.format("YYYY-MM-DD")} className="flex-1">
              <Link
                href={busSearchHref({ ...query, date: d.format("YYYY-MM-DD") })}
                aria-current={active ? "date" : undefined}
                className={`block px-4 pt-3 text-center text-[13px] leading-5 whitespace-nowrap ${
                  active
                    ? "border-b-2 border-[#05144b] bg-[#e5eeff] pb-[10px] font-bold text-[#05144b]"
                    : "pb-3 font-semibold text-[#45464f] hover:bg-[#f8f9ff]"
                }`}
              >
                {label(d, today)}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        aria-label="Next dates"
        onClick={() => setStart(start.add(7, "day"))}
        className={`${arrow} border-l border-[rgba(198,197,209,0.2)]`}
      >
        <Image src={`${RESULTS_IMG}/d-chevron.svg`} alt="" width={5.55} height={9} />
      </button>
    </nav>
  );
}
