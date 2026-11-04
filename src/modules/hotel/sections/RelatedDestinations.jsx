import { EnvironmentOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";

const POPULAR_CITIES = [
  "Jaipur",
  "Delhi",
  "Goa",
  "Udaipur",
  "Mumbai",
  "Bangalore",
  "Ahmedabad",
  "Agra",
];

// Grid of links only; the parent section renders the heading.
export default function RelatedDestinations({ currentCity }) {
  const current = String(currentCity || "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  const cities = POPULAR_CITIES.filter(
    (city) => city.toLowerCase() !== current,
  ).slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 lg:grid-cols-3">
      {cities.map((city) => (
        <Link
          key={city}
          href={`/hotels/${city.toLowerCase()}`}
          className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--theme-secondary)/40 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--theme-secondary)/8 text-[15px] text-(--theme-secondary) transition-colors group-hover:bg-(--theme-secondary) group-hover:text-white">
            <EnvironmentOutlined />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-gray-800">
              Hotels in {city}
            </span>
            <span className="block text-xs text-gray-500">
              Explore stays &amp; deals
            </span>
          </span>

          <RightOutlined className="shrink-0 text-[11px] text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-(--theme-secondary)" />
        </Link>
      ))}
    </div>
  );
}
