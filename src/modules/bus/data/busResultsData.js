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

export const SORTS = [
  { key: "departure", label: "Departure" },
  { key: "duration", label: "Duration" },
  { key: "arrival", label: "Arrival" },
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

const pad = (n) => String(n).padStart(2, "0");
export const toDuration = (mins) => `${pad(Math.floor(mins / 60))}h ${pad(mins % 60)}m`;

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

// Counts for the sidebar ("Sindhi Camp Central 78" etc.).
export function countBy(buses, pick) {
  const map = new Map();
  for (const b of buses) for (const v of [].concat(pick(b))) map.set(v, (map.get(v) || 0) + 1);
  return [...map.entries()].map(([label, count]) => ({ label, count }));
}
