import { TRUST_ITEMS, TRUST_ITEMS_MOBILE } from "@/modules/bus/data/busHomeData";
import Image from "next/image";

export default function BusTrustBar() {
  return (
    <section className="mx-auto mt-2 w-full max-w-[1217px] px-2.5 sm:px-4 md:mt-5">
      {/* Mobile: one compact row of four */}
      <ul className="grid grid-cols-4 rounded-2xl border-[0.667px] border-[#e4e4e4] bg-white px-1 py-3 md:hidden">
        {TRUST_ITEMS_MOBILE.map((item, i) => (
          <li
            key={item.title}
            className={`flex flex-col items-center justify-end gap-1 px-1 text-center ${i > 0 ? "border-l border-[#e4e4e4]" : ""}`}
          >
            <Image src={item.icon} alt="" width={item.size} height={item.size} />
            <span className="text-[11px] leading-4 font-medium text-[#05144b] min-[400px]:text-xs">{item.title}</span>
          </li>
        ))}
      </ul>

      {/* Tablet / desktop */}
      <ul className="hidden rounded-xl bg-white drop-shadow-[0_8px_15px_rgba(0,0,0,0.08)] md:grid md:grid-cols-3 lg:grid-cols-6">
        {TRUST_ITEMS.map((item, i) => (
          <li
            key={item.title}
            className={`flex items-start gap-3 border-[rgba(197,198,208,0.49)] px-3.5 py-6 ${i > 0 ? "lg:border-l" : ""} ${
              i % 3 !== 0 ? "max-lg:border-l" : ""
            } ${i >= 3 ? "max-lg:border-t" : ""}`}
          >
            <Image src={item.icon} alt="" width={item.size[0]} height={item.size[1]} className="shrink-0" />
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="text-[13px] leading-5 font-medium text-[#05144b]">{item.title}</h3>
              <p className="text-xs leading-5 text-[#44474f]">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
