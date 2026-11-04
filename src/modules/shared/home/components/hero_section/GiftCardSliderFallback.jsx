import { GiftCardsHeader } from "./GiftCardSlider";

// Skeleton matching the GiftCardSlider layout while gift cards load.
export default function GiftCardSliderFallback() {
  return (
    <section
      aria-label="Loading gift cards"
      className="background-color-bg w-full py-6 sm:py-8"
    >
      <div className="mx-auto w-[94%] md:w-[92%] lg:w-[94%] xl:w-[82%]">
        <GiftCardsHeader>
          <div className="h-9 w-20 animate-pulse rounded-full bg-gray-200" />
        </GiftCardsHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className={`overflow-hidden rounded-2xl border border-gray-200 bg-white ${item === 1 ? "hidden sm:block" : ""} ${item === 2 ? "hidden lg:block" : ""} ${item === 3 ? "hidden xl:block" : ""}`}
            >
              <div className="h-[150px] animate-pulse bg-gray-200 lg:h-[165px] xl:h-[175px]" />
              <div className="space-y-2 px-3.5 py-3">
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
