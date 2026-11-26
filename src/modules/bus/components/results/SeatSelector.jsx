"use client";

import { MAX_SEATS, RESULTS_IMG, SEAT_ICONS, SEAT_LEGEND, fareBreakdown, inr } from "@/modules/bus/data/busResultsData";
import { busBookingHref } from "@/modules/bus/utils/busSearchHref";
import { App } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ROW_ORDER_TOP = ["A", "B"];
const ROW_ORDER_BOTTOM = ["C", "D"];

// Sleeper berth colours per state (Figma "Bus Sleeper Container").
const BERTH_STYLES = {
  available: { box: "border-[#777] bg-transparent", pillow: "bg-[#c4c9cd] border-white/50", text: "text-[#777]" },
  availableMale: { box: "border-[#1088d7] bg-white", pillow: "bg-[#bae6fd] border-[#7dd3fc]", text: "text-[#1088d7]" },
  availableFemale: { box: "border-[#f472b6] bg-white", pillow: "bg-[rgba(249,168,212,0.8)] border-[rgba(244,114,182,0.5)]", text: "text-[#be185d]" },
  bookedMale: { box: "border-[#1088d7] bg-[#e1f3ff]", pillow: "bg-[#1088d7] border-white", text: "text-[#1088d7]" },
  bookedFemale: { box: "border-[#f472b6] bg-[#fce7f3]", pillow: "bg-[#be185d] border-white", text: "text-[#be185d]" },
  selected: { box: "border-white bg-[#fbbf24]", pillow: "bg-[#e38d0f] border-[#b45309]", text: "text-white" },
};

