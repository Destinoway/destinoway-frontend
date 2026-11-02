export default function GiftCardSliderFallback() {
  return (
    <section
      aria-label="Loading gift cards"
      className="background-color-bg w-full py-4 sm:py-5"
    >
      <div className="mx-auto w-full max-w-[1400px] px-2 sm:px-4 lg:px-17">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#05144B] sm:text-[19px] lg:text-[20px]">
              Gift Cards
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
              Exclusive offers &amp; discounts
            </p>
          </div>
          <div className="h-8 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className={`overflow-hidden rounded-[6px] border border-[#e7e7e7] bg-white ${item === 1 ? "hidden sm:block" : ""} ${item === 2 ? "hidden lg:block" : ""} ${item === 3 ? "hidden xl:block" : ""}`}
            >
              <div className="h-[100px] animate-pulse bg-gray-200 sm:h-[125px] md:h-[140px] lg:h-[170px]" />
              <div className="space-y-0 bg-white px-[8px] pt-[2px] pb-[1px] sm:px-[9px] sm:pt-[2px] sm:pb-[6px]">
                <div className="h-[22px] w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-px w-4/5 animate-pulse rounded bg-gray-200" />
                <div className="h-[13px] w-16 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
