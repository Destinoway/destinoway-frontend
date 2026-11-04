"use client";

import { GiftOutlined } from "@ant-design/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

export function GiftCardsHeader({ children }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[19px] text-amber-500">
          <GiftOutlined />
        </span>
        <div>
          <h2 className="text-[18px] leading-tight font-bold text-(--theme-text-primary) sm:text-[20px]">
            Gift Cards
          </h2>
          <p className="mt-0.5 text-[12px] text-gray-500 sm:text-[13px]">
            Exclusive offers &amp; discounts
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

const navButtonClass =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-(--theme-secondary) shadow-sm transition-all hover:border-(--theme-secondary)/40 hover:shadow-md active:scale-95";

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
    <section className="background-color-bg w-full py-6 sm:py-8">
      <div className="mx-auto w-[94%] md:w-[92%] lg:w-[94%] xl:w-[82%]">
        <GiftCardsHeader>
          {giftCards.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                aria-label="Previous gift cards"
                className={navButtonClass}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                aria-label="Next gift cards"
                className={navButtonClass}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </GiftCardsHeader>

        {!giftCards.length ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-6 text-sm text-gray-500 sm:px-6">
            <GiftOutlined className="text-[20px] text-gray-400" />
            No gift card offers are available right now.
          </div>
        ) : (
          <div className="gift-card-swiper">
            <Swiper
              modules={[Autoplay]}
              onSwiper={setSwiper}
              spaceBetween={12}
              slidesPerView="auto"
              allowTouchMove={true}
              simulateTouch={true}
              // Swiper loop needs roughly 2x the visible slides (4 on desktop).
              loop={giftCards.length > 8}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                0: { spaceBetween: 12 },
                768: { spaceBetween: 14 },
                1280: { spaceBetween: 16 },
              }}
            >
              {giftCards.map((card) => (
                <SwiperSlide key={card._id} className="!h-auto pb-2">
                  <div className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                    <div className="relative h-[150px] w-full overflow-hidden sm:h-[150px] lg:h-[165px] xl:h-[175px]">
                      {card.image ? (
                        <Image
                          src={card.image}
                          alt={card.title || "Gift Card"}
                          fill
                          quality={75}
                          sizes="(max-width: 639px) 86vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                          loading="lazy"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-linear-to-br from-amber-50 to-slate-100">
                          <GiftOutlined className="text-[34px] text-amber-400" />
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0" />

                      {/* Gift ribbon in the top-left corner */}
                      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                        <svg
                          className="absolute -top-[10px] -left-[17px] h-[130px] w-[130px]"
                          viewBox="0 0 130 130"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
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
                            <path
                              d="M45 47 C38 35 24 31 18 36 C12 41 19 51 29 55 C35 57 41 53 47 49 Z"
                              fill="#e00000"
                            />
                            <path
                              d="M44 48 C35 39 24 37 20 40 C25 46 34 51 44 52 Z"
                              fill="#ad0000"
                            />
                            <path
                              d="M40 43 C33 37 25 36 22 39 C28 40 35 44 41 47 Z"
                              fill="#ff3b3b"
                              opacity="0.75"
                            />
                            <path
                              d="M47 48 C56 35 70 32 77 37 C84 42 77 52 67 56 C60 58 53 53 45 49 Z"
                              fill="#d90000"
                            />
                            <path
                              d="M49 48 C57 39 69 37 74 41 C69 47 59 52 49 53 Z"
                              fill="#a90000"
                            />
                            <path
                              d="M52 45 C59 39 69 38 73 41 C67 42 59 47 52 49 Z"
                              fill="#ff3838"
                              opacity="0.7"
                            />
                            <path
                              d="M44 52 L30 78 L40 72 L42 85 L52 54 Z"
                              fill="#cf0000"
                            />
                            <path
                              d="M44 55 L34 76 L41 70 L43 79 Z"
                              fill="#a90000"
                              opacity="0.65"
                            />
                            <path
                              d="M51 53 L66 78 L63 68 L77 73 L55 49 Z"
                              fill="#df0000"
                            />
                            <path
                              d="M54 55 L66 73 L63 65 Z"
                              fill="#ff3636"
                              opacity="0.7"
                            />
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

                      <span className="absolute top-3 right-3 z-20 rounded-full bg-[#e11d2e] px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(225,29,46,0.35)]">
                        {getDiscountText(card)}
                      </span>

                      <span className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-(--theme-secondary) uppercase backdrop-blur-sm">
                        <GiftOutlined className="text-[11px]" />
                        Gift Card
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-3.5 py-3">
                      <p className="text-[11px] font-semibold tracking-wide text-amber-600 uppercase">
                        Great Offer Deal
                      </p>
                      <p
                        title={card.title}
                        className="mt-0.5 truncate text-[15px] leading-snug font-bold text-gray-900"
                      >
                        {card.title}
                      </p>
                      {card.applicableModules?.length > 0 && (
                        <p className="mt-1 text-[12px] text-gray-500">
                          <span className="font-semibold text-[#e11d2e]">
                            {getDiscountText(card)}
                          </span>{" "}
                          on {getModuleName(card.applicableModules)}
                        </p>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
