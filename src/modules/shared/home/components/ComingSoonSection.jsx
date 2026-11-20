import Image from "next/image";

import bookingData from "./data/Busflightherodata";

export default function ComingSoonSection() {
  return (
    <section className="background-color-bg -mt-2.5 overflow-hidden px-0! sm:px-0! md:px-1! md:py-8 lg:px-1! lg:py-10 xl:px-1! 2xl:px-0!">
      <div className="mx-auto w-full px-1 sm:px-2 lg:w-[87%] xl:w-[86.72%]">
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 md:text-2xl">Coming Soon</h3>
          <p className="mt-2 text-sm text-gray-600">More booking options coming your way</p>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {bookingData.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-24">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-teal-500 px-3 py-1 text-xs font-semibold text-white mb-2">
                    Coming Soon
                  </div>
                  <h3 className="text-base font-bold text-gray-800 md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-600 md:text-sm">
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
