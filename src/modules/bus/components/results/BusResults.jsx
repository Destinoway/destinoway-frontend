"use client";

import {
  AMENITIES,
  DEPARTURE_SLOTS,
  QUICK_FILTERS,
  countBy,
  toDuration,
} from "@/modules/bus/data/busResultsData";
import { useBusSearch } from "@/modules/bus/hooks/useBusSearch";
import { useBusSearchResults } from "@/modules/bus/hooks/useBusSearchResults";
import { Drawer, Spin } from "antd";
import dayjs from "dayjs";
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
  amenities: [],
  quick: [],
};

const slotOf = (mins) => DEPARTURE_SLOTS.find((s) => mins / 60 >= s.from && mins / 60 < s.to)?.key;
const cityName = (v) => v.split(",")[0].trim();

// Transform API bus response to match existing format
const transformApiBus = (apiBus) => {
  const departure = dayjs(apiBus.departureTime);
  const arrival = dayjs(apiBus.arrivalTime);
  const depMins = departure.hour() * 60 + departure.minute();
  const arrMins = arrival.hour() * 60 + arrival.minute();

  return {
    id: apiBus.busServiceId,
    operatorName: apiBus.operatorName,
    operatorShort: apiBus.operatorName.substring(0, 3).toUpperCase(),
    busType: apiBus.busType,
    types: [apiBus.busType],
    from: apiBus.from,
    to: apiBus.to,
    depMins,
    arrMins,
    duration: apiBus.durationMinutes,
    price: apiBus.customerFare,
    availableSeats: apiBus.availableSeats,
    freeCancellation: apiBus.zeroCancellation,
    partialCancellation: apiBus.partialCancellation,
    refundable: apiBus.refundable,
    pickups: apiBus.pickups.map((p) => ({ name: p.address, time: p.time })),
    drops: apiBus.dropoffs.map((d) => ({ name: d.address, time: d.time })),
    amenities: [],
    tags: [],
    rating: 4.5,
    departureTime: apiBus.departureTime,
    arrivalTime: apiBus.arrivalTime,
  };
};

function applyFilters(buses, f) {
  return buses.filter(
    (b) =>
      (!f.freeCancel || b.freeCancellation) &&
      (!f.slots.length || f.slots.includes(slotOf(b.depMins))) &&
      (!f.types.length || f.types.every((t) => b.types.includes(t))) &&
      (!f.price || (b.price >= f.price[0] && b.price <= f.price[1])) &&
      (!f.boarding.length || b.pickups.some((p) => f.boarding.includes(p.name))) &&
      (!f.drop.length || b.drops.some((p) => f.drop.includes(p.name))) &&
      (!f.operators.length || f.operators.includes(b.operatorShort)) &&
      f.amenities.every((a) => b.amenities.includes(a)) &&
      f.quick.every((q) => b.tags.includes(q)),
  );
}

