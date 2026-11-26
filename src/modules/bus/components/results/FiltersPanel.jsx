"use client";

import { AMENITIES, BUS_TYPES, DEPARTURE_SLOTS, RESULTS_IMG } from "@/modules/bus/data/busResultsData";
import { Slider } from "antd";
import Image from "next/image";
import { useState } from "react";

const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

function Heading({ children, action }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xl leading-5 font-bold text-[#0b1c30]">{children}</h3>
      {action}
    </div>
  );
}

function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded p-1 hover:bg-[#f8f9ff]">
      <span className="flex min-w-0 items-center gap-2">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span
          aria-hidden
          className={`flex size-4 shrink-0 items-center justify-center rounded border peer-focus-visible:ring-2 peer-focus-visible:ring-[#05144b]/40 ${
            checked ? "border-transparent bg-[#05144b]" : "border-[#6b7280] bg-white"
          }`}
        >
          {checked && <Image src={`${RESULTS_IMG}/f-check.svg`} alt="" width={16} height={16} />}
        </span>
        <span className="truncate text-xs leading-4 text-[#0b1c30]">{label}</span>
      </span>
      <span className="pl-2 text-[11px] leading-4 text-[#45464f]">{count}</span>
    </label>
  );
}

function PointList({ title, items, selected, onToggle }) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase()));
  const shown = expanded ? filtered : filtered.slice(0, 4);
  const hidden = filtered.length - shown.length;

  return (
    <section className="flex flex-col gap-3">
      <Heading>{title}</Heading>
      <div className="relative pt-1">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={`Search ${title}`}
          className="h-[37px] w-full rounded-md border border-[#c6c5d1] bg-white pr-9 pl-3 text-xs text-[#0b1c30] outline-none focus:border-[#05144b]"
        />
        <Image
          src={`${RESULTS_IMG}/sb-search.svg`}
          alt=""
          width={14}
          height={14}
          className="pointer-events-none absolute top-[calc(50%+2px)] right-3 -translate-y-1/2"
        />
      </div>
      <div className="flex max-h-[220px] flex-col gap-1.5 overflow-auto pr-1">
        {shown.map((i) => (
          <CheckRow
            key={i.label}
            label={i.label}
            count={i.count}
            checked={selected.includes(i.label)}
            onChange={() => onToggle(i.label)}
          />
        ))}
        {filtered.length === 0 && <p className="p-1 text-xs text-[#45464f]">No matches</p>}
      </div>
      {(hidden > 0 || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-fit cursor-pointer text-sm leading-[21px] font-medium text-[#ba611e] underline"
        >
          {expanded ? "Show less" : `Show more ${hidden}`}
        </button>
      )}
    </section>
  );
}

