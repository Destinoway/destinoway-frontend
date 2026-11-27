"use client";

import { inr, RESULTS_IMG, toDuration } from "@/modules/bus/data/busResultsData";
import { fetchBusAmenities, fetchBusCancellationPolicy, fetchSeatLayout } from "@/modules/bus/services/busSearch";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const SeatSelector = dynamic(() => import("./SeatSelector"), {
  loading: () => <p role="status" className="p-4">Loading seat picker…</p>,
});

function SeatLayoutPanel({ bus }) {
  const [layout, setLayout] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const request = bus.seatLayoutRequest;

  useEffect(() => {
    if (!request?.tui) return;
    const controller = new AbortController();
    fetchSeatLayout(request, controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setLayout(data);
      },
      () => {
        if (!controller.signal.aborted) setFailed(true);
      },
    );
    return () => controller.abort();
  }, [request, attempt]);

  if (layout && Object.keys(layout.decks).length) return <SeatSelector bus={{ ...bus, ...layout }} />;
  return (
    <div className="border-t border-[#e2e8f0] bg-[#eff4ff] p-4">
      {failed ? (
        <div role="alert">
          <p>Couldn’t load the seat layout.</p>
          <button type="button" className="mt-2 font-bold text-[#ba611e]" onClick={() => {
            setFailed(false);
            setAttempt((value) => value + 1);
          }}>Retry</button>
        </div>
      ) : layout || !request?.tui ? (
        <p>Seat layout is unavailable for this bus.</p>
      ) : (
        <p role="status">Loading seat layout…</p>
      )}
    </div>
  );
}

