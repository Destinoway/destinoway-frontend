import Image from "next/image";

export default function GiftCardBanner() {
  return (
    <section className="relative h-55 sm:h-65 md:h-75 lg:h-87.5 w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/GiftCardBanner.webp"
        alt="Gift Cards Banner"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-350 mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-125">
            <h1 className="text-[24px] sm:text-[30px] md:text-[36px] lg:text-[48px] xl:text-[56px] font-bold text-[#1e1e1e] mb-3 md:mb-4 lg:mb-6 leading-tight">
              Gift Cards
            </h1>

            <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] text-[#444] leading-relaxed max-w-105">
              We’re committed to offering more than just products—we
              provide exceptional experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
