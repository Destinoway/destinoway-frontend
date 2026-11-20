"use client";

export default function AboutContent() {
  return (
    <section className="relative background-color-bg py-10 sm:py-3 md:py-6 lg:py-4 xl:py-8 overflow-hidden">

      {/* Decorative Circle */}
      <div className="absolute left-[8%] top-[20%] hidden lg:block">
        <div className="h-14 w-14 rounded-full border-4 border-white shadow-md opacity-70"></div>
      </div>

      <div className="mx-auto w-full  px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">

        {/* Small Heading */}
        <div className="text-center">
          <span className="inline-block text-[15px] sm:text-xs md:text-sm font-medium uppercase tracking-[4px] md:tracking-[6px] text-gray-700">
            About Us
          </span>
        </div>

        {/* Main Heading */}
        <div className="mx-auto mt-2 max-w-3xl text-center">
          <h2 className="text-[28px] leading-[1.4] font-semibold text-[#222] sm:text-[18px] md:text-[22px] lg:text-[24px] xl:text-[29px]">
            With over{" "}
            <span className="most-text-color">
              7 years of Continuous Dedication
            </span>
            , we are ready to delivering excellence through trust, quality, and
            commitment.
          </h2>
        </div>

        {/* First Paragraph */}
        <div className="mx-auto mt-1 sm:mt-4 md:mt-6 max-w-6xl">
          <p className="font-['Roboto'] font-light text-center text-[13px] leading-8 text-gray-600 sm:text-base sm:leading-8 md:text-lg md:leading-[140%] lg:text-[17px] lg:leading-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset&apos;s Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.
          </p>
        </div>

        {/* Second Paragraph */}
        <div className="mx-auto mt-2 md:mt-4 max-w-6xl">
          <p className="!font-['Roboto'] font-light text-center text-[13px] leading-8 text-gray-600 sm:text-base sm:leading-8 md:text-lg md:leading-[140%] lg:text-[17px] lg:leading-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset&apos;s Body Type sheets
          </p>
        </div>

      </div>
    </section>
  );
}