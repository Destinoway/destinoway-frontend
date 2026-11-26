"use client";

import { api } from "@/services/axios";

import { POPULAR_ROUTES, TRIP_MODES } from "@/modules/bus/data/busHomeData";
import { useBusSearchStore } from "@/modules/bus/store/busSearch.store";
import { App, DatePicker, Tooltip, Select } from "antd";
import dayjs from "dayjs";
import { busSearchHref } from "@/modules/bus/utils/busSearchHref";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const IMG = "/images/bus";

// Below `md` this follows the mobile Figma frame (labels under the service
// tiles, labels above inputs); from `md` up it follows the desktop frame.
const SERVICE_TABS = [
  { key: "hotel", label: "Hotel", icon: `${IMG}/tab-hotel.svg`, size: [43.75, 43.75], href: "/" },
  { key: "flight", label: "Flight", icon: `${IMG}/tab-flight.svg`, size: [50, 50], comingSoon: true },
  { key: "bus", label: "Bus", icon: `${IMG}/tab-bus.svg`, size: [50, 50], active: true },
];

function ServiceTab({ tab }) {
  const box = `flex size-14 items-center justify-center rounded-xl p-3 md:size-[90px] md:rounded-[10px] md:p-5 ${
    tab.active
      ? "bg-[#ba611e] shadow-[0_4px_3px_#d1d5dc] md:shadow-[2px_5px_7.8px_rgba(0,0,0,0.2)]"
      : "bg-white shadow-[0_4px_3px_#d1d5dc] md:shadow-[4px_4px_20px_rgba(0,0,0,0.08)]"
  }`;
  const inner = (
    <>
      <span className={box}>
        <Image src={tab.icon} alt="" width={tab.size[0]} height={tab.size[1]} className="h-auto max-h-full w-auto max-w-full" />
      </span>
      <span className="pt-2 text-[11px] leading-[17px] font-semibold text-[#05144b] md:hidden">{tab.label}</span>
    </>
  );
  const wrap = "flex flex-col items-center";

  if (tab.active) {
    return (
      <span className={wrap} aria-current="page">
        {inner}
      </span>
    );
  }
  if (tab.comingSoon) {
    return (
      <Tooltip title={<span className="text-xs">Coming Soon 🚀</span>}>
        <button type="button" disabled aria-label={`${tab.label}, coming soon`} className={`${wrap} cursor-not-allowed`}>
          {inner}
        </button>
      </Tooltip>
    );
  }
  return (
    <Link href={tab.href} className={`${wrap} transition-transform hover:scale-105`}>
      {inner}
    </Link>
  );
}

function CityField({ label, icon, iconSize, value, onChange, placeholder, id, options, loading, onSearch }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 md:gap-0">
      <label htmlFor={id} className="text-sm leading-[22px] font-semibold text-[#222] md:hidden">
        {label}
      </label>
      <label
        htmlFor={id}
        className="flex h-[65px] min-w-0 cursor-text items-center gap-3 rounded border-[0.667px] border-[#d1d5dc] bg-white px-4 focus-within:border-[#ba611e] md:rounded-xl md:border md:border-[#e2e8f0] md:bg-[rgba(248,250,252,0.5)] md:p-[15px]"
      >
        <Image src={icon} alt="" width={iconSize[0]} height={iconSize[1]} className="shrink-0" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="hidden text-[11px] leading-[16.5px] font-bold tracking-[0.55px] text-[#5a6588] uppercase md:block">
            {label}
          </span>
          <Select
            id={id}
            value={value || undefined}
            onChange={onChange}
            showSearch={{ onSearch, filterOption: false }}
            placeholder={placeholder}
            options={options}
            loading={loading}
            style={{ width: "100%" }}
            className="ant-select-no-border"
          />
        </span>
      </label>
    </div>
  );
}

