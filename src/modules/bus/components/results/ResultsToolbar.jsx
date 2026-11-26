"use client";

import { QUICK_FILTERS, RESULTS_IMG, SORTS } from "@/modules/bus/data/busResultsData";
import Image from "next/image";

export default function ResultsToolbar({ sort, setSort, quick, toggleQuick, total, from, to, fastest, onOpenFilters, filterCount }) {
  const onSort = (key) => {
    if (sort.key === key) setSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    else setSort({ key, dir: key === "rating" ? "desc" : "asc" });
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border border-[rgba(198,197,209,0.3)] bg-white p-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-[17px]">
      <div
        role="group"
        aria-label="Sort buses"
        className="flex overflow-x-auto rounded-lg border border-[rgba(198,197,209,0.2)] bg-[#eff4ff] px-[5px] pt-[9px] pb-[5px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SORTS.map((s) => {
          const active = sort.key === s.key;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={active}
              onClick={() => onSort(s.key)}
              className={`flex min-w-[96px] flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-[9px] leading-4 whitespace-nowrap ${
                active
                  ? "border border-[rgba(198,197,209,0.2)] bg-white text-sm font-bold text-[#05144b] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                  : "text-xs font-semibold text-[#45464f] hover:text-[#05144b]"
              }`}
            >
              {s.label}
              {active ? (
                <Image
                  src={`${RESULTS_IMG}/s-arrow-up.svg`}
                  alt={sort.dir === "asc" ? "ascending" : "descending"}
                  width={10.67}
                  height={10.67}
                  className={sort.dir === "desc" ? "rotate-180" : ""}
                />
              ) : (
                s.key === "price" && <Image src={`${RESULTS_IMG}/s-sort.svg`} alt="" width={10.67} height={13.33} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#05144b] bg-white px-[13px] py-[7px] text-xs leading-[14px] font-bold text-[#05144b] lg:hidden"
        >
          <Image src={`${RESULTS_IMG}/f-filter.svg`} alt="" width={12} height={12} />
          Filters{filterCount > 0 ? ` (${filterCount})` : ""}
        </button>
        {QUICK_FILTERS.map((q) => {
          const active = quick.includes(q.key);
          return (
            <button
              key={q.key}
              type="button"
              aria-pressed={active}
              onClick={() => toggleQuick(q.key)}
              className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-[13px] py-[7px] text-xs leading-[14px] font-bold whitespace-nowrap ${
                active
                  ? "border-[rgba(229,138,0,0.4)] bg-[#ba611e] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                  : "border-[rgba(198,197,209,0.3)] bg-[#e5eeff] text-[#0b1c30] hover:border-[#05144b]"
              }`}
            >
              <Image
                src={q.icon}
                alt=""
                width={q.size[0]}
                height={q.size[1]}
                className={active && q.key !== "primo" ? "brightness-0 invert" : ""}
              />
              {q.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-1">
        <div>
          <h1 className="flex flex-wrap items-baseline gap-x-2 text-[22px] leading-8 font-bold text-[#0b1c30]">
            {total} {total === 1 ? "Bus" : "Buses"} Found
            <span className="text-sm leading-5 font-normal text-[#45464f]">
              from {from} to {to}
            </span>
          </h1>
          <p className="text-[11px] leading-4 text-[#45464f]">
            All prices inclusive of GST &amp; operator tolls · Free travel insurance available
          </p>
        </div>
        {fastest && (
          <span className="flex w-fit items-center gap-1 rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-[11px] py-[5px] text-[10px] leading-[14px] font-bold text-[#006d04]">
            ⚡ FASTEST: {fastest}
          </span>
        )}
      </div>
    </div>
  );
}
