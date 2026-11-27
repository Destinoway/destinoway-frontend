"use client";

import {
  DEPARTURE_SLOTS,
  countBy,
  toDuration,
} from "@/modules/bus/data/busResultsData";
import { searchBuses } from "@/modules/bus/services/busSearch";
import { Drawer } from "antd";
import { useEffect, useMemo, useState } from "react";
import BusCard from "./BusCard";
import DateStrip from "./DateStrip";
import FiltersPanel from "./FiltersPanel";
import ResultsSearchBar from "./ResultsSearchBar";
import ResultsToolbar from "./ResultsToolbar";

const PAGE_SIZE = 5;

const EMPTY_FILTERS = {
  freeCancel: false,
  slots: [],
  types: [],
  price: null,
  boarding: [],
  drop: [],
  operators: [],
};

const slotOf = (mins) => DEPARTURE_SLOTS.find((s) => mins / 60 >= s.from && mins / 60 < s.to)?.key;
const cityName = (v) => v.split(",")[0].trim();

function applyFilters(buses, f) {
  return buses.filter(
    (b) =>
      (!f.freeCancel || b.freeCancellation) &&
      (!f.slots.length || f.slots.includes(slotOf(b.depMins))) &&
      (!f.types.length || f.types.every((t) => b.types.includes(t))) &&
      (!f.price || (b.price >= f.price[0] && b.price <= f.price[1])) &&
      (!f.boarding.length || b.pickups.some((p) => f.boarding.includes(p.name))) &&
      (!f.drop.length || b.drops.some((p) => f.drop.includes(p.name))) &&
      (!f.operators.length || f.operators.includes(b.operatorShort)),
  );
}

const SORTERS = {
  departure: (a, b) => a.depMins - b.depMins,
  duration: (a, b) => a.duration - b.duration,
  arrival: (a, b) => a.arrivalTimestamp - b.arrivalTimestamp,
  price: (a, b) => a.price - b.price,
};

function Pagination({ page, pages, total, shown, onPage }) {
  if (total === 0) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  const btn = "flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-md px-2 text-[11px] font-bold disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 rounded-md border border-[rgba(198,197,209,0.3)] bg-white px-6 py-[25px] sm:flex-row"
    >
      <p className="text-xs text-[#45464f]">
        Showing <strong className="text-[#0b1c30]">{shown}</strong> of <strong className="text-[#0b1c30]">{total}</strong> buses
        available
      </p>
      <div className="flex items-center gap-1.5">
        <button type="button" className={`${btn} bg-[#e5eeff] text-[#05144b]`} disabled={page === 1} onClick={() => onPage(page - 1)}>
          Previous
        </button>
        {nums.map((n, i) =>
          n === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-xs text-[#45464f]">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              aria-current={n === page ? "page" : undefined}
              onClick={() => onPage(n)}
              className={`${btn} ${n === page ? "bg-[#05144b] text-white" : "text-[#0b1c30] hover:bg-[#e5eeff]"}`}
            >
              {n}
            </button>
          ),
        )}
        <button type="button" className={`${btn} bg-[#e5eeff] text-[#05144b]`} disabled={page === pages} onClick={() => onPage(page + 1)}>
          Next
        </button>
      </div>
    </nav>
  );
}

