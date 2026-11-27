"use client";

import { MAX_SEATS, RESULTS_IMG, SEAT_ICONS, SEAT_LEGEND } from "@/modules/bus/data/busResultsData";
import { App } from "antd";
import Image from "next/image";
import { useState } from "react";

// Sleeper berth colours per state (Figma "Bus Sleeper Container").
const BERTH_STYLES = {
  available: { box: "border-[#777] bg-transparent", pillow: "bg-[#c4c9cd] border-white/50", text: "text-[#777]" },
  availableMale: { box: "border-[#1088d7] bg-white", pillow: "bg-[#bae6fd] border-[#7dd3fc]", text: "text-[#1088d7]" },
  availableFemale: { box: "border-[#f472b6] bg-white", pillow: "bg-[rgba(249,168,212,0.8)] border-[rgba(244,114,182,0.5)]", text: "text-[#be185d]" },
  unavailable: { box: "border-[#cbd5e1] bg-[#e2e8f0]", pillow: "bg-[#cbd5e1] border-white", text: "text-[#64748b]" },
  selected: { box: "border-white bg-[#fbbf24]", pillow: "bg-[#e38d0f] border-[#b45309]", text: "text-white" },
};

function Berth({ seat, selected, onToggle, price }) {
  const booked = seat.state === "unavailable";
  const s = BERTH_STYLES[selected ? "selected" : seat.state];
  const who = seat.state === "availableMale" ? ", male only" : seat.state === "availableFemale" ? ", female only" : "";
  return (
    <button
      type="button"
      disabled={booked}
      aria-pressed={selected}
      aria-label={`Berth ${seat.id}${booked ? ", unavailable" : `, ₹${price}${who}`}`}
      title={booked ? `${seat.id} · Unavailable` : `${seat.id} · ₹${price}`}
      onClick={() => onToggle(seat)}
      className={`flex h-[30px] w-12 shrink-0 items-center justify-center rounded-md ${
        booked ? "cursor-not-allowed opacity-50" : "cursor-pointer focus-visible:ring-2 focus-visible:ring-[#05144b]/50"
      }`}
    >
      <span
        className={`flex h-6 w-[49px] items-center justify-between rounded border p-[5px] drop-shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-transform ${s.box} ${
          booked ? "" : "hover:scale-105"
        }`}
      >
        <span className={`h-full w-2 rounded-[2px] border-r shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] ${s.pillow}`} />
        <span className={`text-xs leading-4 font-extrabold ${s.text}`}>{seat.id}</span>
      </span>
    </button>
  );
}

function BerthSwatch({ state }) {
  const s = BERTH_STYLES[state];
  return (
    <span aria-hidden className={`flex h-[14px] w-[26px] shrink-0 items-center rounded-[3px] border p-[2px] ${s.box}`}>
      <span className={`h-full w-1.5 rounded-[1px] border-r ${s.pillow}`} />
    </span>
  );
}

function Seat({ seat, selected, onToggle, price }) {
  const booked = seat.state === "unavailable";
  const icon = selected ? SEAT_ICONS.selected : SEAT_ICONS[seat.state] || SEAT_ICONS.available;
  const who =
    seat.state === "availableMale" ? ", male only" : seat.state === "availableFemale" ? ", female only" : "";
  return (
    <button
      type="button"
      disabled={booked}
      aria-pressed={selected}
      aria-label={`Seat ${seat.id}${booked ? ", unavailable" : `, ₹${price}${who}`}`}
      title={booked ? `${seat.id} · Unavailable` : `${seat.id} · ₹${price}`}
      onClick={() => onToggle(seat)}
      className={`flex size-[30.6px] items-center justify-center rounded-md transition-transform ${
        booked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#05144b]/50"
      }`}
    >
      <Image src={icon} alt="" width={25.5} height={22.1} />
    </button>
  );
}

