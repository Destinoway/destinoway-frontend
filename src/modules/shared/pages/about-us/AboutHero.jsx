"use client";

import Image from "next/image";

export default function AboutHero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-70 w-full overflow-hidden sm:h-80 md:h-50 lg:h-75 xl:h-100">
        <Image
          src="/images/heroimage.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(207,207,207,0.8) 0%, rgba(255,255,255,0.45) 45%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div className="absolute top-1/2 left-4 z-10 max-w-175 -translate-y-1/2 sm:left-8 lg:left-[8%]">
          <h1 className="mb-2 text-[32px] leading-tight font-bold text-[#222] sm:text-[32px] md:text-[24px] lg:text-[30px] xl:text-[40px]">
            About Us
          </h1>

          <p className="max-w-137.5 text-[14px] leading-relaxed text-black sm:text-[16px] md:text-[14px] lg:text-[16px]">
            We’re committed to offering more than just
            <br />
            products—we provide exceptional experiences.
          </p>
        </div>
      </section>

      {/* About Content Section */}
      <section className="bg-[#eef3f8] py-10 md:py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-8 md:px-12 lg:px-18 xl:px-23 2xl:px-33">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-14">
            {/* Left Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-65 w-full sm:h-57.5 md:h-80 lg:h-100">
                <Image
                  src="/images/aboutsection.jpg"
                  alt="Destinoway travel experiences"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={70}
                  className="rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Right Content */}
            <div>
              <span className="most-text-color mb-3 block text-base font-medium sm:text-lg">
                destinoway
              </span>

              <h2 className="mb-4 text-[28px] font-bold text-gray-900 sm:text-[36px] md:text-[42px] lg:text-[52px]">
                Know destinoway
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-gray-600 sm:text-[10px] md:text-[13px] lg:text-[15px]">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC. Contrary to popular belief, Lorem Ipsum is not simply
                random text. It has roots in a piece of classical Latin
                literature from 45 BC. Contrary to popular belief, Lorem Ipsum
                is not simply random text. It has roots in a piece of classical
                Latin literature from 45 BC. Contrary to popular belief, Lorem
                Ipsum is not simply random text. It has roots in a piece of
                classical Latin literature from 45 BC. Contrary to popular
                belief, Lorem Ipsum is not simply random text. It has roots in a
                piece of classical Latin literature from 45 BC. Contrary to
                popular belief, Lorem Ipsum is not simply random text. It has
                roots in a piece of classical Latin literature from 45 BC.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
