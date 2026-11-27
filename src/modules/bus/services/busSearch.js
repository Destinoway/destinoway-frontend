import dayjs from "dayjs";
import { api } from "@/services/axios";

function mapBus(bus, tui, journeyDate) {
  const departure = dayjs(bus.departureTime);
  const arrival = dayjs(bus.arrivalTime);
  const coach = bus.busType || "";
  const types = [];
  if (/\bnon[\s-]*ac\b/i.test(coach)) types.push("Non AC");
  else if (/\bac\b/i.test(coach)) types.push("AC");
  if (/sleeper/i.test(coach)) types.push("Sleeper");
  if (/seater/i.test(coach)) types.push("Seater");

  const pickups = bus.pickups ?? [];
  const drops = bus.dropoffs ?? [];

  return {
    id: `${bus.provider}:${bus.busServiceId}`,
    seatLayoutRequest: { tui, busServiceId: bus.busServiceId, journeyDate, providerCode: bus.provider },
    operator: bus.operatorName,
    operatorShort: bus.operatorName,
    coach,
    types,
    depMins: departure.hour() * 60 + departure.minute(),
    arrivalTimestamp: arrival.valueOf(),
    duration: bus.durationMinutes,
    depTime: departure.format("HH:mm"),
    arrTime: arrival.format("HH:mm"),
    depDate: departure.format("D MMM, ddd"),
    arrDate: arrival.format("D MMM, ddd"),
    price: bus.customerFare,
    seatsLeft: bus.availableSeats,
    freeCancellation: bus.zeroCancellation === true,
    refundable: bus.refundable,
    partialCancellation: bus.partialCancellation,
    boardingPoint: pickups[0]?.address || bus.from,
    dropPoint: drops[0]?.address || bus.to,
    pickups: pickups.map(({ address, time }) => ({ name: address, time })),
    drops: drops.map(({ address, time }) => ({ name: address, time })),
  };
}

export async function searchBuses({ from, to, date }, signal) {
  const config = { signal, timeout: 15000 };
  const readData = ({ data }) => {
    if (!data?.success || !data.data) throw new Error("Bus search failed");
    return data.data;
  };

  let result = readData(await api.post("/bus/search", { from, to, onward: date }, config));
  let tui = result.tui;
  for (let attempt = 0; result.completed === false && attempt < 15; attempt += 1) {
    if (!tui) throw new Error("Missing bus search reference");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    signal.throwIfAborted();
    result = readData(await api.post("/bus/search/results", { tui }, config));
    tui = result.tui || tui;
  }

  if (result.completed === false || !Array.isArray(result.buses)) {
    throw new Error("Bus search results are unavailable");
  }
  return result.buses.map((bus) => mapBus(bus, tui, date));
}

export async function fetchBusAmenities({ tui, busServiceId }, signal) {
  const { data } = await api.post("/bus/amenities", { tui, busServiceId }, { signal, timeout: 15000 });
  if (!data?.success || !Array.isArray(data.data?.amenities)) throw new Error("Bus amenities unavailable");
  if (data.data.amenitiesProvided === false) return [];
  return [...new Set(data.data.amenities
    .map((item) => typeof item === "string" ? item : item?.name)
    .filter((name) => typeof name === "string" && name.trim())
    .map((name) => name.trim()))];
}

export async function fetchBusCancellationPolicy({ tui, busServiceId }, signal) {
  const { data } = await api.post("/bus/cancellation-policy", { tui, busServiceId }, { signal, timeout: 15000 });
  if (!data?.success || !Array.isArray(data.data?.policies)) {
    throw new Error("Bus cancellation policy unavailable");
  }
  return data.data.policies;
}

export async function fetchSeatLayout(request, signal) {
  const { data } = await api.post("/bus/seat-layout", request, { signal, timeout: 15000 });
  if (!data?.success || !Array.isArray(data.data?.seats)) throw new Error("Seat layout unavailable");

  const decks = {};
  for (const seat of data.data.seats) {
    const deck = /upper/i.test(seat.seatType) || Number(seat.zValue) > 0 ? "upper" : "lower";
    const restricted = seat.malesSeat ? "Male" : Number(seat.isLadies) === 1 ? "Female" : "";
    const available = seat.isAvailable && !seat.reservedForSocialDistancing;
    (decks[deck] ??= []).push({
      id: String(seat.seatName),
      key: `${deck}:${seat.seatName}:${seat.rowNo}:${seat.columnNo}`,
      berth: /sleeper|berth/i.test(seat.seatType),
      row: Number(seat.rowNo),
      column: Number(seat.columnNo),
      width: Number(seat.width) || 1,
      height: Number(seat.height) || 1,
      state: available ? `available${restricted}` : "unavailable",
      price: Number(seat.customerFare),
    });
  }

  const mapPoint = (point) => ({
    id: point.buid ?? point.duid,
    name: point.name,
    address: point.address,
    time: dayjs(point.time).format("HH:mm"),
    day: dayjs(point.time).format("D MMM"),
  });

  return {
    decks,
    pickups: (data.data.pickPoints ?? []).map(mapPoint),
    drops: (data.data.dropPoints ?? []).map(mapPoint),
  };
}
