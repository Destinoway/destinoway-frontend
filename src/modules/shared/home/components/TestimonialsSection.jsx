"use client";

import { MessageOutlined } from "@ant-design/icons";
import { Rate } from "antd";
import Image from "next/image";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { testimonials } from "./data/TestimonialData";

export default function TestimonialsSection() {
  return (
    <section className="background-color-bg px-0! pt-10 pb-8 sm:px-0! md:px-2! md:pt-12 md:pb-10 lg:px-3! lg:pt-16 lg:pb-12 xl:px-4! 2xl:px-26!">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-2">
          <div>
            <p className="text-[21px] font-semibold text-[#1F7AA3]">
              Our Testimonial
            </p>

            <h2 className="mt-1 max-w-137.5 text-[24px] leading-[1.15] font-bold md:text-[30px] lg:text-[36px]">
              Real Feedback from Our Happy Travelers Worldwide
            </h2>
          </div>

          <div className="lg:pl-8">
            <p className="max-w-125 text-[19px] leading-6 text-gray-600">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC.
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="mt-8 lg:mt-14">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            allowTouchMove={true}
            simulateTouch={true}
            // loop={testimonials.length > 3}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="pt-12 pb-4">
                  <div className="relative flex min-h-80 flex-col rounded-[22px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)] sm:min-h-85 lg:min-h-90">
                    {/* Profile Image */}
                    <div className="absolute -top-10 left-6 z-10">
                      <div className="relative h-18.5 w-18.5 overflow-hidden rounded-full border-4 border-white shadow-md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="74px"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 px-6 pt-16 pb-5">
                      <div className="flex items-center justify-between">
                        <Rate
                          disabled
                          defaultValue={5}
                          className="text-[16px]"
                        />

                        <MessageOutlined className="text-[42px] text-[#1F7AA3]" />
                      </div>

                      <p className="mt-4 text-[15px] leading-7 font-medium text-[#222] sm:text-[16px]">
                        &ldquo;{item.review}&rdquo;
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-2 border-t border-gray-200 px-6 py-4">
                      <h3 className="text-[18px] font-bold text-[#222] sm:text-[20px]">
                        {item.name}
                      </h3>

                      <span className="text-[15px] text-gray-500">
                        {item.country}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
