
"use client";

import { useWishlist } from "@/modules/wishlist/hooks/useWishlist";
import { CheckOutlined } from "@ant-design/icons";
import { Card, Empty } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import WishlistSkeleton from "../../lodding/WishlistSkeleton";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945";

export default function WishlistTab() {
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  // Wishlist API
  const { data, isLoading } = useWishlist();

  // API data mapping + duplicate destination removal
  const destinations = useMemo(() => {
    const wishlistData = Array.isArray(data?.data)
      ? data.data
      : [];

    const uniqueDestinations = new Map();

    wishlistData.forEach((item) => {
      if (!item?.cityId) return;

      const cityId = String(item.cityId);

      if (!uniqueDestinations.has(cityId)) {
        uniqueDestinations.set(cityId, {
          ...item,
          cityId,
          cityName: item.cityName || "Destination",
          hotelCount: Number(item.hotelCount) || 0,
          coverImage: item.coverImage || DEFAULT_IMAGE,
        });
      }
    });

    return Array.from(uniqueDestinations.values());
  }, [data]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewHotels = (cityId) => {
    router.push(
      `/profile?tab=wishlist-detail&cityId=${encodeURIComponent(cityId)}`
    );
  };

  if (!mounted) {
    return null;
  }

  // Loading
  if (isLoading) {
    return (
      <div className="mt-[-17px] p-2 sm:p-3 md:p-4">
        <div className="mb-2 bg-white px-4 py-2 shadow-sm">
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        <WishlistSkeleton />
      </div>
    );
  }

  // Empty Wishlist
  if (!destinations.length) {
    return (
      <div className="rounded bg-white p-10 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="max-w-md p-8 text-center">
            <Empty
              description="No destinations saved yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />

            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Your Wishlist is Empty
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Save your favourite hotels and destinations to
              quickly access them later.
            </p>

            <button
              onClick={() => router.push("/")}
              className="rounded-lg buttion-background-color px-6 py-3 font-semibold text-white transition"
            >
              Explore Hotels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[-17px] p-2 sm:p-3 md:p-4">
      {/* HEADER */}
      <div className="mb-2 flex flex-col gap-2 bg-white px-4 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="font-roboto my-2! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
          Wishlist
        </h2>
      </div>

      {/* WISHLIST CARDS */}
      <div className="flex flex-col gap-3">
        {destinations.map((item) => (
          <Card
            key={item.cityId}
            onClick={() => handleViewHotels(item.cityId)}
            className="cursor-pointer overflow-hidden !rounded !border !border-[#E2E8F0] !pr-4 shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            <div className="flex flex-col xl:flex-row xl:items-stretch">
              {/* IMAGE */}
              <div className="w-full shrink-0 p-2 xl:w-[200px]">
                <div className="relative h-[160px] w-full overflow-hidden rounded">
                  <Image
                    src={item.coverImage}
                    alt={item.cityName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-1 flex-col border-t border-[#ECECEC] md:flex-row xl:border-t-0 xl:border-l">
                {/* CENTER */}
                <div className="flex flex-1 flex-col justify-between px-3 py-2">
                  {/* DESTINATION NAME */}
                  <div>
                    <h2 className="font-roboto truncate text-[20px] font-bold text-black sm:text-[18px]">
                      {item.cityName}
                    </h2>
                  </div>

                  {/* API DATA */}
                  <div className="font-roboto mt-2 flex flex-wrap gap-2 font-semibold">
                    <span className="rounded-md border px-2 py-1 text-xs">
                      {item.hotelCount} Hotels
                    </span>

                    <span className="rounded-md border px-2 py-1 text-xs">
                      Saved Destination
                    </span>
                  </div>

                  {/* FEATURES */}
                  <div className="mt-4 grid gap-2">
                    <div className="font-roboto flex items-center gap-2">
                      <CheckOutlined
                        style={{ color: "#16A34A" }}
                      />

                      <span>
                        {item.hotelCount} properties saved
                      </span>
                    </div>

                    <div className="font-roboto flex items-center gap-2">
                      <CheckOutlined
                        style={{ color: "#16A34A" }}
                      />

                      <span>Quick access anytime</span>
                    </div>

                    <div className="font-roboto flex items-center gap-2">
                      <CheckOutlined
                        style={{ color: "#16A34A" }}
                      />

                      <span>Compare hotels later</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex flex-col justify-between border-t border-[#ECECEC] px-2 py-2 md:w-[220px] md:border-t-0 md:border-l">
                  {/* SAVED HOTELS */}
                  <div className="ml-auto w-[145px] rounded-[8px] border most-boder-colour px-2 py-1">
                    <div className="flex items-center justify-between">
                      <p className="!m-0 text-[11px] font-semibold most-text-color">
                        Saved Hotels
                      </p>

                      <div className="flex h-[20px] min-w-[28px] items-center justify-center rounded buttion-background-color px-1 text-[10px] font-bold text-white">
                        {item.hotelCount}
                      </div>
                    </div>
                  </div>

                  {/* VIEW HOTELS BUTTON */}
                  <div className="flex flex-col items-end gap-3 !py-3 sm:!py-3 md:!py-0 lg:!py-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewHotels(item.cityId);
                      }}
                      className="rounded-lg px-5 py-2 text-sm font-semibold text-white! transition-all duration-300 hover:-translate-y-0.5 buttion-background-color"
                    >
                      View Hotels
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

