"use client";

export default function WishlistSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
        >
          <div className="flex animate-pulse flex-col xl:flex-row">
            {/* IMAGE */}
            <div className="w-full shrink-0 p-2 xl:w-[320px]">
              <div className="h-55 rounded-xl bg-gray-200" />
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col border-t border-[#ECECEC] md:flex-row xl:border-t-0 xl:border-l">
              {/* LEFT */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="mb-3 h-6 w-60 rounded bg-gray-200" />

                  <div className="mb-2 h-4 w-40 rounded bg-gray-200" />
                </div>

                <div className="mt-4 flex gap-2">
                  <div className="h-7 w-20 rounded bg-gray-200" />
                  <div className="h-7 w-28 rounded bg-gray-200" />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-4 w-48 rounded bg-gray-200" />
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-4 w-44 rounded bg-gray-200" />
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col justify-between border-t border-[#ECECEC] p-4 md:w-55 md:border-t-0 md:border-l">
                <div className="ml-auto h-12 w-36.25 rounded bg-gray-200" />

                <div className="mt-10 ml-auto h-10 w-32 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
