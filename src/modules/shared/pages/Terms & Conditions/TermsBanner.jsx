"use client";

import Image from "next/image";

export default function TermsBanner() {
  return (
    <section className="relative w-full">
      {/* Banner Image */}
      <div className="relative h-55 sm:h-75 md:h-100 !lg:h-[420px] w-full overflow-hidden">
        <Image
          src="/images/Terms&ConditionsHeroimage.jpg"
          alt="Terms & Conditions"
          fill
          priority
          className="object-cover"
        />

        {/* Optional Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
            <h1 className="text-white font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Terms & Conditions
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}