import BusResults from "@/modules/bus/components/results/BusResults";
import dayjs from "dayjs";

const one = (v) => (Array.isArray(v) ? v[0] : v) || "";

function normalize(sp) {
  const from = one(sp.from).trim() || "Jaipur, Sindhi Camp";
  const to = one(sp.to).trim() || "Delhi, Kashmiri Gate";
  const raw = one(sp.date);
  const parsed = dayjs(raw, "YYYY-MM-DD");
  const today = dayjs().startOf("day");
  const date = parsed.isValid() && !parsed.isBefore(today, "day") ? parsed.format("YYYY-MM-DD") : today.format("YYYY-MM-DD");
  return { from, to, date };
}

export async function generateMetadata({ searchParams }) {
  const { from, to } = normalize(await searchParams);
  const a = from.split(",")[0];
  const b = to.split(",")[0];
  return {
    title: `${a} to ${b} Bus Tickets | Destinoway`,
    description: `Compare buses from ${a} to ${b}: timings, fares, seat availability, boarding and drop points.`,
    robots: { index: false, follow: true },
  };
}

export default async function BusSearchPage({ searchParams }) {
  const query = normalize(await searchParams);
  return <BusResults query={query} />;
}
