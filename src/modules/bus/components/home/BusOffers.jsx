"use client";

import { OFFER_FILTERS, OFFERS } from "@/modules/bus/data/busHomeData";
import { App } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const ARROW_MASK = "url(/images/bus/offer-arrow-mask.png)";

function ArrowButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous offers" : "Next offers"}
      className={`absolute top-1/2 z-10 hidden size-[30px] -translate-y-1/2 cursor-pointer items-center justify-center min-[1330px]:flex ${
        direction === "prev" ? "-left-11" : "-right-11"
      }`}
    >
      <span
        className={`block size-[30px] bg-[#1e1e1e] ${direction === "prev" ? "rotate-90" : "-rotate-90"}`}
        style={{
          maskImage: ARROW_MASK,
          WebkitMaskImage: ARROW_MASK,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </button>
  );
}

function OfferCard({ offer, onCopy }) {
  return (
    <article
      className="relative flex h-[198px] w-[280px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border p-[17px] drop-shadow-[1px_2px_5.35px_rgba(0,0,0,0.1)] md:w-auto md:min-w-[260px] md:flex-1"
      style={{ backgroundImage: offer.gradient, borderColor: offer.border }}
    >
      {offer.shadows.map((s) => (
        <Image
          key={s.src}
          src={s.src}
          alt=""
          width={s.style.width}
          height={s.style.height}
          className="pointer-events-none absolute"
          style={s.style}
        />
      ))}
      <Image
        src={offer.art.src}
        alt=""
        width={offer.art.w}
        height={offer.art.h}
        sizes="200px"
        className="pointer-events-none absolute object-cover"
        style={offer.art.style}
      />

      <div className="relative flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span
            className="flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] leading-[16.5px] font-bold tracking-[0.275px] text-white uppercase"
            style={{ backgroundColor: offer.tagBg }}
          >
            {offer.tagIcon && <Image src={offer.tagIcon} alt="" width={11} height={10.5} />}
            {offer.tag}
          </span>
          <span className="text-[11px] leading-[16.5px] font-medium text-[#64748b]">{offer.validTill}</span>
        </div>
        <h3 className="pt-1 text-base leading-[22px] font-bold text-[#0f172a]">{offer.title}</h3>
        <p className="max-w-[230px] text-xs leading-4 text-[#475569]">{offer.text}</p>
      </div>

      <div className="relative w-fit border-t pt-[13px]" style={{ borderColor: offer.divider }}>
        <button
          type="button"
          onClick={() => onCopy(offer.code)}
          title="Copy code"
          className="cursor-pointer rounded border border-dashed bg-white px-[11px] py-[5px] font-mono text-[11px] leading-4 font-semibold tracking-[0.6px] text-[#1e293b] sm:text-xs"
          style={{ borderColor: offer.codeBorder }}
        >
          {offer.code}
        </button>
      </div>
    </article>
  );
}

export default function BusOffers() {
  const { message } = App.useApp();
  const [filter, setFilter] = useState("all");
  const trackRef = useRef(null);

  const visible = filter === "all" ? OFFERS : OFFERS.filter((o) => o.category === filter);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth / 2), behavior: "smooth" });
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      message.success({ content: `Code ${code} copied`, key: "offer-copy" });
    } catch {
      message.info({ content: `Use code ${code} at checkout`, key: "offer-copy" });
    }
  };

  return (
    <section className="mx-auto mt-6 w-full max-w-[1233px] px-2.5 sm:px-4">
      <div className="relative flex flex-col gap-6 rounded-[14px] bg-[rgba(226,145,16,0.18)] px-4 py-[18px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Image src="/images/bus/offers-tag.svg" alt="" width={18.31} height={18.33} />
              <h2 className="text-2xl leading-8 font-bold text-[#0f172a]">Offers For You</h2>
            </div>
            <p className="text-sm leading-5 text-[#64748b]">
              Explore hot verified promo codes, cashback, and exclusive fleet discounts.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {OFFER_FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.key)}
                  className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-[15px] py-[7px] text-xs leading-4 whitespace-nowrap ${
                    active
                      ? "bg-[#ba611e] font-bold text-white"
                      : "border border-[#e2e8f0] bg-white font-semibold text-[#334155] hover:border-[#ba611e]"
                  }`}
                >
                  {f.icon && <Image src={f.icon} alt="" width={13.42} height={11.08} />}
                  {f.label}
                </button>
              );
            })}
            <Link
              href="/gift-cards"
              className="shrink-0 pl-2 text-xs leading-4 font-bold whitespace-nowrap text-[#d32f2f] hover:underline"
            >
              View All Offers →
            </Link>
          </div>
        </div>

        <div className="relative">
          <ArrowButton direction="prev" onClick={() => scroll(-1)} />
          <div
            ref={trackRef}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((offer) => (
              <OfferCard key={offer.id} offer={offer} onCopy={copyCode} />
            ))}
          </div>
          <ArrowButton direction="next" onClick={() => scroll(1)} />
        </div>
      </div>
    </section>
  );
}
