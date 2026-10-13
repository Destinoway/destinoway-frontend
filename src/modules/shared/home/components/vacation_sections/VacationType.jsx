"use client";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import { buildSearchData } from "@/modules/hotel/utils/buildSearchData";
import { navigateToHotels } from "@/modules/hotel/utils/hotelNavigation";

export default function VacationType({ activeTab, vibes = [] }) {
  const [index, setIndex] = useState(0);
  const [perPage, setPerPage] = useState(4);
  // const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const selectedCategory = vibes.find((item) => item.category === activeTab);

  const data = selectedCategory?.items || [];
  const { draftSearchData } = useHotelSearchStore();

  useEffect(() => {
    const updatePerPage = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setPerPage(Math.max(data.length, 1));
      } else if (width < 1024) {
        setPerPage(2);
      } else {
        setPerPage(4);
      }
    };

    updatePerPage();

    window.addEventListener("resize", updatePerPage);

    return () => window.removeEventListener("resize", updatePerPage);
  }, [data.length]);

  useEffect(() => {
    setIndex(0);
  }, [activeTab]);

  const next = () => {
    if (index + perPage < data.length) {
      setIndex((prev) => prev + perPage);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((prev) => prev - perPage);
    }
  };

  const visibleData =
    perPage === data.length ? data : data.slice(index, index + perPage);

  const handleSearch = (item) => {
    const searchData = buildSearchData({
      baseSearchData: draftSearchData,
      city: item.city,
      cityId: item.cityId,
      destinationData: item,
    });

    navigateToHotels(router, searchData);
  };
  return (
    <div className="xs:px-1 !sm:-mt-[50px] -mt-7 px-0 py-2 sm:px-1 md:mt-[2px] md:px-2 lg:mt-[2px] lg:px-4 xl:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={prev}
          disabled={index === 0}
          className="hidden h-10 w-10 items-center justify-center !text-[27px] !text-black lg:flex"
        >
          <LeftOutlined />
        </button>

        <div className="flex-1 overflow-hidden">
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4 lg:hidden">
            {data.map((item, idx) => {
              return (
                <div
                  key={item._id}
                  className="!m-0 max-w-[159px] min-w-[159px] overflow-hidden rounded-[2px] bg-white !p-0 shadow-sm transition"
                >
                  {/* Image */}
                  <div className="relative h-[150px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.alt || item.name}
                      fill
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="bg-white px-2 py-1 text-center">
                    <h2 className="line-clamp-1 text-[14px] leading-tight font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="line-clamp-1 text-[11px] leading-tight text-gray-600">
                      {item.city}
                    </p>

                    <button
                      onClick={() => handleSearch(item)}
                      className="most-text-color text-[12px] font-medium lg:text-[16px]"
                    >
                      View Details
                    </button>

                    <div className="mx-auto mt-1 w-20 border-b border-dotted !border-[#5FA8C9]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tablet + Desktop Grid */}
          <div className="mb-8 hidden grid-cols-4 gap-4 lg:grid">
            {visibleData.map((item, idx) => {
              return (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-[5px] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-[302px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.alt || item.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="mt-[-10px] bg-white px-4 py-5 text-center">
                    <h2 className="text-[22px] font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="mt-[-7px] text-[14px] text-gray-700">
                      {item.city}
                    </p>
                    <button
                      onClick={() => handleSearch(item)}
                      className="most-text-color hover:!text-most-text-color flex w-full items-center justify-center gap-1 !text-[18px] font-medium transition-colors duration-200"
                    >
                      View Details →
                    </button>

                    <div className="teb-border-color mx-auto mt-1 w-36 border-b border-dotted" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEXT BUTTON - Hide on Mobile */}
        <button
          onClick={next}
          disabled={index + perPage >= data.length}
          className="hidden h-10 w-10 items-center justify-center !text-[27px] !text-black lg:flex"
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
}
