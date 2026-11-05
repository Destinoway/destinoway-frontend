"use client";

import Image from "next/image";

export default function OfferBanner() {
  return (
    <div className="!sm:-mt-[92px] background-color-bg mx-auto -mt-10 flex items-center justify-center px-1! px-3 py-0 sm:px-1! sm:px-4 sm:py-1 md:-mt-12 md:px-2! md:px-9 md:py-0 lg:-mt-2.5 lg:px-3! xl:px-4! 2xl:px-0!">
      <div className="relative h-65 w-full overflow-hidden rounded-[20px] sm:h-80 sm:rounded-[25px] md:h-95 md:rounded-[20px] lg:h-107.5 lg:w-[85.87%]">
        <Image
          src="/images/cashback_banner.png"
          alt="banner"
          fill
          sizes="(max-width: 1023px) 100vw, 86vw"
          className="object-cover"
        />

        <div className="absolute inset-0 z-10 bg-black/10" />

        <Image
          src="/images/luggage.png"
          alt="luggage"
          width={600}
          height={600}
            sizes="(max-width: 639px) 70px, (max-width: 767px) 100px, (max-width: 1023px) 180px, 280px"
          className="absolute right-1 bottom-0 z-20 h-auto w-17.5 drop-shadow-2xl sm:w-25 md:w-45 lg:w-70"
        />

        <div className="absolute top-2 left-2 z-20 h-12.5 w-12.5 sm:top-4 sm:left-4 sm:h-22.5 sm:w-22.5 md:top-6 md:left-6 md:h-35 md:w-35 lg:top-10 lg:left-10 lg:h-45 lg:w-45">
          <Image
            src="/images/offer.png"
            alt="offer badge"
            fill
            sizes="(max-width: 639px) 50px, (max-width: 767px) 90px, (max-width: 1023px) 140px, 180px"
            className="rotate-[-15deg] object-contain"
          />
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-3 text-center">
          <p className="mb-1 text-[13px] text-gray-200 sm:text-[16px] md:text-[20px] lg:text-[26px]">
            Lowest Deals Are Here
          </p>

          <h1 className="mb-3 text-[20px] leading-tight font-bold text-white sm:text-[28px] md:text-[40px] lg:text-[56px]">
            Cashback Guaranteed
          </h1>

          <p className="mb-4 max-w-[95%] text-[11px] leading-5 text-gray-200 sm:max-w-[85%] sm:text-sm sm:leading-6 md:max-w-xl md:text-[14px] lg:text-base">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>

          <button
            onClick={() =>
              document.getElementById("hero-search")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="text-teb-color! h-8.5 w-35 rounded bg-white text-[13px] font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] sm:h-10 sm:w-42.5 sm:text-[16px] md:h-10.5 md:w-50 md:text-[18px]"
          >
            Start Booking →
          </button>
        </div>
      </div>
    </div>
  );
}
