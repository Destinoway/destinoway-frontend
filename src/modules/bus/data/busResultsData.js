export const RESULTS_IMG = "/images/bus/results";

export const DEPARTURE_SLOTS = [
  { key: "dawn", label: "Before 6 AM", chip: "Early (0-6)", icon: `${RESULTS_IMG}/f-dawn.svg`, size: [15, 12], from: 0, to: 6 },
  { key: "morning", label: "6 AM - 12 PM", chip: "Morning (6-12)", icon: `${RESULTS_IMG}/f-morning.svg`, size: [16.5, 16.5], from: 6, to: 12 },
  { key: "afternoon", label: "12 PM - 6 PM", chip: "Afternoon (12-6)", icon: `${RESULTS_IMG}/f-afternoon.svg`, size: [16.5, 16.5], from: 12, to: 18 },
  { key: "night", label: "After 6 PM", chip: "Evening (6-12)", icon: `${RESULTS_IMG}/f-night.svg`, size: [11.25, 15], from: 18, to: 24 },
];

export const BUS_TYPES = ["AC", "Non AC", "Sleeper", "Seater"];

export const AMENITIES = [
  { key: "wifi", label: "Wi-Fi", icon: `${RESULTS_IMG}/f-wifi.svg`, size: [16, 11.33] },
  { key: "charging", label: "Charging", icon: `${RESULTS_IMG}/f-charging.svg`, size: [8, 12] },
  { key: "gps", label: "GPS", icon: `${RESULTS_IMG}/f-gps.svg`, size: [14.6, 14.6] },
  { key: "blankets", label: "Blankets", icon: `${RESULTS_IMG}/f-blanket.svg`, size: [13.33, 9.33] },
];

export const QUICK_FILTERS = [
  { key: "primo", label: "Primo Rated (4.5+)", icon: `${RESULTS_IMG}/q-star.svg`, size: [11.67, 11.08] },
  { key: "electric", label: "100% Electric", icon: `${RESULTS_IMG}/q-bolt.svg`, size: [10.5, 11.67] },
  { key: "window", label: "Single Window Berths", icon: `${RESULTS_IMG}/q-berth.svg`, size: [9.33, 8.17] },
  { key: "female", label: "Female Friendly", icon: `${RESULTS_IMG}/q-female.svg`, size: [6.42, 9.92] },
  { key: "express", label: "Express Highway", icon: `${RESULTS_IMG}/q-highway.svg`, size: [10.5, 10.5] },
];

export const SORTS = [
  { key: "departure", label: "Departure" },
  { key: "duration", label: "Duration" },
  { key: "arrival", label: "Arrival" },
  { key: "rating", label: "Ratings" },
  { key: "price", label: "Price" },
];

// Seat state → icon (Figma seat glyphs, 25.5×22.1).
export const SEAT_ICONS = {
  available: `${RESULTS_IMG}/x-image4.svg`,
  availableMale: `${RESULTS_IMG}/x-image9.svg`,
  availableFemale: `${RESULTS_IMG}/x-image6.svg`,
  bookedMale: `${RESULTS_IMG}/x-image3.svg`,
  bookedFemale: `${RESULTS_IMG}/x-image2.svg`,
  selected: `${RESULTS_IMG}/x-image8.svg`,
};

export const SEAT_LEGEND = [
  { label: "Selected", state: "selected", icon: `${RESULTS_IMG}/x-legend0.svg`, size: [27, 18] },
  { label: "Available", state: "available", icon: `${RESULTS_IMG}/x-image1.svg`, size: [18, 15] },
  { label: "Available Only For Male", state: "availableMale", icon: `${RESULTS_IMG}/x-legend1.svg`, size: [27, 18] },
  { label: "Available Only For Female", state: "availableFemale", icon: `${RESULTS_IMG}/x-legend2.svg`, size: [27, 18] },
  { label: "Booked By Male", state: "bookedMale", icon: `${RESULTS_IMG}/x-legend3.svg`, size: [16.1, 18] },
  { label: "Booked By Female", state: "bookedFemale", icon: `${RESULTS_IMG}/x-legend4.svg`, size: [16.1, 18] },
];

export const MAX_SEATS = 6;
export const GST_RATE = 0.05;
export const TOLL_PASS = 20;

