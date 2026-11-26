"use client";

import { RESULTS_IMG } from "@/modules/bus/data/busResultsData";
import { useBusSearchStore } from "@/modules/bus/store/busSearch.store";
import { useBusStationSearch } from "@/modules/bus/hooks/useBusStationSearch";
import { busSearchHref } from "@/modules/bus/utils/busSearchHref";
import { App, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";


function Field({ label, icon, iconSize, children, className = "" }) {
  return (
    <div
      className={`flex h-[51px] min-w-0 items-center rounded-lg border border-[#b5b7ba] bg-[#f8fafc] px-[13px] py-[9px] focus-within:border-[#05144b] ${className}`}
    >
      <span className="flex w-7 shrink-0">
        <Image src={icon} alt="" width={iconSize[0]} height={iconSize[1]} />
      </span>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] leading-[16.5px] font-bold tracking-[0.55px] text-[#5a6588] uppercase">{label}</span>
        {children}
      </div>
    </div>
  );
}

export default function ResultsSearchBar({ query }) {
  const router = useRouter();
  const { message } = App.useApp();
  const setRoute = useBusSearchStore((s) => s.setRoute);
  const setStoreDate = useBusSearchStore((s) => s.setDate);
  const [from, setFrom] = useState(query.from);
  const [to, setTo] = useState(query.to);
  const [date, setDate] = useState(query.date);
  const [fromSearchText, setFromSearchText] = useState("");
  const [toSearchText, setToSearchText] = useState("");
  const selected = dayjs(date);
  const today = dayjs().startOf("day");

  const { data: fromOptions = [], isLoading: fromLoading } = useBusStationSearch(fromSearchText, "from");
  const { data: toOptions = [], isLoading: toLoading } = useBusStationSearch(toSearchText, "to");

  const stationOptions = (stations) =>
    stations.map((station) => ({
      label: station.name,
      value: station.name,
    }));

  const submit = (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      message.warning({ content: "Please enter both From and To cities", key: "bus-search" });
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      message.warning({ content: "From and To cities can't be the same", key: "bus-search" });
      return;
    }
    setRoute({ from, to });
    setStoreDate(date);
    router.push(busSearchHref({ from, to, date }));
  };

  return (
    <form
      onSubmit={submit}
      className="relative grid grid-cols-1 gap-2 rounded-md bg-[#d5e0e6] p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)_minmax(0,1fr)_188px] lg:items-center lg:gap-x-6 lg:px-7"
    >
      <Field label="From City" icon={`${RESULTS_IMG}/sb-search.svg`} iconSize={[16.67, 16.67]} className="border-[#969696]">
        <Select
          showSearch
          value={from || undefined}
          onChange={setFrom}
          onSearch={setFromSearchText}
          loading={fromLoading}
          options={stationOptions(fromOptions)}
          filterOption={false}
          placeholder="From"
          classNames={{
            selector: "!bg-transparent !border-0 !shadow-none",
            selection: "!bg-transparent !border-0 !shadow-none",
          }}
          suffixIcon={null}
          variant="borderless"
        />
      </Field>

      <button
        type="button"
        onClick={() => {
          setFrom(to);
          setTo(from);
        }}
        aria-label="Swap origin and destination"
        className="z-10 mx-auto -my-4 flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-transform hover:rotate-180 md:my-0"
      >
        <Image src={`${RESULTS_IMG}/sb-swap.svg`} alt="" width={15.15} height={12.15} className="max-md:rotate-90" />
      </button>

      <Field label="To Destination" icon={`${RESULTS_IMG}/sb-pin.svg`} iconSize={[14.85, 18.52]}>
        <Select
          showSearch
          value={to || undefined}
          onChange={setTo}
          onSearch={setToSearchText}
          loading={toLoading}
          options={stationOptions(toOptions)}
          filterOption={false}
          placeholder="To"
          classNames={{
            selector: "!bg-transparent !border-0 !shadow-none",
            selection: "!bg-transparent !border-0 !shadow-none",
          }}
          suffixIcon={null}
          variant="borderless"
        />
      </Field>

      <Field label="Journey Date" icon={`${RESULTS_IMG}/sb-calendar.svg`} iconSize={[16.69, 18.52]} className="md:col-span-2 lg:col-span-1">
        <span className="text-base leading-5 font-bold whitespace-nowrap text-black">
          {selected.format("DD")} <span className="text-[#5a6588]">{selected.format("MMM YYYY")}</span>{" "}
          <span className="text-[#ba611e]">{selected.format("dddd")}</span>
        </span>
        <DatePicker
          aria-label="Journey date"
          value={selected}
          allowClear={false}
          inputReadOnly
          disabledDate={(d) => d && d.isBefore(today, "day")}
          onChange={(d) => d && setDate(d.format("YYYY-MM-DD"))}
          className="absolute! inset-0 cursor-pointer opacity-0"
        />
      </Field>

      <button
        type="submit"
        className="flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-[58px] bg-[#e08b00] py-[13px] text-xl leading-7 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#c97c00] md:col-span-1 lg:col-span-1"
      >
        Search
      </button>
    </form>
  );
}