function CancellationPolicyPanel({ request }) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const canFetch = Boolean(request?.tui && request?.busServiceId);

  useEffect(() => {
    if (!canFetch) return;
    const controller = new AbortController();
    fetchBusCancellationPolicy(request, controller.signal).then(
      (policies) => {
        if (!controller.signal.aborted) setResult({ policies });
      },
      () => {
        if (!controller.signal.aborted) setResult({ failed: true });
      },
    );
    return () => controller.abort();
  }, [canFetch, request, attempt]);

  return (
    <div className="overflow-x-auto border-t border-[#e2e8f0] px-4 py-3 text-xs text-[#45464f] sm:px-6">
      {!canFetch || result?.policies?.length === 0 ? (
        <p>Cancellation policy information unavailable.</p>
      ) : !result ? (
        <p role="status">Loading cancellation policy…</p>
      ) : result.failed ? (
        <div role="alert">
          <p>Couldn’t load the cancellation policy.</p>
          <button
            type="button"
            className="mt-2 font-bold text-[#ba611e]"
            onClick={() => {
              setResult(null);
              setAttempt((value) => value + 1);
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <table aria-label="Cancellation policy" className="w-full text-left">
          <thead className="bg-[#f8f9ff] text-[#0b1c30]">
            <tr>
              <th scope="col" className="px-2 py-2">Cancellation window</th>
              <th scope="col" className="px-2 py-2">Charge</th>
              <th scope="col" className="px-2 py-2">Deduction</th>
            </tr>
          </thead>
          <tbody>
            {result.policies.map(({ cancellationTime, cancellationCharges, deductionPercentage }, index) => (
              <tr key={index} className="border-b border-[#e2e8f0] last:border-0">
                <td className="px-2 py-2">{cancellationTime}</td>
                <td className="px-2 py-2">{cancellationCharges == null ? "—" : inr(cancellationCharges)}</td>
                <td className="px-2 py-2">{deductionPercentage ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AmenitiesPanel({ request }) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const canFetch = Boolean(request?.tui && request?.busServiceId);

  useEffect(() => {
    if (!canFetch) return;
    const controller = new AbortController();
    fetchBusAmenities(request, controller.signal).then(
      (names) => {
        if (!controller.signal.aborted) setResult({ names });
      },
      () => {
        if (!controller.signal.aborted) setResult({ failed: true });
      },
    );
    return () => controller.abort();
  }, [canFetch, request, attempt]);

  return (
    <div className="border-t border-[#e2e8f0] px-4 py-3 text-xs text-[#45464f] sm:px-6">
      {!canFetch || result?.names?.length === 0 ? (
        <p>Amenities information unavailable.</p>
      ) : !result ? (
        <p role="status">Loading amenities…</p>
      ) : result.failed ? (
        <div role="alert">
          <p>Couldn’t load amenities.</p>
          <button
            type="button"
            className="mt-2 font-bold text-[#ba611e]"
            onClick={() => {
              setResult(null);
              setAttempt((value) => value + 1);
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-label="Bus amenities">
          {result.names.map((name) => (
            <li key={name} className="rounded border border-[#e2e8f0] bg-[#f8f9ff] px-2 py-1">{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StripButton({ icon, iconSize, label, open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex cursor-pointer items-center gap-1 text-xs leading-[14px] font-bold whitespace-nowrap text-[#45464f] hover:text-[#05144b] sm:text-sm"
    >
      <Image src={icon} alt="" width={iconSize[0]} height={iconSize[1]} />
      {label}
      <Image src={`${RESULTS_IMG}/c-chevron.svg`} alt="" width={5.55} height={9} className={`transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
    </button>
  );
}

export default function BusCard({ bus }) {
  const [expanded, setExpanded] = useState(false);
  const [showStops, setShowStops] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);

  return (
    <article className="overflow-hidden rounded-md border border-[rgba(198,197,209,0.3)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-1 gap-4 px-4 pt-[14px] pb-4 sm:px-6 md:grid-cols-12 md:pb-6">
        <div className="flex flex-col justify-center gap-1.5 md:col-span-4">
          <h2 className="text-lg leading-[22.5px] font-extrabold text-[#0b1c30]">{bus.operator}</h2>
          <p className="text-xs leading-4 text-[#45464f]">{bus.coach}</p>
        </div>

        <div className="flex items-center justify-between gap-2 md:col-span-5 md:px-2">
          <div className="flex flex-col">
            <span className="text-lg leading-6 font-extrabold text-[#0b1c30]">{bus.depTime}</span>
            <span className="max-w-[120px] truncate text-xs leading-4 font-semibold text-[#0b1c30]">{bus.boardingPoint}</span>
            <span className="text-[11px] leading-5 text-[#45464f]">{bus.depDate}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center px-2">
            <span className="pb-1 text-[10px] leading-[14px] font-medium text-[#45464f]">{toDuration(bus.duration)}</span>
            <div className="flex w-full items-center gap-1">
              <span className="size-2.5 shrink-0 rounded-full bg-[#05144b] shadow-[0_0_0_2px_rgba(5,20,75,0.2)]" />
              <span className="h-0.5 flex-1 bg-gradient-to-r from-[#05144b] via-[#e58a00] to-[#005952]" />
              <span className="size-2.5 shrink-0 rounded-full bg-[#e58a00]" />
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-lg leading-6 font-extrabold text-[#0b1c30]">{bus.arrTime}</span>
            <span className="max-w-[120px] truncate text-xs leading-4 font-semibold text-[#0b1c30]">{bus.dropPoint}</span>
            <span className="text-[11px] leading-5 text-[#45464f]">{bus.arrDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2.5 md:col-span-3 md:flex-col md:items-end md:justify-center">
          <div className="flex flex-col md:items-end">
            <span className="text-[22px] leading-7 font-extrabold text-[#05144b]">₹{bus.price}</span>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-6 py-2.5 text-sm leading-5 font-bold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-colors ${
              expanded ? "bg-[#05144b] hover:bg-[#0c2fb1]" : "bg-[#e58a00] hover:bg-[#c97c00]"
            }`}
          >
            {expanded ? "Hide seats" : "Select seats"}
            <Image
              src={`${RESULTS_IMG}/c-chevron-down-white.svg`}
              alt=""
              width={9}
              height={5.55}
              className={expanded ? "rotate-180" : ""}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(198,197,209,0.2)] bg-[#eff4ff] px-4 py-2 sm:px-6">
        <StripButton
          icon={`${RESULTS_IMG}/c-policy.svg`}
          iconSize={[11, 12]}
          label="Cancellation Policy"
          open={showPolicy}
          onClick={() => setShowPolicy(!showPolicy)}
        />
        <StripButton
          icon={`${RESULTS_IMG}/c-amenities.svg`}
          iconSize={[18, 18]}
          label="Amenities"
          open={showAmenities}
          onClick={() => setShowAmenities(!showAmenities)}
        />
        <StripButton
          icon={`${RESULTS_IMG}/c-chevron.svg`}
          iconSize={[6, 9]}
          label="View stops"
          open={showStops}
          onClick={() => setShowStops(!showStops)}
        />
        <span className="text-xs font-bold text-[#45464f] sm:text-sm">{bus.seatsLeft} Seats Left</span>
      </div>

      {showPolicy && <CancellationPolicyPanel request={bus.seatLayoutRequest} />}

      {showAmenities && <AmenitiesPanel request={bus.seatLayoutRequest} />}
      {showStops && (
        <div className="grid gap-4 border-t border-[rgba(198,197,209,0.2)] px-4 py-3 text-sm sm:grid-cols-2 sm:px-6">
          {[["Boarding points", bus.pickups], ["Drop-off points", bus.drops]].map(([label, points]) => (
            <div key={label}>
              <h3 className="mb-2 font-bold">{label}</h3>
              {points.length ? (
                <ul>
                  {points.map(({ name, time }, index) => (
                    <li className="flex gap-2" key={index}><span className="font-semibold">{time}</span>{name}</li>
                  ))}
                </ul>
              ) : <p>No stops listed.</p>}
            </div>
          ))}
        </div>
      )}
      {expanded && <SeatLayoutPanel bus={bus} />}
    </article>
  );
}
