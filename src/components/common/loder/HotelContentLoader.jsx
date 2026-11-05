"use client";

import { Skeleton } from "antd";

export default function HotelContentLoader() {
  return (
    <div className="flex flex-col gap-4 mt-3">

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded bg-white p-4 shadow-md"
        >
          <div className="flex flex-col gap-4 md:flex-row">

            {/* IMAGE */}
            <Skeleton.Image
              active
              className="h-55! w-full! md:w-[320px]!"
            />

            {/* CONTENT */}
            <div className="flex flex-1 flex-col justify-between">

              <div>
                <Skeleton
                  active
                  title={{ width: "60%" }}
                  paragraph={{
                    rows: 3,
                    width: ["80%", "50%", "70%"],
                  }}
                />
              </div>

              <div className="mt-4 flex items-end justify-between">

                <div>
                  <Skeleton.Input
                    active
                    className="mb-2! h-4! w-20!"
                  />

                  <Skeleton.Input
                    active
                    className="h-8! w-28!"
                  />
                </div>

                <Skeleton.Button
                  active
                  className="h-12! w-32! rounded!"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}