"use client";

import Image from "next/image";

export default function OfferBanner() {
  return (
    <div className="!sm:-mt-[92px] background-color-bg mx-auto -mt-10 flex items-center justify-center px-1! px-3 py-0 sm:px-1! sm:px-4 sm:py-1 md:-mt-12 md:px-2! md:px-9 md:py-0 lg:-mt-2.5 lg:px-3! xl:px-4! 2xl:px-0!">
      <div className="relative h-65 w-full overflow-hidden rounded-[20px] sm:h-80 sm:rounded-[25px] md:h-95 md:rounded-[20px] lg:h-107.5 lg:w-[85.87%]">
        <Image
          src="/images/cashback_banner.webp"
          alt="banner"
          fill
          sizes="(max-width: 1023px) 100vw, 86vw"
          className="object-cover"
        />

        <div className="absolute inset-0 z-10 bg-black/10" />

        <div className="absolute inset-0 z-20 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-col items-start justify-center">
            <p className="text-[13px] text-gray-100 sm:text-[16px] md:text-[20px] lg:text-[26px]">
              Lowest Deals Are Here
            </p>

            <h1 className="mt-2 text-[20px] leading-tight font-bold text-white sm:text-[28px] md:text-[40px] lg:text-[56px]">
              Cashback Guaranteed
            </h1>

            <p className="mt-3 max-w-xs text-[11px] leading-5 text-gray-100 sm:max-w-sm sm:text-sm sm:leading-6 md:max-w-md md:text-[14px] lg:max-w-lg lg:text-base">
              Get cashback on every booking with Destinoway.
            </p>

            <button
              onClick={() =>
                document.getElementById("hero-search")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="buttion-background-color mt-4 h-10 w-42.5 rounded-lg text-[16px] font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] sm:h-11 sm:w-48 sm:text-[18px] md:h-12 md:w-52 md:text-[18px]"
            >
              Start Booking →
            </button>
          </div>

          <div className="relative h-32 w-32 shrink-0 sm:h-48 sm:w-48 md:h-64 md:w-64">
            <Image
              src="/images/offer.webp"
              alt="offer badge"
              fill
              sizes="(max-width: 639px) 128px, (max-width: 767px) 192px, (max-width: 1023px) 256px, 256px"
              className="rotate-[-15deg] object-contain"
            />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 z-20 h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64">
          <Image
            src="/images/luggage.webp"
            alt="luggage"
            fill
            sizes="(max-width: 639px) 128px, (max-width: 767px) 192px, (max-width: 1023px) 256px, 256px"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
