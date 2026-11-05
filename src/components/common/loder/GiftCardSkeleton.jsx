"use client";

import { Skeleton } from "antd";

export default function GiftCardSkeleton() {
  return (
    <div className="gift-card-skeleton-card w-full overflow-hidden rounded-md border border-[#e7e7e7] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.10)]">
      {/* IMAGE */}

      <Skeleton.Node
        active
        className="block! h-25! w-full! sm:h-31.25! md:h-35! lg:h-42.5!"
      />

      {/* CONTENT */}

      <div className="bg-white px-2 pt-1.5 pb-2 sm:px-2.25">
        {/* LABEL */}

        <Skeleton.Input
          active
          size="small"
          className="mb-1.25! h-3! w-23.75!"
        />

        {/* OFFER */}

        <div className="mt-1">
          <Skeleton.Input active size="small" className="h-4! w-[85%]!" />
        </div>

        {/* GIFT */}

        <div className="mt-1">
          <Skeleton.Input active size="small" className="h-3.25! w-16.25!" />
        </div>
      </div>
    </div>
  );
}
