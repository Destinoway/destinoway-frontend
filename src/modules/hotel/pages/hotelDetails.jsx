"use client";

import { useEffect, useState } from "react";

import HotelDetailsSkeleton from "@/components/common/loder/HotelDetailsSkeleton";

import { useHotelDetailsPage } from "../hooks/useHotelDetailsPage";
import HotelDetailsDesktop from "./HotelDetailsDesktop";
import HotelDetailsMobile from "./HotelDetailsMobile";

function HotelDetails({ initialPayload = null, cms = null }) {
  const page = useHotelDetailsPage({ initialPayload });
  const [activeTab, setActiveTab] = useState("Rooms");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 5);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (page.isMobile === null) {
    return <HotelDetailsSkeleton />;
  }

  if (page.isMobile) {
    return (
      <HotelDetailsMobile
        cms={cms}
        hotelData={page.hotelData}
        supplierData={page.supplierData}
        isLoading={page.isLoading}
        isFetching={page.isFetching}
        refetch={page.refetch}
        payload={page.payload}
        roomPage={1}
        roomPageTotal={page.hotelData?.pagination?.total || 0}
        onRoomPageChange={page.handleRoomPageChange}
        detailError={
          page.isValidPayload
            ? page.detailError?.message || String(page.detailError)
            : "This hotel link is missing its search details. Please open the hotel from search results."
        }
        onWishlist={page.handleWishlist}
        onShare={page.handleShare}
        isWishlisted={page.isWishlisted}
        ratePlans={page.roomPlans}
        hasMore={Boolean(page.roomQuery?.hasNextPage)}
        isFetchingNextPage={page.roomQuery?.isFetchingNextPage}
        loadMoreRooms={page.handleRoomPageChange}
        onRetry={page.roomQuery?.refetch}
      />
    );
  }

  return (
    <HotelDetailsDesktop
      cms={cms}
      hotelData={page.hotelData}
      supplierData={page.supplierData}
      hotel={page.hotel}
      hotelImages={page.hotelImages}
      amenities={page.amenities}
      roomPlans={page.roomPlans}
      isLoading={page.isLoading}
      isValidPayload={page.isValidPayload}
      detailError={page.detailError}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isScrolled={isScrolled}
      onWishlist={page.handleWishlist}
      onShare={page.handleShare}
      isWishlisted={page.isWishlisted}
      payload={page.payload}
      location={page.location}
      appliedSearchData={page.appliedSearchData}
      hotelId={page.hotelId}
      roomQuery={page.roomQuery}
      refetch={page.refetch}
      showSkeleton={page.showSkeleton}
    />
  );
}

export default HotelDetails;
