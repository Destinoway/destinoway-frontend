"use client";

import HotelContentLoader from "@/components/common/loder/HotelContentLoader";
import { useWishlistIds } from "@/modules/wishlist/hooks/useWishlistIds";
import { memo, useEffect, useMemo, useRef } from "react";

import HotelCard from "../../cards/HotelCard";
import { useInfiniteHotels } from "../../hooks/useInfiniteHotels";
import { buildHotelPayload } from "../../utils/buildHotelPayload";
import { mapHotelsForCard } from "../../utils/mapHotelsForCard";
import HotelNotFound from "./HotelNotFound";

function HotelList({
  searchData,
  filters,
  sort,
  onHotelsChange,
  onLoadingChange,
  onResultChange,
}) {
  const { data: wishlistIdsData } = useWishlistIds();

  const wishlistIds = useMemo(
    () => new Set(wishlistIdsData || []),
    [wishlistIdsData],
  );

  const payload = useMemo(() => {
    return buildHotelPayload({
      searchData,
      filters,
      sort,
    });
  }, [searchData, filters, sort]);

  const {
    data,
    isLoading,
    isError,
    isSearchProcessing,
    searchId,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteHotels(payload, filters, sort);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "400px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const hotels = useMemo(() => {
    const allHotels =
      data?.pages?.flatMap((page) => {
        return (page?.data?.items || []).map((hotel) => ({
          ...hotel,
          hotelDetailId:
            page?.data?.hotelDetailId ||
            page?.data?.hotelDetailID ||
            page?.data?.HotelDetailId ||
            page?.data?.HotelDetailID ||
            hotel?.hotelDetailId ||
            hotel?.hotelDetailID ||
            hotel?.HotelDetailId ||
            hotel?.HotelDetailID ||
            "",
        }));
      }) || [];

    return Array.from(
      new Map(
        allHotels.map((hotel, index) => [
          hotel?.supplierHotelId ||
            hotel?.id ||
            hotel?.hotelId ||
            hotel?.HotelId ||
            `hotel-${index}`,
          hotel,
        ]),
      ).values(),
    );
  }, [data]);

  const currencyCode =
    data?.pages?.[0]?.data?.items?.[0]?.price?.currency || "INR";

  const currencySymbol = currencyCode === "INR" ? "₹" : currencyCode;

  const searchKey =
    data?.pages?.[0]?.data?.searchKey ||
    data?.pages?.[0]?.data?.SearchKey ||
    "";

  const mappedHotels = useMemo(() => {
    return mapHotelsForCard({
      hotels,
      currencySymbol,
      searchKey,
      searchId,
    });
  }, [hotels, currencySymbol, searchKey, searchId]);

  useEffect(() => {
    onHotelsChange?.(mappedHotels);
  }, [mappedHotels, onHotelsChange]);

  useEffect(() => {
    onResultChange?.(mappedHotels.length > 0);
  }, [mappedHotels, onResultChange]);

  if (isLoading || isSearchProcessing) {
    return <HotelContentLoader />;
  }

  if (isError) {
    return <HotelNotFound type="error" />;
  }
  if (!payload && searchData?.city) {
    return (
      <HotelNotFound
        type="error"
        message="We couldn’t load hotels because destination details are incomplete. Please select the destination again and retry."
      />
    );
  }
  if (isSearchProcessing) {
    return <div>Searching hotels... Please wait.</div>;
  }

  if (!mappedHotels.length) {
    return <HotelNotFound type="not-found" />;
  }
  return (
    <div className="w-full space-y-4">
      {mappedHotels.map((hotel, index) => (
        <HotelCard
          key={hotel?.id || hotel?.hotelId || index}
          hotel={hotel}
          wishlistIds={wishlistIds}
        />
      ))}

      {(hasNextPage || isFetchingNextPage) && (
        <div ref={loadMoreRef} className="flex justify-center py-6">
          {isFetchingNextPage && (
            <div className="text-sm text-gray-500">Loading more hotels...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(HotelList);
