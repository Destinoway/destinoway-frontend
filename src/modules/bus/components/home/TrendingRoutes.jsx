"use client";

import { ROUTE_BADGES, ROUTE_FILTERS, TRENDING_ROUTES } from "@/modules/bus/data/busHomeData";
import { useBusSearchStore } from "@/modules/bus/store/busSearch.store";
import { Caveat } from "next/font/google";
import Image from "next/image";
import { useRef, useState } from "react";

const caveat = Caveat({ subsets: ["latin"], weight: ["700"], display: "swap" });

const routeKey = (r) => `${r.from}-${r.to}`;

function RouteCard({ route, onBook }) {
  return (
    <article className="flex w-[calc(100%-12px)] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-[#f1f5f9] bg-white p-px shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] md:w-auto">
      <div className="relative h-[220px] w-full overflow-hidden rounded-t-[23px] min-[400px]:h-[256px]">
        <Image
          src={route.image}
          alt={route.title}
          fill
          sizes="(min-width: 1024px) 390px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <span
          className="absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] leading-[16.5px] font-bold tracking-[0.55px] text-white uppercase backdrop-blur-[2px]"
          style={{ backgroundColor: route.badgeBg }}
        >
          {route.badge}
        </span>
        <span className="absolute right-4 bottom-4 flex h-[34px] items-baseline gap-0.5 rounded-full bg-[#f5a623] px-4 pt-[7px] text-[#020617] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
          <span className="text-sm leading-5 font-extrabold">{route.price}</span>
          <span className="text-[10px] leading-5">{route.unit}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs leading-4 text-[#94a3b8]">Duration: {route.duration}</span>
          <span className="text-xs leading-4 font-bold text-[#f59e0b]">★ {route.rating}</span>
        </div>
        <h3 className="text-lg leading-7 font-bold text-[#1e293b] md:text-xl">{route.title}</h3>
        <p className="line-clamp-2 pt-1 pb-3 text-xs leading-4 text-[#64748b]">{route.text}</p>
        <div className="mt-auto flex items-center justify-between border-t border-[#f1f5f9] pt-[17px]">
          <span className="text-xs leading-4 font-semibold text-[#047857]">{route.availability}</span>
          <button
            type="button"
            onClick={() => onBook(route)}
            className="cursor-pointer text-xs leading-4 font-bold tracking-[0.6px] text-[#0b3b2c] uppercase hover:text-[#ba611e]"
          >
            Book Now →
          </button>
        </div>
      </div>
    </article>
  );
}

export default function TrendingRoutes() {
  const [active, setActive] = useState("all");
  const [slide, setSlide] = useState(0);
  const trackRef = useRef(null);
  const setRoute = useBusSearchStore((s) => s.setRoute);

  const cards = active === "all" ? TRENDING_ROUTES : TRENDING_ROUTES.filter((r) => routeKey(r) === active);
  const activeFilter = ROUTE_FILTERS.find((r) => routeKey(r) === active);

  const selectFilter = (key) => {
    setActive(key);
    setSlide(0);
    trackRef.current?.scrollTo({ left: 0 });
  };

  // Prefill the hero search box and bring it into view.
  const bookRoute = (route) => {
    setRoute({ from: route.from, to: route.to });
    document.getElementById("bus-search")?.scrollIntoView({ behavior: "smooth" });
  };

  // Mobile carousel: work out which card is centred for the dots.
  const onTrackScroll = (e) => {
    const el = e.currentTarget;
    const card = el.firstElementChild;
    if (!card) return;
    const step = card.getBoundingClientRect().width + 12;
    setSlide(Math.min(cards.length - 1, Math.round(el.scrollLeft / step)));
  };

  const goTo = (i) => {
    const el = trackRef.current;
    const card = el?.children[i];
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const pill = (isActive) =>
    `shrink-0 cursor-pointer rounded-full px-5 py-2 text-xs leading-4 font-bold whitespace-nowrap transition-colors ${
      isActive
        ? "bg-[#ba611e] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        : "bg-[#f1f5f9] text-[#475569] hover:bg-[#ffedd5]"
    }`;

  return (
    <section className="mx-auto mt-6 w-full max-w-[1229px] px-2.5 sm:px-4">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5 pt-0.5">
          <p className="hidden text-sm leading-5 font-extrabold tracking-[1.4px] text-[#0f172a] uppercase md:block">
            Top Selected Routes
          </p>
          <h2 className="flex flex-wrap items-center font-semibold">
            <span className="text-[34px] leading-[48px] text-[#05144b] min-[400px]:text-[38px] sm:text-5xl">Trending&nbsp;</span>
            <span
              className={`${caveat.className} text-[46px] leading-[60px] font-bold text-[#ba611e] min-[400px]:text-[50px] sm:text-[60px]`}
            >
              Destinations
            </span>
          </h2>
          <p className="max-w-[512px] pt-0.5 text-sm leading-5 text-[#64748b]">
            These destinations are trending because they offer authentic experiences, breathtaking highway views, and
            comfortable overnight sleeper coach rides.
          </p>
        </div>

        <ul className="hidden gap-3 md:flex">
          {ROUTE_BADGES.map((b) => (
            <li
              key={b.label}
              className="flex flex-col items-center rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] px-[13px] py-[11px]"
            >
              <Image src={b.icon} alt="" width={22} height={22} />
              <span className="pt-1 text-center text-[10px] leading-[15px] font-bold whitespace-nowrap text-[#334155]">
                {b.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 -mr-2.5 flex items-center gap-2 overflow-x-auto py-2.5 pr-2.5 [scrollbar-width:none] sm:mr-0 sm:pr-0 md:mt-6 [&::-webkit-scrollbar]:hidden">
        <button type="button" aria-pressed={active === "all"} onClick={() => selectFilter("all")} className={pill(active === "all")}>
          All Routes
        </button>
        {ROUTE_FILTERS.map((r) => (
          <button
            key={routeKey(r)}
            type="button"
            aria-pressed={active === routeKey(r)}
            onClick={() => selectFilter(routeKey(r))}
            className={pill(active === routeKey(r))}
          >
            {r.from} → {r.to}
          </button>
        ))}
      </div>

      {cards.length > 0 ? (
        <>
          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            className="mt-2.5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-6 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((route) => (
              <RouteCard key={route.id} route={route} onBook={bookRoute} />
            ))}
          </div>

          {cards.length > 1 && (
            <div className="mt-2 flex items-center justify-center gap-1 md:hidden" role="tablist" aria-label="Trending routes">
              {cards.map((route, i) => (
                <button
                  key={route.id}
                  type="button"
                  role="tab"
                  aria-selected={slide === i}
                  aria-label={`Show ${route.title}`}
                  onClick={() => goTo(i)}
                  className={`cursor-pointer rounded-full transition-all ${
                    slide === i ? "size-3 bg-[#ba611e]" : "size-2.5 bg-[#d9d9d9]"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[#e2e8f0] bg-[#f8fafc] px-6 py-12 text-center">
          <p className="text-sm text-[#64748b]">
            No featured buses for {activeFilter?.from} → {activeFilter?.to} yet.
          </p>
          <button
            type="button"
            onClick={() => bookRoute(activeFilter)}
            className="cursor-pointer rounded-[7px] bg-[#ba611e] px-5 py-2 text-xs leading-4 font-bold text-white"
          >
            Search this route
          </button>
        </div>
      )}
    </section>
  );
}
