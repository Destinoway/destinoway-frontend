import { CABIN_CLASSES } from "@/modules/bus/data/busHomeData";
import Image from "next/image";

export default function CabinClasses() {
  return (
    <section className="mx-auto w-full max-w-[1233px] px-2.5 sm:px-4">
      <div className="px-0 pt-[14px] pb-5 sm:px-4 md:pt-[21px] md:pb-14">
        <p className="pt-[5.5px] text-xs leading-4 font-bold tracking-[0.6px] text-[#ba611e] uppercase">Cabin Classes</p>
        <h2 className="pt-[2.5px] text-[30px] leading-9 font-extrabold tracking-[-0.75px] text-[#05144b]">
          Choose Your Comfort
        </h2>
        <p className="mt-1 text-sm leading-5 text-[#5a6588]">
          Find the coach type that fits your journey style, ergonomics, and budget.
        </p>

        {/* Mobile: horizontal swipe row; sm+: grid */}
        <div className="-mr-2.5 mt-3 flex snap-x snap-mandatory gap-6 overflow-x-auto pr-2.5 pb-4 [scrollbar-width:none] sm:mr-0 sm:mt-8 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pr-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {CABIN_CLASSES.map((c) => (
            <article
              key={c.title}
              className="relative flex w-[274px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-[25px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:w-auto"
            >
              <span
                className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[11px] leading-[16.5px] font-bold ${c.badgeClass}`}
              >
                {c.badge}
              </span>
              <div>
                <span className="flex size-12 items-center justify-center rounded-xl bg-[#fff7ed]">
                  <Image src={c.icon} alt="" width={c.iconSize[0]} height={c.iconSize[1]} />
                </span>
                <h3 className="pt-4 text-lg leading-7 font-bold text-[#05144b]">{c.title}</h3>
                <p className="text-xs leading-4 text-[#5a6588]">{c.subtitle}</p>
                <ul className="flex flex-col gap-[7.5px] pt-4">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs leading-4 text-[#1e293b]">
                      <Image src="/images/bus/class-check.svg" alt="" width={13.47} height={13.47} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#f1f5f9] pt-[13px]">
                <span className="text-xs leading-4 font-bold text-[#5a6588] uppercase">Fare Starts</span>
                <span className="text-lg leading-7 font-extrabold text-[#05144b]">From {c.price}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