const OPERATORS = [
  { name: "Zingbus Plus Electric", short: "Zingbus Electric", coach: "Volvo 9600 Multi-Axle AC Sleeper (2+1)", types: ["AC", "Sleeper"], tags: ["electric", "express", "window"], route: "Non-Stop Express" },
  { name: "Mahalaxmi Super Deluxe", short: "Mahalaxmi Travels", coach: "BharatBenz AC Sleeper 2+1 (Double Deck)", types: ["AC", "Sleeper"], tags: ["female", "window"], route: "Via Gurgaon IFFCO" },
  { name: "RSRTC Volvo Express", short: "RSRTC (Rajasthan Govt)", coach: "Volvo B11R AC Seater (2+2)", types: ["AC", "Seater"], tags: ["express"], route: "Via Shahpura" },
  { name: "NueGo Electric Green", short: "NueGo Electric Green", coach: "Electric AC Seater (2+2)", types: ["AC", "Seater"], tags: ["electric", "female"], route: "Non-Stop Express" },
  { name: "Goldline Super Deluxe", short: "Goldline Super Deluxe", coach: "Ashok Leyland Non-AC Sleeper (2+1)", types: ["Non AC", "Sleeper"], tags: ["window"], route: "Via Behror" },
  { name: "Shrinath Travels", short: "Shrinath Travels", coach: "Scania Multi-Axle AC Semi-Sleeper (2+2)", types: ["AC", "Seater"], tags: ["express", "female"], route: "Via Kotputli" },
  { name: "Jain Travels Non-AC", short: "Jain Travels", coach: "Tata Non-AC Seater (2+2)", types: ["Non AC", "Seater"], tags: [], route: "Via Neemrana" },
];

const PICKUPS = [
  { name: "Sindhi Camp Central", address: "Main Bus Terminal, Station Road, Sindhi Camp" },
  { name: "Narayan Singh Circle", address: "Opp. SMS Hospital Gate, Tonk Road" },
  { name: "200 Feet Bypass Ajmer Rd", address: "Near Heerapura Power House, Ajmer Road" },
  { name: "Transport Nagar", address: "Agra Road, Near Transport Nagar Chowk" },
  { name: "Durgapura", address: "Durgapura Flyover, Tonk Road" },
  { name: "Sitapura", address: "Sitapura Industrial Area, Near JECRC" },
];

const DROPS = [
  { name: "Kashmiri Gate ISBT", address: "Platform 34, Kashmiri Gate ISBT, Delhi" },
  { name: "Dhaula Kuan", address: "Dhaula Kuan Metro Gate 2, Ring Road Bus Stop" },
  { name: "IFFCO Chowk", address: "Near IFFCO Chowk Metro Station Exit, MG Road, Gurgaon" },
  { name: "Mahipalpur", address: "Radisson Blu Hotel / Aerocity Flyover Corner" },
  { name: "Karol Bagh", address: "Pusa Road, Near Karol Bagh Metro" },
];

const AMENITY_SETS = [
  ["wifi", "charging", "gps", "blankets"],
  ["charging", "gps", "blankets"],
  ["wifi", "charging", "gps"],
  ["charging", "gps"],
  ["gps"],
];

// Small deterministic PRNG so the same search always renders the same buses
// (and server/client markup match).
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) + 1;
}

