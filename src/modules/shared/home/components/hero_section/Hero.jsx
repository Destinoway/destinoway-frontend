"use client";

import HotelSearchForm from "@/modules/hotel/components/hotels/HotelSearchForm";
import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import { navigateToHotels } from "@/modules/hotel/utils/hotelNavigation";
import { HOME_TABS } from "@/modules/shared/config/homeTabs";
import styles from "@/modules/shared/home/components/styles/Hero.module.css";
import {
  HERO_QUALITY,
  getHeroBannerSrc,
  isPreOptimizedImage,
} from "@/modules/shared/home/utils/heroBanner";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Tabs from "./Tabs";

const FlightSearchForm = dynamic(
  () => import("@/modules/flight/components/FlightSearchForm"),
);
const BusSearchForm = dynamic(
  () => import("@/modules/bus/components/BusSearchForm"),
);

const FORM_MAP = {
  hotel: HotelSearchForm,
  flight: FlightSearchForm,
  bus: BusSearchForm,
};

export default function Hero({ banner }) {
  const [activeTab, setActiveTab] = useState(
    HOME_TABS.find((t) => t.enabled)?.key,
  );
  const router = useRouter();
  const bannerItem = banner?.items?.[0] ?? {};
  const bannerSrc = getHeroBannerSrc(banner);
  const { draftSearchData, applySearch } = useHotelSearchStore();
  const ActiveForm = FORM_MAP[activeTab];
  const [destinationError, setDestinationError] = useState(false);
  const handleSearch = () => {
    if (!draftSearchData?.city?.trim()) {
      setDestinationError(true);
      return;
    }

    applySearch();
    navigateToHotels(router, draftSearchData);
  };

  return (
    <section
      id="hero-search"
      className="relative w-full overflow-visible bg-[#EDF7FF]"
    >
      <picture className={styles.heroBg}>
        <source
          media="(max-width: 777px)"
          srcSet="/images/heromobile.avif 390w, /images/heromobile-2x.avif 780w"
          sizes="100vw"
          type="image/avif"
        />
        <source
          media="(max-width: 777px)"
          srcSet="/images/heromobile.webp 390w, /images/heromobile-2x.webp 780w"
          sizes="100vw"
          type="image/webp"
        />
        <Image
          src={bannerSrc}
          alt={bannerItem.alt || "Destinoway"}
          fill
          loading="eager"
          fetchPriority="high"
          unoptimized={isPreOptimizedImage(bannerSrc)}
          quality={HERO_QUALITY}
          sizes="100vw"
          className="object-cover"
        />
      </picture>

      <div className="!2xl:max-w-[99%] relative z-20 mx-auto w-[94%] pt-18 pb-6 min-[700px]:absolute min-[700px]:top-2 min-[700px]:left-1/2 min-[700px]:-translate-x-1/2 min-[700px]:pt-0 min-[700px]:pb-0 md:top-14 md:w-[92%] lg:top-[56%] lg:w-[94%] xl:top-[61%] xl:w-[82%] 2xl:top-[66%]">
        <div className="w-full rounded-2xl border border-gray-200 bg-[#F8F8F8] px-3.5 pt-4 pb-4 shadow-[0_12px_40px_rgba(15,23,42,0.18)] sm:p-5 md:p-6 lg:p-7 xl:p-8">
          <Tabs
            tabs={HOME_TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {ActiveForm && (
            <ActiveForm
              destinationError={destinationError}
              setDestinationError={setDestinationError}
              onSearch={handleSearch}
            />
          )}
        </div>
      </div>
    </section>
  );
}