function CoachMap({ seats, selected, onToggle }) {
  return (
    <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
      <div className="flex w-max gap-4 rounded-[10px] border border-[#c3c3c3] bg-[#f2f9ff] p-4">
        <div className="flex min-w-12 flex-col items-center justify-between gap-4 rounded-md bg-[#d8dde3] p-2">
          <Image src={`${RESULTS_IMG}/x-container2.svg`} alt="" width={26} height={26} />
          <span className="text-[10px] font-bold uppercase text-[#475569]">Front</span>
        </div>
        <div className="grid auto-cols-[32px] auto-rows-[32px] place-items-center gap-1" aria-label="Coach layout">
          {seats.map((seat) => {
            const SeatButton = seat.berth ? Berth : Seat;
            return (
              <div key={seat.key} style={{
                gridRow: `${seat.row + 1} / span ${seat.height}`,
                gridColumn: `${seat.column + 1} / span ${seat.width}`,
              }}>
                <SeatButton seat={seat} selected={selected.includes(seat.key)} onToggle={onToggle} price={seat.price} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PointsPanel({ bus, pickup, drop, setPickup, setDrop }) {
  const [tab, setTab] = useState(pickup ? "drop" : "pickup");
  const [q, setQ] = useState("");
  const list = (tab === "pickup" ? bus.pickups : bus.drops).filter((p) =>
    `${p.name} ${p.address}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const current = tab === "pickup" ? pickup : drop;

  const choose = (p) => {
    if (tab === "pickup") {
      setPickup(p);
      setTab("drop");
      setQ("");
    } else setDrop(p);
  };

  const tabCls = (active) =>
    `flex-1 cursor-pointer py-3 text-[10px] font-bold tracking-[0.25px] uppercase ${
      active ? "border-b-2 border-[#05144b] bg-white text-[#05144b]" : "text-[#45464f]"
    }`;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[rgba(198,197,209,0.2)] bg-white">
      <div role="tablist" className="flex border-b border-[rgba(198,197,209,0.2)] bg-[#d5e0e6]">
        <button type="button" role="tab" aria-selected={tab === "pickup"} onClick={() => setTab("pickup")} className={tabCls(tab === "pickup")}>
          Select Pickup Point
        </button>
        <button type="button" role="tab" aria-selected={tab === "drop"} onClick={() => setTab("drop")} className={tabCls(tab === "drop")}>
          Select Drop Point
        </button>
      </div>
      <div className="p-3.5">
        <div className="relative">
          <Image src={`${RESULTS_IMG}/x-icon.svg`} alt="" width={13.5} height={13.5} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tab === "pickup" ? "Search" : "Search dropping point..."}
            aria-label={tab === "pickup" ? "Search pickup points" : "Search drop points"}
            className="w-full rounded-lg border border-[rgba(198,197,209,0.3)] bg-[#f8f9ff] py-[11px] pr-3 pl-[37px] text-[13px] text-[#0b1c30] outline-none placeholder:text-[rgba(69,70,79,0.6)] focus:border-[#05144b]"
          />
        </div>
        <ul role="radiogroup" className="mt-3 flex max-h-[288px] flex-col gap-2 overflow-y-auto pr-1">
          {list.map((p) => {
            const active = current?.id === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => choose(p)}
                  className={`flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border bg-[#f8f9ff] p-[13px] text-left ${
                    active ? "border-[rgba(5,20,75,0.3)]" : "border-[rgba(198,197,209,0.2)] hover:border-[rgba(5,20,75,0.2)]"
                  }`}
                >
                  <span className="flex gap-3">
                    <span className="flex w-[41px] shrink-0 flex-col">
                      <span className="text-[15px] font-extrabold text-[#0b1c30]">{p.time}</span>
                      <span className="text-[11px] text-[#45464f]">{p.day}</span>
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-bold text-[#0b1c30]">{p.name}</span>
                      <span className="text-[11px] leading-4 text-[#45464f]">{p.address}</span>
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-transparent bg-[#05144b]" : "border-[#6b7280] bg-white"
                    }`}
                  >
                    {active && <Image src={`${RESULTS_IMG}/x-image.svg`} alt="" width={16} height={16} />}
                  </span>
                </button>
              </li>
            );
          })}
          {list.length === 0 && <li className="p-2 text-xs text-[#45464f]">No points match your search</li>}
        </ul>
      </div>
    </div>
  );
}

export default function SeatSelector({ bus }) {
  const { message } = App.useApp();
  const deckKeys = Object.keys(bus.decks);
  const [deck, setDeck] = useState(deckKeys[0]);
  const [selected, setSelected] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);

  const availableCount = Object.fromEntries(
    deckKeys.map((k) => [k, bus.decks[k].filter((s) => s.state.startsWith("available")).length]),
  );

  const toggleSeat = (seat) => {
    setSelected((cur) => {
      if (cur.includes(seat.key)) return cur.filter((id) => id !== seat.key);
      if (cur.length >= MAX_SEATS) {
        message.warning({ content: `You can select up to ${MAX_SEATS} seats per booking`, key: "seat-max" });
        return cur;
      }
      return [...cur, seat.key];
    });
  };

  const selectedSeats = Object.values(bus.decks).flat().filter((seat) => selected.includes(seat.key));
  const fare = selectedSeats.reduce((total, seat) => total + seat.price, 0);
  const hasBerths = bus.decks[deck].some((seat) => seat.berth);
  const legend = [
    ...SEAT_LEGEND.filter((item) => !item.state.startsWith("booked")),
    { label: "Unavailable", state: "unavailable", icon: SEAT_ICONS.available, size: [18, 15] },
  ];

  return (
    <div className="border-t border-[rgba(198,197,209,0.3)] bg-[#eff4ff] p-4 sm:px-6 sm:pt-[25px] sm:pb-6">
      <div className="flex flex-col gap-3 pb-1 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold whitespace-nowrap text-[#05144b] sm:text-lg">Seat Selection</h3>
          {deckKeys.length > 1 && (
            <div role="tablist" aria-label="Deck" className="flex rounded-lg border border-[rgba(198,197,209,0.2)] bg-white p-[5px]">
              {deckKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={deck === k}
                  onClick={() => setDeck(k)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-bold whitespace-nowrap capitalize sm:px-3 ${
                    deck === k ? "bg-[#05144b] text-white" : "text-[#0b1c30]"
                  }`}
                >
                  {k} Deck ({availableCount[k]})
                </button>
              ))}
            </div>
          )}
        </div>
        <ul className="grid max-w-[482px] grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4" aria-label="Seat legend">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5 text-[10px] font-bold text-[#0b1c30]">
              {hasBerths ? (
                <BerthSwatch state={l.state} />
              ) : (
                <Image src={l.icon} alt="" width={l.size[0]} height={l.size[1]} className={l.state === "unavailable" ? "shrink-0 opacity-50" : "shrink-0"} />
              )}
              {l.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_345px]">
        <div className="flex min-w-0 flex-col gap-4">
          <CoachMap seats={bus.decks[deck]} selected={selected} onToggle={toggleSeat} />
          <div className="flex flex-col gap-1.5 rounded-xl border border-[rgba(198,197,209,0.2)] bg-white p-[15px] lg:max-w-[514px]">
            <p className="text-lg font-medium text-[#45464f] sm:text-xl">
              Selected Seat:{" "}
              <span className="font-bold text-[#05144b]">{selectedSeats.length ? selectedSeats.map((seat) => seat.id).join(", ") : "None"}</span>
            </p>
            <p className="flex items-center gap-1.5 font-bold">
              <span className="text-base text-[#0b1c30]">Bus Fare:</span>
              <span className="text-xl text-[#ba611e]">₹{fare}</span>
            </p>
            {selected.length > 0 && (
              <p className="text-[11px] text-[#45464f]">Online booking is currently unavailable.</p>
            )}
          </div>
        </div>

        <PointsPanel bus={bus} pickup={pickup} drop={drop} setPickup={setPickup} setDrop={setDrop} />
      </div>
    </div>
  );
}