export default function BusResults({ query }) {
  const { from, to, date } = query;
  const [search, setSearch] = useState({ status: "loading", buses: [] });
  const [attempt, setAttempt] = useState(0);
  const { status, buses } = search;

  useEffect(() => {
    const controller = new AbortController();
    searchBuses({ from, to, date }, controller.signal).then(
      (buses) => {
        if (!controller.signal.aborted) setSearch({ status: "ready", buses });
      },
      () => {
        if (!controller.signal.aborted) setSearch({ status: "error", buses: [] });
      },
    );
    return () => controller.abort();
  }, [from, to, date, attempt]);
  const [filters, setFiltersState] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState({ key: "departure", dir: "asc" });
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setFilters = (next) => {
    setFiltersState(next);
    setPage(1);
  };

  const fromCity = cityName(query.from);
  const toCity = cityName(query.to);

  const priceBounds = useMemo(() => {
    if (!buses.length) return [0, 25];
    const prices = buses.map((b) => b.price);
    const min = Math.floor(Math.min(...prices) / 25) * 25;
    const max = Math.ceil(Math.max(...prices) / 25) * 25;
    return [min, Math.max(min + 25, max)];
  }, [buses]);

  const facets = useMemo(() => {
    const slots = {};
    for (const b of buses) slots[slotOf(b.depMins)] = (slots[slotOf(b.depMins)] || 0) + 1;
    return {
      fromCity,
      toCity,
      slots,
      boarding: countBy(buses, (b) => b.pickups.map((p) => p.name)).sort((a, b) => b.count - a.count),
      drop: countBy(buses, (b) => b.drops.map((p) => p.name)).sort((a, b) => b.count - a.count),
      operators: countBy(buses, (b) => b.operatorShort).sort((a, b) => b.count - a.count),
    };
  }, [buses, fromCity, toCity]);

  const results = useMemo(() => {
    const list = applyFilters(buses, filters);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => SORTERS[sort.key](a, b) * dir);
  }, [buses, filters, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageItems = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const fastest = results.length ? toDuration(Math.min(...results.map((b) => b.duration))) : null;

  const without = (key, value) => ({ ...filters, [key]: filters[key].filter((v) => v !== value) });
  const activeChips = [
    ...(filters.freeCancel ? [{ key: "fc", label: "Free Cancellation", remove: () => setFilters({ ...filters, freeCancel: false }) }] : []),
    ...filters.types.map((t) => ({ key: `t-${t}`, label: t, remove: () => setFilters(without("types", t)) })),
    ...filters.slots.map((s) => ({
      key: `s-${s}`,
      label: DEPARTURE_SLOTS.find((x) => x.key === s)?.chip,
      remove: () => setFilters(without("slots", s)),
    })),
    ...(filters.price ? [{ key: "price", label: `₹${filters.price[0]}–₹${filters.price[1]}`, remove: () => setFilters({ ...filters, price: null }) }] : []),
    ...filters.boarding.map((v) => ({ key: `b-${v}`, label: v, remove: () => setFilters(without("boarding", v)) })),
    ...filters.drop.map((v) => ({ key: `d-${v}`, label: v, remove: () => setFilters(without("drop", v)) })),
    ...filters.operators.map((v) => ({ key: `o-${v}`, label: v, remove: () => setFilters(without("operators", v)) })),
  ];

  const goToPage = (p) => {
    setPage(p);
    document.getElementById("bus-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const panel = (
    <FiltersPanel
      filters={filters}
      setFilters={setFilters}
      facets={facets}
      priceBounds={priceBounds}
      activeChips={activeChips}
      onReset={() => setFilters(EMPTY_FILTERS)}
    />
  );

  const queryKey = `${query.from}|${query.to}|${query.date}`;

  return (
    <div className="min-h-screen bg-[#d5e0e6] pb-16">
      <div className="bg-[#05144b] px-3 pt-[31px] pb-12 sm:px-4">
        <div className="mx-auto max-w-[1280px]">
          <ResultsSearchBar key={queryKey} query={query} />
        </div>
      </div>

      <div className="mx-auto -mt-4 grid max-w-[1280px] grid-cols-1 items-start gap-3 px-3 sm:px-4 lg:grid-cols-[295px_minmax(0,1fr)]">
        <aside className="sticky top-3 hidden max-h-[calc(100vh-24px)] overflow-y-auto rounded-md [scrollbar-width:thin] lg:block">
          {status === "ready" && buses.length > 0 && panel}
        </aside>

        <div id="bus-results" className="flex min-w-0 scroll-mt-4 flex-col gap-3">
          <DateStrip key={queryKey} query={query} />
          {status === "ready" && buses.length > 0 && (
            <ResultsToolbar
              sort={sort}
              setSort={setSort}
              total={results.length}
              from={fromCity}
              to={toCity}
              fastest={fastest}
              onOpenFilters={() => setDrawerOpen(true)}
              filterCount={activeChips.length}
            />
          )}

          {status === "loading" ? (
            <p role="status" className="rounded-md bg-white p-8 text-center">Searching for buses…</p>
          ) : status === "error" ? (
            <div role="alert" className="rounded-md bg-white p-8 text-center">
              <p>We couldn't load bus results. Please try again.</p>
              <button type="button" className="mt-3 font-bold text-[#ba611e]" onClick={() => {
                setSearch({ status: "loading", buses: [] });
                setAttempt((value) => value + 1);
              }}>Retry</button>
            </div>
          ) : !buses.length ? (
            <p className="rounded-md bg-white p-8 text-center">No buses available for this route and date.</p>
          ) : pageItems.length > 0 ? (
            pageItems.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-md border border-[rgba(198,197,209,0.3)] bg-white px-6 py-14 text-center">
              <p className="text-base font-bold text-[#0b1c30]">No buses match these filters</p>
              <p className="text-sm text-[#45464f]">Try removing a filter or picking another date.</p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="cursor-pointer rounded-lg bg-[#e58a00] px-5 py-2 text-sm font-bold text-white"
              >
                Reset all filters
              </button>
            </div>
          )}

          <Pagination page={current} pages={pages} total={results.length} shown={pageItems.length} onPage={goToPage} />
        </div>
      </div>

      <Drawer
        title="Filters"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="default"
        styles={{ body: { padding: 12, background: "#d5e0e6" } }}
        footer={
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-full cursor-pointer rounded-lg bg-[#e58a00] py-2.5 text-sm font-bold text-white"
          >
            Show {results.length} {results.length === 1 ? "bus" : "buses"}
          </button>
        }
      >
        {panel}
      </Drawer>
    </div>
  );
}