const pad = (n) => String(n).padStart(2, "0");
export const toClock = (mins) => `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;
export const toDuration = (mins) => `${pad(Math.floor(mins / 60))}h ${pad(mins % 60)}m`;

const ROWS = ["A", "B", "C", "D"];
// Seater coaches: 12 seats per row, ids like "3A". Sleeper coaches: 7 berths
// per row, ids like "A3" (Figma "Bus Sleeper Container").
const LAYOUTS = {
  seater: { cols: 12, id: (row, col) => `${col}${row}` },
  sleeper: { cols: 7, id: (row, col) => `${row}${col}` },
};

function buildDeck(rand, femaleBias, layout) {
  const { cols, id } = LAYOUTS[layout];
  const seats = [];
  for (const row of ROWS) {
    for (let col = 1; col <= cols; col++) {
      const r = rand();
      let state = "available";
      if (r < 0.22) state = "bookedMale";
      else if (r < 0.22 + 0.14 * femaleBias) state = "bookedFemale";
      else if (r < 0.5) state = "availableMale";
      else if (r < 0.58 + 0.06 * femaleBias) state = "availableFemale";
      seats.push({ id: id(row, col), row, col, state });
    }
  }
  return seats;
}

// ---- Coupons & fare breakdown (shared by seat panel and booking page) ----

export const COUPONS = [
  {
    code: "ATBUS",
    title: "Flat 6% instant operator discount",
    short: "Flat 6% instant operator discount",
    calc: (base) => Math.round(base * 0.06),
  },
  {
    code: "DESTINOFEST",
    title: "Flat ₹150 OFF on ICICI / HDFC NetBanking & Cards",
    minFare: 999,
    calc: () => 150,
  },
  {
    code: "FIRSTBUS",
    title: "Flat 10% OFF for first-time Destinoway bookings",
    calc: (base) => Math.min(120, Math.round(base * 0.1)),
  },
];

export const findCoupon = (code) => COUPONS.find((c) => c.code === code?.trim().toUpperCase());

export function fareBreakdown(seatCount, price, couponCode) {
  const base = seatCount * price;
  const gst = Math.round(base * GST_RATE);
  const coupon = findCoupon(couponCode);
  const eligible = coupon && (!coupon.minFare || base >= coupon.minFare);
  const discount = eligible ? Math.min(coupon.calc(base), base) : 0;
  return { base, gst, discount, coupon: eligible ? coupon : null, total: base + gst - discount };
}

export const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

function buildPoints(list, rand, startMins, dayLabel) {
  let t = startMins;
  return list.map((p, i) => {
    t += i === 0 ? 0 : 20 + Math.floor(rand() * 25);
    return { id: `${p.name}-${i}`, ...p, time: toClock(t), day: dayLabel };
  });
}

/**
 * @param {{from:string,to:string,date:string}} q  date = YYYY-MM-DD
 */
export function generateBuses({ from, to, date }) {
  const rand = rng(hashString(`${from}|${to}|${date}`));
  const count = 14 + Math.floor(rand() * 6);
  const day = new Date(`${date}T00:00:00`);
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const fmtDay = (d) => `${fmt(d)}, ${d.toLocaleDateString("en-GB", { weekday: "short" })}`;

  return Array.from({ length: count }, (_, i) => {
    const op = OPERATORS[i % OPERATORS.length];
    const dep = (Math.floor(rand() * 24 * 4) * 15) % (24 * 60);
    const duration = 260 + Math.floor(rand() * 26) * 10;
    const arr = dep + duration;
    const arrDate = new Date(day);
    arrDate.setDate(day.getDate() + Math.floor(arr / (24 * 60)));
    const base = op.types.includes("Non AC") ? 399 : op.types.includes("Sleeper") ? 649 : 499;
    const price = base + Math.floor(rand() * 18) * 25;
    const rating = Math.round((3.8 + rand() * 1.15) * 10) / 10;
    const femaleBias = op.tags.includes("female") ? 1.6 : 1;
    const layout = op.types.includes("Sleeper") ? "sleeper" : "seater";
    const lower = buildDeck(rand, femaleBias, layout);
    const upper = layout === "sleeper" ? buildDeck(rand, femaleBias, layout) : null;
    const seatsLeft = [...lower, ...(upper || [])].filter((s) => s.state.startsWith("available")).length;
    const tags = [...op.tags];
    if (rating >= 4.5) tags.push("primo");
    const pickups = PICKUPS.slice(0, 3 + Math.floor(rand() * 3));
    const drops = DROPS.slice(0, 3 + Math.floor(rand() * 2));

    return {
      id: `bus-${i + 1}`,
      operator: op.name,
      operatorShort: op.short,
      coach: op.coach,
      types: op.types,
      tags,
      routeNote: op.route,
      rating,
      reviews: 400 + Math.floor(rand() * 2400),
      depMins: dep,
      arrMins: arr,
      duration,
      depTime: toClock(dep),
      arrTime: toClock(arr),
      depDate: fmtDay(day),
      arrDate: fmtDay(arrDate),
      price,
      originalPrice: price + 75 + Math.floor(rand() * 6) * 25,
      freeCancellation: rand() > 0.35,
      amenities: AMENITY_SETS[Math.floor(rand() * AMENITY_SETS.length)],
      boardingPoint: pickups[0].name,
      dropPoint: drops[drops.length > 1 ? 1 : 0].name,
      pickups: buildPoints(pickups, rand, dep - 30 < 0 ? dep : dep - 30, fmt(day)),
      drops: buildPoints(drops, rand, arr % (24 * 60), fmt(arrDate)),
      layout,
      decks: upper ? { lower, upper } : { lower },
      seatsLeft,
      cashback: rand() > 0.4 ? 50 : 0,
    };
  });
}

// Counts for the sidebar ("Sindhi Camp Central 78" etc.).
export function countBy(buses, pick) {
  const map = new Map();
  for (const b of buses) for (const v of [].concat(pick(b))) map.set(v, (map.get(v) || 0) + 1);
  return [...map.entries()].map(([label, count]) => ({ label, count }));
}
