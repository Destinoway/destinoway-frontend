import { WHATS_NEW } from "@/modules/bus/data/busHomeData";
import Image from "next/image";

export default function WhatsNew() {
  return (
    <section className="mx-auto mt-6 hidden w-full max-w-[1233px] px-4 pb-12 md:block">
      <h2 className="text-2xl leading-8 font-bold text-[#0f172a]">What&apos;s New on Destinoway</h2>
      <p className="mt-0.5 text-sm leading-5 text-[#64748b]">
        Passenger-first innovations engineered for peace of mind, flexibility, and real-time transit safety.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHATS_NEW.map((item) => (
          <article
            key={item.title}
            className="relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            style={{ backgroundImage: item.gradient }}
          >
            <div className="relative flex flex-col gap-1">
              <span className={`flex size-10 items-center justify-center rounded-xl backdrop-blur-[6px] ${item.iconBox}`}>
                <Image src={item.icon} alt="" width={item.iconSize[0]} height={item.iconSize[1]} />
              </span>
              <h3 className="pt-2 text-lg leading-7 font-bold text-white">{item.title}</h3>
              <p className="text-xs leading-4" style={{ color: item.textColor }}>
                {item.text}
              </p>
            </div>
            <span className="relative flex items-center gap-1 pt-4 text-xs leading-4 font-bold" style={{ color: item.linkColor }}>
              {item.link}
              <Image src={item.arrow} alt="" width={9.33} height={9.33} />
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -bottom-6 size-28 rounded-full blur-[12px]"
              style={{ backgroundColor: item.glow }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
