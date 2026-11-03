"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

export default function GiftCardSlider({ giftCards = [] }) {
  const [swiper, setSwiper] = useState(null);

  const getModuleName = (modules = []) => {
    return modules
      .map((module) => module.charAt(0).toUpperCase() + module.slice(1))
      .join(" & ");
  };

  const getDiscountText = (card) => {
    if (card.discountType === "percent") {
      return `${card.discountValue}% Off`;
    }

    if (card.discountType === "flat") {
      return `₹${card.discountValue} Off`;
    }

    return `${card.discountValue} Off`;
  };

  return (
    <section className="background-color-bg w-full py-4 sm:py-5">
      <div className="mx-auto w-full max-w-[1400px] px-2 sm:px-4 lg:px-17">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#05144B] sm:text-[19px] lg:text-[20px]">
              Gift Cards
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
              Exclusive offers & discounts
            </p>
          </div>

          {giftCards.length > 1 && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                aria-label="Previous gift cards"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-[#05144B] shadow-sm transition-all hover:bg-gray-50 active:scale-95 sm:h-8 sm:w-8"
              >
                <ChevronLeft size={15} className="sm:h-[17px] sm:w-[17px]" />
              </button>

              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                aria-label="Next gift cards"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-[#05144B] shadow-sm transition-all hover:bg-gray-50 active:scale-95 sm:h-8 sm:w-8"
              >
                <ChevronRight size={15} className="sm:h-[17px] sm:w-[17px]" />
              </button>
            </div>
          )}
        </div>

        {!giftCards.length ? (
          <div className="w-full rounded-md border border-[#e7e7e7] bg-white text-center shadow-[0_2px_6px_rgba(0,0,0,0.08)] sm:w-[calc(50%-5px)] md:w-[calc(50%-6px)] lg:w-[calc(33.333333%-8px)] xl:w-[calc(25%-9px)]">
            <div className="flex h-[100px] items-center justify-center bg-gray-50 text-sm text-gray-500 sm:h-[125px] md:h-[140px] lg:h-[170px]">
              No gift card offers are available right now.
            </div>
            <div className="h-[52px] bg-white sm:h-[60px]" aria-hidden="true" />
          </div>
        ) : <div className="gift-card-swiper">
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiper}
            spaceBetween={10}
            slidesPerView="auto"
            allowTouchMove={true}
            simulateTouch={true}
            loop={giftCards.length > 4}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              /* MOBILE */

              0: {
                spaceBetween: 10,
              },

              640: {
                spaceBetween: 10,
              },

              768: {
                spaceBetween: 12,
              },

              1024: {
                spaceBetween: 12,
              },

              1280: {
                spaceBetween: 12,
              },
            }}
          >
            {giftCards.map((card) => (
              <SwiperSlide key={card._id}>
                <div className="group relative w-full overflow-hidden rounded-[6px] border border-[#e7e7e7] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_5px_12px_rgba(0,0,0,0.14)]">
                  <div className="relative h-[100px] w-full overflow-hidden sm:h-[125px] md:h-[140px] lg:h-[170px]">
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={card.title || "Gift Card"}
                        fill
                        quality={75}
                        sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33.33vw, 25vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        <span className="text-xs text-gray-400">Gift Card</span>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
                      <svg
                        className="absolute -top-[10px] -left-[17px] h-[130px] w-[130px]"
                        viewBox="0 0 130 130"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M-25 125 L105 -25"
                          stroke="#e60000"
                          strokeWidth="9"
                          fill="none"
                        />

                        <path
                          d="M-25 129 L109 -25"
                          stroke="#a90000"
                          strokeWidth="2"
                          fill="none"
                        />

                        <path
                          d="M-22 121 L101 -22"
                          stroke="#ff4545"
                          strokeWidth="1.5"
                          fill="none"
                          opacity="0.9"
                        />

                        <g transform="rotate(-48 46 48)">
                          <path d="M45 47 C38 35 24 31 18 36 C12 41 19 51 29 55 C35 57 41 53 47 49 Z" fill="#e00000" />

                          <path d="M44 48 C35 39 24 37 20 40 C25 46 34 51 44 52 Z" fill="#ad0000" />

                          <path d="M40 43 C33 37 25 36 22 39 C28 40 35 44 41 47 Z" fill="#ff3b3b" opacity="0.75" />

                          <path d="M47 48 C56 35 70 32 77 37 C84 42 77 52 67 56 C60 58 53 53 45 49 Z" fill="#d90000" />

                          <path d="M49 48 C57 39 69 37 74 41 C69 47 59 52 49 53 Z" fill="#a90000" />

                          <path d="M52 45 C59 39 69 38 73 41 C67 42 59 47 52 49 Z" fill="#ff3838" opacity="0.7" />

                          <path d="M44 52 L30 78 L40 72 L42 85 L52 54 Z" fill="#cf0000" />

                          <path d="M44 55 L34 76 L41 70 L43 79 Z" fill="#a90000" opacity="0.65" />

                          <path d="M51 53 L66 78 L63 68 L77 73 L55 49 Z" fill="#df0000" />

                          <path d="M54 55 L66 73 L63 65 Z" fill="#ff3636" opacity="0.7" />

                          <ellipse
                            cx="47"
                            cy="49"
                            rx="7"
                            ry="6"
                            fill="#a90000"
                          />

                          <ellipse
                            cx="46"
                            cy="48"
                            rx="5"
                            ry="4.5"
                            fill="#df0000"
                          />

                          <ellipse
                            cx="44.5"
                            cy="46.5"
                            rx="2"
                            ry="1.5"
                            fill="#ff5959"
                          />
                        </g>

                        <circle cx="46" cy="48" r="5" fill="#cf0000" />

                        <circle cx="45" cy="47" r="2" fill="#ff4444" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex min-h-[52px] flex-col justify-center bg-white px-[8px] pt-[2px] !pb-[1px] sm:min-h-[60px] sm:px-[9px] sm:pt-[2px] sm:pb-[6px]">
                    <p className="!sm:text-[11px] !text-[15px] text-[#777]">
                      Great Offer deal
                    </p>

                    <p className="!text-[16px] leading-[1px] font-medium text-[#222] sm:text-[11px]">
                      {card.title}{" "}
                      <span className="font-semibold text-[#f01414]">
                        {getDiscountText(card)}
                      </span>{" "}
                      on {getModuleName(card.applicableModules)}
                    </p>

                    <p className="!text-[14px] leading-[13px] text-[#222] sm:text-[10px] sm:leading-[14px]">
                      Gift Card
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>}
      </div>
    </section>
  );
}