function Berth({ seat, selected, onToggle, price }) {
  const booked = seat.state.startsWith("booked");
  const s = BERTH_STYLES[selected ? "selected" : seat.state];
  const who = seat.state === "availableMale" ? ", male only" : seat.state === "availableFemale" ? ", female only" : "";
  return (
    <button
      type="button"
      disabled={booked}
      aria-pressed={selected}
      aria-label={`Berth ${seat.id}${booked ? ", booked" : `, ₹${price}${who}`}`}
      title={booked ? `${seat.id} · Booked` : `${seat.id} · ₹${price}`}
      onClick={() => onToggle(seat)}
      className={`flex h-[30px] w-12 shrink-0 items-center justify-center rounded-md ${
        booked ? "cursor-not-allowed" : "cursor-pointer focus-visible:ring-2 focus-visible:ring-[#05144b]/50"
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

function BerthMap({ seats, selectedIds, onToggle, price }) {
  const byRow = (r) => seats.filter((s) => s.row === r);
  const row = (r) => (
    <div key={r} className="flex items-center gap-[9px]">
      <span className="-mr-[5px] w-3 text-center text-[9px] font-bold text-[#94a3b8]">{r}</span>
      {byRow(r).map((s) => (
        <Berth key={s.id} seat={s} selected={selectedIds.includes(s.id)} onToggle={onToggle} price={price} />
      ))}
    </div>
  );
  return (
    <div className="overflow-x-auto pt-2 pb-3 [scrollbar-width:thin]">
      <div className="relative mt-1 w-[510px] rounded-[10px] border-[3px] border-[#c3c3c3] bg-[#f2f9ff] py-[11px] pr-3 pl-[93px]">
        <span aria-hidden className="absolute -top-2 left-[42px] h-1.5 w-6 rounded-t-md border border-[#64748b] bg-[#94a3b8]" />
        <span aria-hidden className="absolute -bottom-2 left-[42px] h-1.5 w-6 rounded-b-md border border-[#64748b] bg-[#94a3b8]" />
        <span aria-hidden className="absolute -top-2 right-[52px] h-1.5 w-6 rounded-t-md border border-[#64748b] bg-[#94a3b8]" />
        <span aria-hidden className="absolute -bottom-2 right-[52px] h-1.5 w-6 rounded-b-md border border-[#64748b] bg-[#94a3b8]" />
        <span aria-hidden className="absolute top-[15px] bottom-[15px] -left-1.5 w-1.5 rounded-l-full bg-[#cbd5e1]" />
        <div aria-hidden className="absolute top-[12px] bottom-[12px] left-[12px] flex w-[68px] flex-col items-center rounded-md bg-[#d8dde3]">
          <Image src={`${RESULTS_IMG}/x-container2.svg`} alt="" width={26} height={26} className="mt-4 -rotate-90" />
          <span className="mx-2 my-3 h-px self-stretch bg-[#cbd5e1]" />
          <span className="flex items-center gap-1">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#e58a00] shadow-[0_0_0_1px_#c47500]">
              <Image src={`${RESULTS_IMG}/x-container3.svg`} alt="" width={10} height={10} className="-rotate-90" />
            </span>
            <span className="text-[9px] font-semibold text-[#475569] [writing-mode:vertical-rl]">Entry Gate</span>
          </span>
          <span className="mt-auto mb-1 text-[8px] font-bold tracking-[0.8px] text-[#94a3b8] uppercase">Front</span>
        </div>

        <div className="flex flex-col gap-px">{ROW_ORDER_TOP.map(row)}</div>
        <div className="my-1.5 ml-1.5 flex items-center gap-11 border-y border-dashed border-[rgba(182,182,182,0.35)] p-0.5">
          <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.45px] text-[#94a3b8] uppercase">
            Aisle <Image src={`${RESULTS_IMG}/x-container4.svg`} alt="" width={8.67} height={8.67} />
          </span>
          <span className="flex gap-2">
            <span className="flex h-5 items-center gap-1 rounded border border-[#fde68a] bg-[#fffbeb] px-[9px] text-[9px] font-bold text-[#e58a00]">
              <Image src={`${RESULTS_IMG}/x-container5.svg`} alt="" width={9} height={9} /> Pantry Hub
            </span>
            <span className="flex h-5 items-center gap-1 rounded border border-[#bfdbfe] bg-[#eff6ff] px-[9px] text-[9px] font-bold text-[#05144b]">
              <Image src={`${RESULTS_IMG}/x-container6.svg`} alt="" width={8.5} height={10} /> Clean Restroom
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-px">{ROW_ORDER_BOTTOM.map(row)}</div>
      </div>
    </div>
  );
}

function Seat({ seat, selected, onToggle, price }) {
  const booked = seat.state.startsWith("booked");
  const icon = selected ? SEAT_ICONS.selected : SEAT_ICONS[seat.state];
  const who =
    seat.state === "availableMale" ? ", male only" : seat.state === "availableFemale" ? ", female only" : "";
  return (
    <button
      type="button"
      disabled={booked}
      aria-pressed={selected}
      aria-label={`Seat ${seat.id}${booked ? ", booked" : `, ₹${price}${who}`}`}
      title={booked ? `${seat.id} · Booked` : `${seat.id} · ₹${price}`}
      onClick={() => onToggle(seat)}
      className={`flex size-[30.6px] items-center justify-center rounded-md transition-transform ${
        booked ? "cursor-not-allowed" : "cursor-pointer hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#05144b]/50"
      }`}
    >
      <Image src={icon} alt="" width={25.5} height={22.1} />
    </button>
  );
}

function SeatRow({ row, seats, selectedIds, onToggle, price }) {
  return (
    <div className="flex items-center">
      <span className="w-3 text-[9px] font-bold text-[#94a3b8]">{row}</span>
      {seats.map((s) => (
        <Seat key={s.id} seat={s} selected={selectedIds.includes(s.id)} onToggle={onToggle} price={price} />
      ))}
    </div>
  );
}

function CoachMap({ seats, selectedIds, onToggle, price }) {
  const byRow = (r) => seats.filter((s) => s.row === r);
  return (
    <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
      <div className="relative mt-2 w-[500px] rounded-[10px] border border-[#c3c3c3] bg-[#f2f9ff] p-[15px] pl-[93px]">
        {/* front cabin */}
        <span aria-hidden className="absolute -top-2 left-[42px] h-1.5 w-6 rounded-t-md border border-[#64748b] bg-[#94a3b8]" />
        <span aria-hidden className="absolute -bottom-2 left-[42px] h-1.5 w-6 rounded-b-md border border-[#64748b] bg-[#94a3b8]" />
        <span aria-hidden className="absolute top-[15px] bottom-[15px] -left-1.5 w-1.5 rounded-r-full bg-[#cbd5e1]" />
        <div aria-hidden className="absolute top-[15px] bottom-[15px] left-[15px] flex w-[68px] flex-col items-center rounded-md bg-[#d8dde3]">
          <Image src={`${RESULTS_IMG}/x-container2.svg`} alt="" width={26} height={26} className="mt-4" />
          <span className="mx-2 my-3 h-px self-stretch bg-[#cbd5e1]" />
          <span className="flex size-7 items-center justify-center rounded-lg bg-[#e58a00]">
            <Image src={`${RESULTS_IMG}/x-container3.svg`} alt="" width={10} height={10} />
          </span>
          <span className="mt-1 text-[9px] font-semibold text-[#475569]">Entry Gate</span>
          <span className="mt-auto mb-1 text-[8px] font-bold tracking-[0.8px] text-[#94a3b8] uppercase">Front</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {ROW_ORDER_TOP.map((r) => (
            <SeatRow key={r} row={r} seats={byRow(r)} selectedIds={selectedIds} onToggle={onToggle} price={price} />
          ))}
        </div>
        <div className="my-1 ml-3 flex items-center gap-11 border-y border-dashed border-[rgba(182,182,182,0.35)] p-0.5">
          <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.45px] text-[#94a3b8] uppercase">
            Aisle <Image src={`${RESULTS_IMG}/x-container4.svg`} alt="" width={8.67} height={8.67} />
          </span>
          <span className="flex gap-2">
            <span className="flex h-5 items-center gap-1 rounded border border-[#fde68a] bg-[#fffbeb] px-[9px] text-[9px] font-bold text-[#e58a00]">
              <Image src={`${RESULTS_IMG}/x-container5.svg`} alt="" width={9} height={9} /> Pantry Hub
            </span>
            <span className="flex h-5 items-center gap-1 rounded border border-[#bfdbfe] bg-[#eff6ff] px-[9px] text-[9px] font-bold text-[#05144b]">
              <Image src={`${RESULTS_IMG}/x-container6.svg`} alt="" width={8.5} height={10} /> Clean Restroom
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          {ROW_ORDER_BOTTOM.map((r) => (
            <SeatRow key={r} row={r} seats={byRow(r)} selectedIds={selectedIds} onToggle={onToggle} price={price} />
          ))}
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

function BookingDetails({ seats, price, pickup, drop, onEdit, onProceed }) {
  const { base, gst, total } = fareBreakdown(seats.length, price);
  const row = "flex justify-between text-xs leading-5 text-[#45464f]";

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-[rgba(198,197,209,0.2)] bg-white p-4">
      <div>
        <h4 className="text-lg font-bold text-[#05144b]">Booking Details</h4>
        <p className="text-[11px] text-[#45464f]">
          {seats.length} {seats.length === 1 ? "Passenger" : "Passengers"} Selected
        </p>
      </div>
      {[
        ["Boarding Point", pickup],
        ["Dropping Point", drop],
      ].map(([label, p]) => (
        <div key={label} className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-[#45464f]">{label}</span>
          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer truncate rounded-md border border-[#c6c5d1] px-3 py-2 text-left text-xs text-[#0b1c30] hover:border-[#05144b]"
          >
            {p.name} ({p.time})
          </button>
        </div>
      ))}
      <div className="flex flex-col gap-1 rounded-lg bg-[#f8f9ff] p-3">
        <div className={row}>
          <span>Base Fare (Seat {seats.join(", ")})</span>
          <span>{inr(base)}</span>
        </div>
        <div className={row}>
          <span>GST (5%)</span>
          <span>{inr(gst)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-[#e2e8f0] pt-2 text-base font-bold text-[#05144b]">
          <span>Total Payable</span>
          <span>{inr(total)}</span>
        </div>
        <p className="text-[10px] text-[#0f766e]">Apply coupons on the next step.</p>
      </div>
      <button
        type="button"
        onClick={onProceed}
        className="cursor-pointer rounded-lg bg-[#e58a00] py-2.5 text-sm font-bold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:bg-[#c97c00]"
      >
        Proceed to Passenger Details
      </button>
    </div>
  );
}

export default function SeatSelector({ bus, query }) {
  const { message } = App.useApp();
  const router = useRouter();
  const deckKeys = Object.keys(bus.decks);
  const [deck, setDeck] = useState(deckKeys[0]);
  const [selected, setSelected] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [editingPoints, setEditingPoints] = useState(false);

  const availableCount = Object.fromEntries(
    deckKeys.map((k) => [k, bus.decks[k].filter((s) => s.state.startsWith("available")).length]),
  );

  const toggleSeat = (seat) => {
    setSelected((cur) => {
      if (cur.includes(seat.id)) return cur.filter((id) => id !== seat.id);
      if (cur.length >= MAX_SEATS) {
        message.warning({ content: `You can select up to ${MAX_SEATS} seats per booking`, key: "seat-max" });
        return cur;
      }
      return [...cur, seat.id];
    });
  };

  const fare = selected.length * bus.price;
  const showSummary = selected.length > 0 && pickup && drop && !editingPoints;

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
          {SEAT_LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5 text-[10px] font-bold text-[#0b1c30]">
              {bus.layout === "sleeper" ? (
                <BerthSwatch state={l.state} />
              ) : (
                <Image src={l.icon} alt="" width={l.size[0]} height={l.size[1]} className="shrink-0" />
              )}
              {l.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_345px]">
        <div className="flex min-w-0 flex-col gap-4">
          {bus.layout === "sleeper" ? (
            <BerthMap seats={bus.decks[deck]} selectedIds={selected} onToggle={toggleSeat} price={bus.price} />
          ) : (
            <CoachMap seats={bus.decks[deck]} selectedIds={selected} onToggle={toggleSeat} price={bus.price} />
          )}
          <div className="flex flex-col gap-1.5 rounded-xl border border-[rgba(198,197,209,0.2)] bg-white p-[15px] lg:max-w-[514px]">
            <p className="text-lg font-medium text-[#45464f] sm:text-xl">
              Selected Seat:{" "}
              <span className="font-bold text-[#05144b]">{selected.length ? selected.join(", ") : "None"}</span>
            </p>
            <p className="flex items-center gap-1.5 font-bold">
              <span className="text-base text-[#0b1c30]">Bus Fare:</span>
              <span className="text-xl text-[#ba611e]">₹{fare}</span>
            </p>
            {selected.length > 0 && !(pickup && drop) && (
              <p className="text-[11px] text-[#45464f]">Choose your pickup and drop points to continue.</p>
            )}
          </div>
        </div>

        {showSummary ? (
          <BookingDetails
            seats={selected}
            price={bus.price}
            pickup={pickup}
            drop={drop}
            onEdit={() => setEditingPoints(true)}
            onProceed={() =>
              router.push(busBookingHref({ query, busId: bus.id, seats: selected, pickupId: pickup.id, dropId: drop.id }))
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            <PointsPanel
              key={editingPoints ? "edit" : "pick"}
              bus={bus}
              pickup={pickup}
              drop={drop}
              setPickup={setPickup}
              setDrop={(p) => {
                setDrop(p);
                setEditingPoints(false);
              }}
            />
            {editingPoints && pickup && drop && (
              <button
                type="button"
                onClick={() => setEditingPoints(false)}
                className="cursor-pointer self-end text-xs font-bold text-[#ba611e] underline"
              >
                Back to booking details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
