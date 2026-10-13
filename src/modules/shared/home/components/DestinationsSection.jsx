"use client";

import SectionHeading from "@/components/common/SectionHeading";
import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import { buildSearchData } from "@/modules/hotel/utils/buildSearchData";
import { navigateToHotels } from "@/modules/hotel/utils/hotelNavigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ButtonTab from "./vacation_sections/ButtonTab";

export default function DestinationsSection({ destinations }) {
  const categories = destinations?.categories || [];

  const [activeTab, setActiveTab] = useState(categories[0]?.category || "");

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].category);
    }
  }, [categories, activeTab]);

  const selectedCategory = categories.find(
    (item) => item.category === activeTab,
  );

  const activeDestinations = selectedCategory?.items || [];

  if (!activeDestinations.length) {
    return null;
  }

  return (
    <section className="background-color-bg !mt-[-30px] overflow-hidden !px-0 px-3 py-0 text-black sm:!mt-[-30px] sm:!px-0 sm:py-0 md:!mt-[-30px] md:!px-2 md:py-24 lg:!mt-[-70px] lg:!px-3 xl:!mt-[-90px] xl:!px-4 2xl:!mt-[-50px] 2xl:!px-0">
      <div className="mx-auto w-full lg:!mt-[-170px] lg:w-[88.87%] xl:!mt-[10px]">
        <SectionHeading
          title={destinations?.title || "Popular Destinations"}
          description="We’re committed to offering more than just products we provide exceptional experiences."
        />

        <div className="mt-5 flex justify-center">
          <div className="scrollbar-hide flex max-w-full items-center gap-4 overflow-x-auto pb-2 whitespace-nowrap sm:gap-6 lg:gap-8">
            <ButtonTab
              tabs={categories}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        <div className="mt-4 md:hidden">
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
            {activeDestinations.map((item) => (
              <div key={item._id} className="w-[230px] flex-shrink-0">
                <DestinationCard item={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          {activeDestinations.length >= 2 && (
            <div className="mt-16 grid grid-cols-2 gap-5">
              {activeDestinations.slice(0, 2).map((item) => (
                <DestinationCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {activeDestinations.length > 2 && (
            <div className="mt-5 grid grid-cols-3 gap-5">
              {activeDestinations.slice(2, 5).map((item) => (
                <DestinationCard key={item._id} item={item} />
              ))}
            </div>
          )}
          {activeDestinations.length > 5 && (
            <div className="mt-5 grid grid-cols-2 gap-5">
              {activeDestinations.slice(5, 7).map((item) => (
                <DestinationCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {activeDestinations.length > 7 && (
            <div className="mt-5 grid grid-cols-3 gap-5">
              {activeDestinations.slice(7, 10).map((item) => (
                <DestinationCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({ item }) {
  const router = useRouter();
  const { draftSearchData } = useHotelSearchStore();

  const handleSearch = () => {
    const searchData = buildSearchData({
      baseSearchData: draftSearchData,
      city: item.city,
      cityId: item.cityId,
      destinationData: item,
    });

    navigateToHotels(router, searchData);
  };

  return (
    <div
      onClick={handleSearch}
      className={`group relative h-[260px] cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:shadow-xl sm:h-[300px] sm:rounded-2xl md:h-[340px] lg:rounded-[20px] ${item.height} `}
    >
      <Image
        src={item.image}
        alt={item.alt || item.name}
        fill
        quality={75}
        sizes="(max-width:768px)100vw,33vw"
        loading="lazy"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-3 left-3 z-10 sm:bottom-5 sm:left-5 lg:bottom-7 lg:left-7">
        <h3 className="text-lg font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
          {item.name}
        </h3>

        <p className="mt-1 text-xs text-white/90 sm:text-sm md:text-base lg:text-lg">
          {item.city}
        </p>
      </div>
    </div>
  );
}
