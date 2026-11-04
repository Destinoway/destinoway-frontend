import Image from "next/image";

export default function GiftCardBanner() {
  return (
    <section className="relative h-[220px] w-full overflow-hidden sm:h-[260px] md:h-[300px] lg:h-[350px]">
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
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-[500px]">
            <h1 className="mb-3 text-[24px] leading-tight font-bold text-[#1e1e1e] sm:text-[30px] md:mb-4 md:text-[36px] lg:mb-6 lg:text-[48px] xl:text-[56px]">
              Gift Cards
            </h1>

            <p className="max-w-[420px] text-[12px] leading-relaxed text-[#444] sm:text-[14px] md:text-[16px] lg:text-[18px]">
              We’re committed to offering more than just products—we provide
              exceptional experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
