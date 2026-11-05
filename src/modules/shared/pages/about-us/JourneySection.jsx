"use client";

import Image from "next/image";

export default function JourneySection() {
  return (
    <section className="bg-[#edf2f5] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Content */}
          <div>
            <span className="text-[#2b8cb0] text-xl md:text-2xl font-medium block mb-2">
              Journey
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1f1f1f] mb-6">
              Our Journey
            </h2>

            <p className="text-[#4a4a4a] text-base md:text-lg leading-relaxed">
              Contrary to popular belief, Lorem Ipsum is not simply random
              text. It has roots in a piece of classical Latin literature
              from 45 BC. Contrary to popular belief, Lorem Ipsum is not
              simply random text. It has roots in a piece of classical Latin
              literature from 45 BC.
              <br />
              <br />
              Contrary to popular belief, Lorem Ipsum is not simply random
              text. It has roots in a piece of classical Latin literature
              from 45 BC. Contrary to popular belief, Lorem Ipsum is not
              simply random text. It has roots in a piece of classical Latin
              literature from 45 BC.
              <br />
              <br />
              Contrary to popular belief, Lorem Ipsum is not simply random
              text. It has roots in a piece of classical Latin literature
              from 45 BC.
            </p>
          </div>

          {/* Image */}
          <div>
            <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/journeySectionimage.jpg" // apni image ka path yahan do
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