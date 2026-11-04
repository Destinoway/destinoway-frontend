"use client";

import Image from "next/image";

export default function TermsBanner() {
  return (
    <section className="relative w-full">
      {/* Banner Image */}
      <div className="!lg:h-[420px] relative h-[220px] w-full overflow-hidden sm:h-[300px] md:h-[400px]">
        <Image
          src="/images/Terms&Conditionsheroimage.webp"
          alt="Terms & Conditions"
          fill
          priority
          className="object-cover"
        />

        {/* Optional Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
            <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Terms & Conditions
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