const SORTERS = {
  departure: (a, b) => a.depMins - b.depMins,
  duration: (a, b) => a.duration - b.duration,
  arrival: (a, b) => a.arrMins - b.arrMins,
  rating: (a, b) => a.rating - b.rating,
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
  const [filters, setFiltersState] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState({ key: "departure", dir: "asc" });
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tui, setTui] = useState(null);

  // Initiate search
  const { mutate: searchBuses, isPending: searchPending } = useBusSearch();

  // Fetch results
  const { data: searchData, isLoading: resultsLoading, isError } = useBusSearchResults(tui, Boolean(tui));

  // Start search on mount (prevent duplicate calls)
  useEffect(() => {
    if (tui) return; // Already searching or have results

    const timer = setTimeout(() => {
      searchBuses(
        { from: query.from, to: query.to, onward: query.date },
        {
          onSuccess: (data) => {
            setTui(data.tui);
          },
        }
      );
    }, 0);

    return () => clearTimeout(timer);
  }, [query.from, query.to, query.date]);

  // Transform API buses to UI format
  const buses = useMemo(() => {
    if (!searchData?.buses) return [];
    return searchData.buses.map(transformApiBus);
  }, [searchData]);

  const setFilters = (next) => {
    setFiltersState(next);
    setPage(1);
  };

  const fromCity = cityName(query.from);
  const toCity = cityName(query.to);

  const priceBounds = useMemo(() => {
    if (!buses.length) return [0, 1000];
    const prices = buses.map((b) => b.price);
    return [Math.floor(Math.min(...prices) / 25) * 25, Math.ceil(Math.max(...prices) / 25) * 25];
  }, [buses]);

  const facets = useMemo(() => {
    const slots = {};
    for (const b of buses) slots[slotOf(b.depMins)] = (slots[slotOf(b.depMins)] || 0) + 1;
    const amenities = {};
    for (const b of buses) for (const a of b.amenities) amenities[a] = (amenities[a] || 0) + 1;
    return {
      fromCity,
      toCity,
      slots,
      amenities,
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
    ...filters.quick.map((q) => ({
      key: `q-${q}`,
      label: q === "primo" ? "4.5+ ★" : QUICK_FILTERS.find((x) => x.key === q)?.label,
      remove: () => setFilters(without("quick", q)),
    })),
    ...filters.slots.map((s) => ({
      key: `s-${s}`,
      label: DEPARTURE_SLOTS.find((x) => x.key === s)?.chip,
      remove: () => setFilters(without("slots", s)),
    })),
    ...(filters.price ? [{ key: "price", label: `₹${filters.price[0]}–₹${filters.price[1]}`, remove: () => setFilters({ ...filters, price: null }) }] : []),
    ...filters.boarding.map((v) => ({ key: `b-${v}`, label: v, remove: () => setFilters(without("boarding", v)) })),
    ...filters.drop.map((v) => ({ key: `d-${v}`, label: v, remove: () => setFilters(without("drop", v)) })),
    ...filters.operators.map((v) => ({ key: `o-${v}`, label: v, remove: () => setFilters(without("operators", v)) })),
    ...filters.amenities.map((v) => ({
      key: `a-${v}`,
      label: AMENITIES.find((x) => x.key === v)?.label,
      remove: () => setFilters(without("amenities", v)),
    })),
  ];

  const toggleQuick = (k) =>
    setFilters({ ...filters, quick: filters.quick.includes(k) ? filters.quick.filter((q) => q !== k) : [...filters.quick, k] });

  const goToPage = (p) => {
    setPage(p);
    setExpandedId(null);
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
  const isLoading = searchPending || resultsLoading;

  return (
    <div className="min-h-screen bg-[#d5e0e6] pb-16">
      <div className="bg-[#05144b] px-3 pt-[31px] pb-12 sm:px-4">
        <div className="mx-auto max-w-[1280px]">
          <ResultsSearchBar key={queryKey} query={query} />
        </div>
      </div>

      <div className="mx-auto -mt-4 grid max-w-[1280px] grid-cols-1 items-start gap-3 px-3 sm:px-4 lg:grid-cols-[295px_minmax(0,1fr)]">
        <aside className="sticky top-3 hidden max-h-[calc(100vh-24px)] overflow-y-auto rounded-md [scrollbar-width:thin] lg:block">
          {panel}
        </aside>

        <div id="bus-results" className="flex min-w-0 scroll-mt-4 flex-col gap-3">
          <DateStrip key={queryKey} query={query} />

          {isLoading ? (
            <div className="flex items-center justify-center rounded-md bg-white p-16">
              <Spin size="large" description="Fetching buses..." />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-md border border-[rgba(198,197,209,0.3)] bg-white px-6 py-14 text-center">
              <p className="text-base font-bold text-[#0b1c30]">Error loading buses</p>
              <p className="text-sm text-[#45464f]">Please try searching again.</p>
            </div>
          ) : (
            <>
              <ResultsToolbar
                sort={sort}
                setSort={setSort}
                quick={filters.quick}
                toggleQuick={toggleQuick}
                total={results.length}
                from={fromCity}
                to={toCity}
                fastest={fastest}
                onOpenFilters={() => setDrawerOpen(true)}
                filterCount={activeChips.length}
              />

              {pageItems.length > 0 ? (
                pageItems.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    query={query}
                    expanded={expandedId === bus.id}
                    onToggle={() => setExpandedId(expandedId === bus.id ? null : bus.id)}
                  />
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
            </>
          )}
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