export default function FiltersPanel({ filters, setFilters, facets, priceBounds, activeChips, onReset }) {
  const set = (patch) => setFilters({ ...filters, ...patch });
  const optionBtn = (active) =>
    `flex items-center justify-center rounded border text-[13px] leading-[19.5px] font-medium transition-colors cursor-pointer ${
      active ? "border-[#ba611e] bg-[#05144b] text-white" : "border-[#b4b4b4] text-[#363636] hover:border-[#05144b]"
    }`;

  return (
    <div className="flex flex-col gap-4 rounded-md border border-[rgba(198,197,209,0.3)] bg-white p-[17px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1 text-lg leading-6 font-bold text-[#0b1c30]">
          <Image src={`${RESULTS_IMG}/f-filter.svg`} alt="" width={15} height={15} />
          Filters
        </h2>
        <button type="button" onClick={onReset} className="cursor-pointer text-[10px] leading-[14px] font-bold text-[#e58a00]">
          RESET ALL
        </button>
      </div>

      {activeChips.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Active filters">
          {activeChips.map((chip) => (
            <li
              key={chip.key}
              className="flex items-center gap-1 rounded-full bg-[#dce9ff] px-2 py-0.5 text-xs leading-[14px] font-medium text-[#05144b] drop-shadow-[0_0_1px_rgba(0,0,0,0.25)]"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.remove}
                aria-label={`Remove ${chip.label}`}
                className="cursor-pointer px-0.5 text-[10px] font-bold"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[rgba(198,197,209,0.2)] bg-[#eff4ff] p-[9px]">
        <span className="flex items-center gap-1">
          <Image src={`${RESULTS_IMG}/f-cancel.svg`} alt="" width={16.5} height={15.75} />
          <span className="flex flex-col">
            <span className="text-xs leading-4 font-semibold text-[#0b1c30]">Free Cancellation</span>
            <span className="text-[11px] leading-5 text-[#45464f]">Instant 100% refund</span>
          </span>
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={filters.freeCancel}
          onChange={() => set({ freeCancel: !filters.freeCancel })}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`relative h-5 w-9 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#05144b]/40 ${
            filters.freeCancel ? "bg-[#05144b]" : "bg-[#cbd5e1]"
          }`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${filters.freeCancel ? "left-[18px]" : "left-0.5"}`}
          />
        </span>
      </label>

      <section className="flex flex-col gap-3">
        <Heading>Departure Time</Heading>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[13px]">
          {DEPARTURE_SLOTS.map((slot) => {
            const active = filters.slots.includes(slot.key);
            return (
              <button
                key={slot.key}
                type="button"
                aria-pressed={active}
                onClick={() => set({ slots: toggle(filters.slots, slot.key) })}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border px-2 pt-[9px] pb-px transition-colors ${
                  active ? "border-[#ba611e] bg-[#05144b]" : "border-[rgba(112,111,123,0.3)] bg-[#f8f9ff] hover:border-[#05144b]"
                }`}
              >
                <span className="flex items-start gap-1.5">
                  <Image
                    src={slot.icon}
                    alt=""
                    width={slot.size[0]}
                    height={slot.size[1]}
                    className={active && slot.key !== "night" ? "brightness-0 invert" : ""}
                  />
                  <span className={`text-xs leading-[14px] whitespace-nowrap ${active ? "font-bold text-white" : "font-semibold text-[#0b1c30]"}`}>
                    {slot.label}
                  </span>
                </span>
                <span className={`text-[10px] leading-5 ${active ? "font-semibold text-[#ffd89d]" : "text-[#45464f]"}`}>
                  {facets.slots[slot.key] || 0} Buses
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Heading
          action={
            filters.types.length > 0 && (
              <button type="button" onClick={() => set({ types: [] })} className="cursor-pointer text-sm leading-[21px] text-[#999]">
                Reset
              </button>
            )
          }
        >
          Bus Type
        </Heading>
        <div className="grid grid-cols-2 gap-3">
          {BUS_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={filters.types.includes(t)}
              onClick={() => set({ types: toggle(filters.types, t) })}
              className={`h-[34px] ${optionBtn(filters.types.includes(t))}`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Heading>Price</Heading>
        <div className="px-2">
          <Slider
            range
            min={priceBounds[0]}
            max={priceBounds[1]}
            step={25}
            value={filters.price || priceBounds}
            onChange={(v) => set({ price: v[0] === priceBounds[0] && v[1] === priceBounds[1] ? null : v })}
            tooltip={{ formatter: (v) => `₹${v}` }}
            styles={{
              track: { background: "#05144b", height: 8, borderRadius: 9999 },
              rail: { background: "#e5e7eb", height: 8, borderRadius: 9999 },
              handle: { insetBlockStart: 2 },
            }}
            classNames={{ handle: "[&::after]:!shadow-[0_0_0_3px_#e58a00]" }}
            className="!my-2"
          />
          <div className="flex justify-between text-[13px] leading-[19.5px] font-semibold text-[#262626]">
            <span>₹{(filters.price || priceBounds)[0]}</span>
            <span>₹{(filters.price || priceBounds)[1]}</span>
          </div>
        </div>
      </section>

      <PointList
        title={`Boarding Point (${facets.fromCity})`}
        items={facets.boarding}
        selected={filters.boarding}
        onToggle={(v) => set({ boarding: toggle(filters.boarding, v) })}
      />
      <PointList
        title={`Drop Points (${facets.toCity})`}
        items={facets.drop}
        selected={filters.drop}
        onToggle={(v) => set({ drop: toggle(filters.drop, v) })}
      />

      <section className="flex flex-col gap-3">
        <Heading>Top Operators</Heading>
        <div className="flex max-h-[180px] flex-col gap-1.5 overflow-auto pr-1">
          {facets.operators.map((o) => (
            <CheckRow
              key={o.label}
              label={o.label}
              count={o.count}
              checked={filters.operators.includes(o.label)}
              onChange={() => set({ operators: toggle(filters.operators, o.label) })}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 pt-1">
        <Heading>Bus Amenities</Heading>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((a) => {
            const active = filters.amenities.includes(a.key);
            return (
              <button
                key={a.key}
                type="button"
                aria-pressed={active}
                onClick={() => set({ amenities: toggle(filters.amenities, a.key) })}
                className={`flex h-[26px] cursor-pointer items-center gap-1.5 rounded border p-[5px] text-[10px] leading-[14px] font-bold text-[#0b1c30] ${
                  active ? "border-[#05144b] bg-[#dce9ff]" : "border-[rgba(198,197,209,0.2)] bg-[#f8f9ff] hover:border-[#05144b]"
                }`}
              >
                <Image src={a.icon} alt="" width={a.size[0]} height={a.size[1]} />
                {a.label} ({facets.amenities[a.key] || 0})
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col gap-[3px] rounded-lg border border-[rgba(198,197,209,0.2)] bg-[#dce9ff] p-[9px]">
        <p className="flex items-center gap-1 text-sm leading-5 font-bold text-[#05144b]">
          <Image src={`${RESULTS_IMG}/f-assured.svg`} alt="" width={10.67} height={13.33} />
          Destinoway Assured
        </p>
        <p className="text-[11px] leading-[17.88px] text-[#45464f]">
          Guaranteed on-time departure or get 25% cash refund credited within 2 hours.
        </p>
      </div>
    </div>
  );
}