export default function BusHero() {
  const { message } = App.useApp();
  const router = useRouter();
  const { tripMode, from, to, date, setTripMode, setFrom, setTo, setDate, swap, setRoute } = useBusSearchStore();
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);

  const selected = dayjs(date);
  const today = dayjs().startOf("day");
  const isToday = selected.isSame(today, "day");
  const isTomorrow = selected.isSame(today.add(1, "day"), "day");

  const searchStations = useCallback(async (term, type) => {
    if (!term || term.length < 2) return [];
    try {
      const { data: json } = await api.post("/bus/stations", { term, type });
      if (json.success && json.data) {
        return json.data.map((station) => ({
          label: station.name,
          value: station.name,
        }));
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
    return [];
  }, []);

  const handleFromSearch = useCallback(
    async (val) => {
      setFromLoading(true);
      const options = await searchStations(val, "from");
      setFromOptions(options);
      setFromLoading(false);
    },
    [searchStations]
  );

  const handleToSearch = useCallback(
    async (val) => {
      setToLoading(true);
      const options = await searchStations(val, "to");
      setToOptions(options);
      setToLoading(false);
    },
    [searchStations]
  );

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) {
      message.warning({ content: "Please enter both From and To cities", key: "bus-search" });
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      message.warning({ content: "From and To cities can't be the same", key: "bus-search" });
      return;
    }
    router.push(busSearchHref({ from, to, date }));
  };

  const pill = (active) =>
    `flex h-5 w-[78px] items-center justify-center rounded-md text-[10px] leading-4 font-semibold transition-colors ${
      active ? "bg-[#ba611e] text-white" : "border border-[#e2e8f0] text-[#acacac] hover:text-[#5a6588]"
    }`;

  return (
    <section id="bus-search" className="relative w-full scroll-mt-4 bg-white">
      {/* Mobile: photo fills the whole hero behind the card. md+: banner strip. */}
      <div className="absolute inset-0 overflow-hidden bg-[#d9d9d9] md:relative md:inset-auto md:h-[280px] lg:h-[339px]">
        <Image
          src={`${IMG}/hero-banner.png`}
          alt="Intercity bus on a highway at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[61%_50%] md:object-[50%_62%]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1232px] px-2.5 pt-[87px] pb-9 sm:px-4 md:-mt-20 md:pt-0 md:pb-0 lg:-mt-[92px]">
        <div className="relative rounded-2xl border-[0.667px] border-[#e5e7eb] bg-[#f8f8f8] px-4 pt-[58px] pb-6 shadow-[0_20px_25px_rgba(0,0,0,0.1),0_8px_10px_rgba(0,0,0,0.1)] md:rounded-xl md:border-0 md:bg-white md:px-6 md:pt-[52px] md:pb-3 md:shadow-none md:drop-shadow-[0_8px_15px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 items-start gap-3 md:gap-[50px]">
            {SERVICE_TABS.map((tab) => (
              <ServiceTab key={tab.key} tab={tab} />
            ))}
          </div>

          <div
            role="radiogroup"
            aria-label="Trip type"
            className="flex items-center justify-between gap-x-4 gap-y-2 md:flex-wrap md:justify-start"
          >
            {TRIP_MODES.map((mode) => {
              const active = tripMode === mode.key;
              return (
                <button
                  key={mode.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTripMode(mode.key)}
                  className={`flex cursor-pointer items-center gap-1.5 tracking-[0.6px] whitespace-nowrap uppercase ${
                    active
                      ? "border-b-2 border-[#ba611e] pb-1.5 text-xs leading-4 font-bold text-[#ba611e] md:text-sm"
                      : "pb-1 text-[10px] leading-4 font-semibold text-[#5a6588] hover:text-[#05144b] md:text-xs"
                  }`}
                >
                  <Image src={mode.icon} alt="" width={mode.iconSize[0]} height={mode.iconSize[1]} />
                  {mode.label}
                  {mode.badge && (
                    <span className="ml-1 hidden rounded bg-[#fef3c7] px-1.5 py-0.5 text-[10px] leading-4 font-bold text-[#92400e] md:inline">
                      {mode.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 items-end gap-3 pt-4 md:items-center md:py-[13px] lg:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)_261px_190px]">
            <CityField
              id="bus-from"
              label="From City"
              icon={`${IMG}/field-search.svg`}
              iconSize={[16.67, 16.67]}
              value={from}
              onChange={setFrom}
              placeholder="Jaipur, Sindhi Camp"
              options={fromOptions}
              loading={fromLoading}
              onSearch={handleFromSearch}
            />

            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="relative z-10 mx-auto -my-[18px] flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-transform hover:rotate-180 md:-my-5 md:size-9 lg:my-0"
            >
              <Image src={`${IMG}/swap.svg`} alt="" width={15.15} height={12.15} className="rotate-90 lg:rotate-0" />
            </button>

            <CityField
              id="bus-to"
              label="To Destination"
              icon={`${IMG}/field-pin.svg`}
              iconSize={[14.85, 18.52]}
              value={to}
              onChange={setTo}
              placeholder="Delhi, Kashmiri Gate"
              options={toOptions}
              loading={toLoading}
              onSearch={handleToSearch}
            />

            <div className="flex flex-col gap-2 md:gap-0">
              <span className="text-sm leading-[22px] font-semibold text-[#222] md:hidden">Journey Date</span>
              <div className="flex h-[65px] items-center gap-3 rounded-md border-[0.667px] border-[#d9d9d9] bg-white px-4 md:rounded-xl md:border md:border-[#e2e8f0] md:bg-[rgba(248,250,252,0.5)] md:p-[15px]">
                <div className="relative flex min-w-0 flex-1 items-center gap-3 max-md:gap-5">
                  <Image src={`${IMG}/field-calendar.svg`} alt="" width={16.69} height={18.52} className="shrink-0" />
                  <div className="flex min-w-0 flex-col gap-px">
                    <span className="hidden text-[11px] leading-[16.5px] font-bold tracking-[0.55px] text-[#5a6588] uppercase md:block">
                      Journey Date
                    </span>
                    <span className="flex items-baseline gap-1 whitespace-nowrap">
                      <span className="text-lg leading-6 font-bold text-[#05144b] min-[400px]:text-xl md:text-base">
                        {selected.format("DD")}
                      </span>
                      <span className="text-lg leading-4 font-semibold text-[#5a6588] min-[400px]:text-xl md:text-xs">
                        {selected.format("MMM YYYY")}
                      </span>
                      <span className="text-lg leading-4 font-semibold text-[#ba611e] min-[400px]:text-xl md:text-xs">
                        {/* Short weekday on narrow phones so "Wednesday" etc. still fit. */}
                        <span className="min-[440px]:hidden">{selected.format("ddd")}</span>
                        <span className="hidden min-[440px]:inline">{selected.format("dddd")}</span>
                      </span>
                    </span>
                  </div>
                  {/* Invisible picker layered over the date text opens the calendar on click. */}
                  <DatePicker
                    aria-label="Journey date"
                    value={selected}
                    allowClear={false}
                    inputReadOnly
                    disabledDate={(d) => d && d.isBefore(today, "day")}
                    onChange={(d) => d && setDate(d.format("YYYY-MM-DD"))}
                    className="absolute! inset-0 cursor-pointer opacity-0"
                  />
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1.5">
                  <button type="button" className={pill(isToday)} onClick={() => setDate(today.format("YYYY-MM-DD"))}>
                    Today
                  </button>
                  <button
                    type="button"
                    className={pill(isTomorrow)}
                    onClick={() => setDate(today.add(1, "day").format("YYYY-MM-DD"))}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="mx-auto mt-1 flex h-[52px] w-full max-w-[260px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ba611e] px-6 py-3 text-xl leading-6 font-bold text-white shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#a35419] md:mt-0 md:h-[60px] md:max-w-none md:text-base md:shadow-[0_10px_15px_-3px_rgba(186,97,30,0.3),0_4px_6px_-4px_rgba(186,97,30,0.3)] lg:w-[190px] lg:justify-self-end"
            >
              Search
              <Image src={`${IMG}/search-arrow.svg`} alt="" width={13.5} height={13.5} className="max-md:size-4" />
            </button>
          </div>

          <div className="hidden flex-wrap items-center gap-2 border-t border-[#f1f5f9] pt-[17px] pb-1 md:flex">
            <span className="text-xs leading-4 font-bold tracking-[0.6px] text-[#05144b] uppercase">Popular Routes:</span>
            {POPULAR_ROUTES.map((route, i) => (
              <span key={`${route.from}-${route.to}`} className="flex items-center gap-2">
                {i > 0 && <span className="text-xs text-[#cbd5e1]">•</span>}
                <button
                  type="button"
                  onClick={() => setRoute(route)}
                  className="cursor-pointer rounded-lg bg-[#f1f5f9] px-2.5 py-1 text-xs leading-4 font-medium text-[#1e293b] transition-colors hover:bg-[#ffedd5]"
                >
                  {route.from} ⇄ {route.to}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
