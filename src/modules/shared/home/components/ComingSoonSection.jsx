import Image from "next/image";

import bookingData from "./data/Busflightherodata";

export default function ComingSoonSection() {
  return (
    <section className="background-color-bg -mt-2.5 overflow-hidden px-0! sm:px-0! md:px-1! md:pt-12 lg:px-1! lg:pt-16 xl:px-1! 2xl:px-0!">
      <div className="mx-auto w-full px-1 sm:px-2 lg:w-[87%] xl:w-[86.72%]">
        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:gap-10">
          {bookingData.map((item) => (
            <div key={item.id} className="relative">
              {/* Image */}
              <div className="relative h-55 overflow-hidden rounded-xl sm:h-70 md:h-85 lg:h-100 lg:rounded-2xl xl:h-110">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />

                {/* Coming Soon Tag */}
                <div className="absolute top-0 left-0 z-10">
                  <span className="teb-gradient rounded-br-xl px-3 py-2 text-[11px] text-white sm:px-4 sm:py-2 sm:text-sm lg:px-5 lg:py-3 lg:text-base">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Floating Card */}
              <div
                className="absolute bottom-4 left-1/2 w-[92%] -translate-x-1/2 rounded-xl border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:bottom-8 sm:w-[88%] md:bottom-10 md:w-[84%] lg:bottom-14 lg:w-[82%] lg:rounded-2xl xl:bottom-16"
                style={{ padding: "18px 16px" }}
              >
                <div className="text-center">
                  <h3 className="text-lg leading-tight font-bold text-[#222] sm:text-xl lg:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-gray-600 sm:mt-3 sm:text-sm lg:mt-4 lg:text-[15px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
