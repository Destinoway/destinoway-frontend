import { RTC_PARTNERS } from "@/modules/bus/data/busHomeData";
import Image from "next/image";

export default function RtcPartners() {
  return (
    <section className="mx-auto mt-0 w-full max-w-[1233px] px-[11px] sm:px-4 md:mt-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1 md:pt-[5.5px]">
          <p className="hidden text-xs leading-4 font-bold tracking-[0.6px] text-[#ba611e] uppercase md:block">
            Official Transport Network
          </p>
          <h2 className="text-xl leading-9 font-extrabold tracking-[-0.75px] text-[#05144b] md:pt-[2.5px] md:text-[30px]">
            Official State RTC &amp; Fleet Partners
          </h2>
          <p className="text-sm leading-5 text-[#5a6588]">
            Book authorized government and premium private intercity operators with zero cancellation fees.
          </p>
        </div>
        <span className="hidden w-fit shrink-0 rounded-lg border border-[#e2e8f0] bg-white px-[13px] py-[7px] text-xs leading-4 font-bold text-[#05144b] md:inline-block">
          22+ Partner Corporations
        </span>
      </div>

      {/* Mobile: compact logo cards in a swipe row */}
      <ul className="-mr-[11px] flex snap-x gap-3 overflow-x-auto px-1 py-3 pr-[11px] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {RTC_PARTNERS.map((p) => (
          <li
            key={p.code}
            className="flex h-[140px] w-[114px] shrink-0 snap-start flex-col items-center justify-center rounded-md border border-[#fcfcfc] bg-white px-2 py-1 text-center text-[#05144b] drop-shadow-[0_0_2px_rgba(0,0,0,0.25)]"
          >
            <Image src={p.logo} alt={`${p.name} logo`} width={41} height={41} className="size-[41px] rounded-full object-cover" />
            <span className="text-xs leading-4 font-extrabold">{p.code}</span>
            <span className="text-[11px] leading-4 font-bold">({p.fullName})</span>
          </li>
        ))}
      </ul>

      {/* Tablet / desktop */}
      <div className="mt-8 hidden gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-5">
        {RTC_PARTNERS.map((p) => (
          <article
            key={p.code}
            className="flex flex-col gap-1 rounded-2xl border border-[#e2e8f0] bg-white p-[21px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center rounded bg-[#f1f5f9] px-2 py-1">
                <Image src={p.logo} alt={`${p.name} logo`} width={38} height={38} className="size-[38px] rounded-full object-cover" />
                <span className="text-xs leading-4 font-extrabold text-[#05144b]">{p.code}</span>
              </div>
              <span className="flex items-center gap-0.5 text-xs leading-4 font-bold text-[#ba611e]">
                <Image src="/images/bus/rtc-star.svg" alt="" width={11.95} height={11.35} />
                {p.rating}
              </span>
            </div>
            <h3 className="pt-2 text-sm leading-5 font-bold text-[#05144b]">{p.name}</h3>
            <p className="text-xs leading-4 text-[#5a6588]">{p.fleet}</p>
            <p className="pt-[3px] pb-3 text-[11px] leading-[16.5px] text-[#64748b]">Popular: {p.popular}</p>
            <div className="mt-auto flex items-center justify-between border-t border-[#f1f5f9] pt-[13px] text-xs leading-4 font-bold text-[#ba611e]">
              View Schedules
              <Image src="/images/bus/rtc-arrow.svg" alt="" width={7.1} height={2.81} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
