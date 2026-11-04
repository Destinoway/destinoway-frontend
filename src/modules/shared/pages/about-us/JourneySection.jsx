"use client";

import Image from "next/image";

export default function JourneySection() {
  return (
    <section className="bg-[#edf2f5] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <span className="mb-2 block text-xl font-medium text-[#2b8cb0] md:text-2xl">
              Journey
            </span>

            <h2 className="mb-6 text-3xl font-bold text-[#1f1f1f] md:text-4xl lg:text-5xl">
              Our Journey
            </h2>

            <p className="text-base leading-relaxed text-[#4a4a4a] md:text-lg">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC.
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC.
              <br />
              <br />
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC.
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC.
              <br />
              <br />
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC.
            </p>
          </div>

          {/* Image */}
          <div>
            <div className="relative h-[250px] w-full overflow-hidden rounded-2xl shadow-lg sm:h-[350px] md:h-[450px]">
              <Image
                src="/images/journeySectionimage.webp" // apni image ka path yahan do
                alt="Our Journey"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
