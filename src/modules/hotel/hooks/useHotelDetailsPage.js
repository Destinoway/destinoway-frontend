"use client";

import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useIsMobile from "@/hooks/useIsMobile";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useCurrencyStore } from "@/modules/shared/store/currency.store";
import { useToggleWishlist } from "@/modules/wishlist/hooks/useToggleWishlist";
import { useWishlistIds } from "@/modules/wishlist/hooks/useWishlistIds";

import {
  getHotelSearchResults,
  startHotelSearch,
} from "../services/hotel.service";
import { useHotelBookingStore } from "../store/booking.store";
import { useSelectedHotelStore } from "../store/selectedHotel.store";
import { useHotelSearchStore } from "../store/serchData.store";
import { buildHotelPayload } from "../utils/buildHotelPayload";
import { buildHotelDetailsPayload } from "../utils/buildHotelDetailsPayload";
import { buildWishlistPayload } from "../utils/buildWishlistPayload";
import { mapHotelDetailsResponse } from "../utils/mapHotelDetailsResponse";
import { shareHotel } from "../utils/shareHotel";
import { slugify } from "@/utils/slug/slugify";
import { useHotelContent, useHotelRooms } from "./useHotelDetails";

const EMPTY_OBJECT = {};
const HOTEL_SEARCH_POLL_INTERVAL_MS = 400;
const HOTEL_SEARCH_TIMEOUT_MS = 30000;

export const useHotelDetailsPage = ({ initialPayload = null }) => {
  const router = useRouter();
  const [resolvedSearchId, setResolvedSearchId] = useState("");
  const { selectedHotel } = useSelectedHotelStore();
  const { appliedSearchData } = useHotelSearchStore();
  const currency = useCurrencyStore((state) => state.selectedCurrency.code);
  const { setBookingData } = useHotelBookingStore();
  const { requireAuth } = useAuthGuard();
  const { mutateAsync } = useToggleWishlist();
  const { data: wishlistData } = useWishlistIds();
  const isMobile = useIsMobile();

  const routePayload = useMemo(() => {
    return buildHotelDetailsPayload({
      selectedHotel,
      initialPayload,
    });
  }, [selectedHotel, initialPayload]);

  const shouldResolveRoute = Boolean(
    initialPayload &&
      routePayload?.hotelId &&
      (!routePayload?.searchId || !routePayload?.supplierHotelId) &&
      appliedSearchData?.city,
  );

  const routeQuery = useQuery({
    queryKey: [
      "resolve-hotel-detail-route",
      routePayload?.hotelId,
      appliedSearchData,
      currency,
    ],
    enabled: shouldResolveRoute,
    retry: false,
    queryFn: async () => {
      const searchPayload = buildHotelPayload({
        searchData: appliedSearchData,
      });

      if (!searchPayload) {
        throw new Error(
          "Hotel search details are unavailable. Search for the destination again.",
        );
      }

      const search = await startHotelSearch({
        ...searchPayload,
        currency,
      });
      setResolvedSearchId(search.searchId);
      const expectedHotelSlug =
        initialPayload?.hotelMeta?.hotelSlug || "";
      const deadline = Date.now() + HOTEL_SEARCH_TIMEOUT_MS;
      let matchedHotel = null;
      let searchStatus = "";

      while (Date.now() < deadline) {
        const result = await getHotelSearchResults(
          search.searchId,
          1,
          1,
          { hotelId: routePayload.hotelId },
        );
        matchedHotel = result?.data?.items?.[0] || null;
        searchStatus = result?.data?.status || "";

        if (matchedHotel || ["completed", "failed"].includes(searchStatus)) {
          break;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, HOTEL_SEARCH_POLL_INTERVAL_MS),
        );
      }

      if (!matchedHotel && expectedHotelSlug) {
        const nameResult = await getHotelSearchResults(
          search.searchId,
          1,
          100,
          { hotelName: expectedHotelSlug.replace(/-/g, " ") },
        );
        const nameMatches = (nameResult?.data?.items || []).filter(
          (item) => slugify(item?.name || "") === slugify(expectedHotelSlug),
        );

        if (nameMatches.length === 1) {
          matchedHotel = nameMatches[0];
        }
      }

      if (!matchedHotel) {
        throw new Error(
          "The hotel could not be matched to the current search. Please open it from the hotel search results.",
        );
      }

      const supplierHotelId =
        matchedHotel?.supplierHotelId ||
        matchedHotel?.supplierHotelID ||
        matchedHotel?.hotelId ||
        matchedHotel?.HotelId ||
        matchedHotel?.id ||
        "";

      if (!supplierHotelId) {
        throw new Error("The hotel search result is missing its supplier ID.");
      }

      return {
        ...routePayload,
        searchId: search.searchId,
        supplierHotelId: String(supplierHotelId),
        hotelMeta: {
          ...initialPayload?.hotelMeta,
          hotelName:
            matchedHotel?.name || initialPayload?.hotelMeta?.hotelName || "",
        },
      };
    },
  });

  useEffect(() => {
    const searchId = resolvedSearchId || routeQuery.data?.searchId;
    if (!initialPayload || !searchId || initialPayload.searchId === searchId) {
      return;
    }

    const query = new URLSearchParams(window.location.search);
    if (
      query.get("searchId") === String(searchId) &&
      !query.has("supplierHotelId")
    ) {
      return;
    }

    query.set("searchId", String(searchId));
    query.delete("supplierHotelId");
    router.replace(`${window.location.pathname}?${query.toString()}`, {
      scroll: false,
    });
  }, [initialPayload, resolvedSearchId, routeQuery.data, router]);

  const payload = routeQuery.data || routePayload;

  const wishlistIds = useMemo(
    () =>
      new Set(
        Array.isArray(wishlistData)
          ? wishlistData.map((id) => id?.toString())
          : [],
      ),
    [wishlistData],
  );

  const hotelId = payload?.hotelId?.toString() || "";
  const isWishlisted = hotelId ? wishlistIds.has(hotelId) : false;
  const isValidPayload = Boolean(payload?.searchId && payload?.supplierHotelId);

  const contentQuery = useHotelContent(payload, isValidPayload);
  const roomQuery = useHotelRooms(payload, isValidPayload);

  const data = useMemo(() => {
    if (!contentQuery.data) {
      return null;
    }

    return mapHotelDetailsResponse(contentQuery.data, roomQuery.data);
  }, [contentQuery.data, roomQuery.data]);

  const hotelData = data || EMPTY_OBJECT;
  const hotel = hotelData?.hotel || EMPTY_OBJECT;
  const hasInitialPayload = initialPayload != null;
  const storedSearchId =
    selectedHotel?.hotelMeta?.searchId || selectedHotel?.searchId || "";
  const storedSupplierHotelId =
    selectedHotel?.hotelMeta?.supplierHotelId ||
    selectedHotel?.supplierHotelId ||
    "";
  const isStoredHotelForRoute =
    !hasInitialPayload ||
    (payload?.searchId &&
      payload?.supplierHotelId &&
      String(storedSearchId) === String(payload.searchId) &&
      String(storedSupplierHotelId) === String(payload.supplierHotelId));
  const fallbackSelectedHotel = isStoredHotelForRoute
    ? selectedHotel
    : EMPTY_OBJECT;
  const selectedHotelMeta = fallbackSelectedHotel?.hotelMeta || EMPTY_OBJECT;
  const details = hotelData?.details || EMPTY_OBJECT;
  const location = hotel?.location || EMPTY_OBJECT;
  const contact = hotel?.contact || EMPTY_OBJECT;
  const pricing = hotel?.pricing || EMPTY_OBJECT;
  const policy = hotel?.policy || EMPTY_OBJECT;
  const checkIn = hotel?.checkIn || EMPTY_OBJECT;
  const checkOut = hotel?.checkOut || EMPTY_OBJECT;

  const supplierData = useMemo(() => {
    return {
      HotelId: hotel?.hotelId || hotelId || "",
      hotelId: hotel?.hotelId || hotelId || "",
      HotelKey: hotel?.hotelKey || "",
      hotelKey: hotel?.hotelKey || "",
      HotelName:
        hotel?.name ||
        initialPayload?.hotelMeta?.hotelName ||
        selectedHotelMeta?.hotelName ||
        fallbackSelectedHotel?.name ||
        "",
      hotelName:
        hotel?.name ||
        initialPayload?.hotelMeta?.hotelName ||
        selectedHotelMeta?.hotelName ||
        fallbackSelectedHotel?.name ||
        "",
      Description: hotel?.description || "",
      description: hotel?.description || "",
      Address: location?.address || selectedHotelMeta?.address || "",
      address: location?.address || selectedHotelMeta?.address || "",
      City:
        location?.city ||
        selectedHotelMeta?.city ||
        selectedHotelMeta?.cityName ||
        "",
      city:
        location?.city ||
        selectedHotelMeta?.city ||
        selectedHotelMeta?.cityName ||
        "",
      State:
        location?.state ||
        selectedHotelMeta?.state ||
        selectedHotelMeta?.stateName ||
        "",
      state:
        location?.state ||
        selectedHotelMeta?.state ||
        selectedHotelMeta?.stateName ||
        "",
      Country: location?.country || selectedHotelMeta?.country || "",
      country: location?.country || selectedHotelMeta?.country || "",
      Pincode: location?.pincode || "",
      pincode: location?.pincode || "",
      Latitude: location?.latitude ?? null,
      latitude: location?.latitude ?? null,
      Longitude: location?.longitude ?? null,
      longitude: location?.longitude ?? null,
      Phone: contact?.phone || "",
      phone: contact?.phone || "",
      Email: contact?.email || "",
      email: contact?.email || "",
      HotelImage: hotel?.image || "",
      hotelImage: hotel?.image || "",
      StarCategory: hotel?.starCategory ?? 0,
      starCategory: hotel?.starCategory ?? 0,
      Facilities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
      facilities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
      Pricing: pricing,
      pricing,
      CheckIn: checkIn,
      checkIn,
      CheckOut: checkOut,
      checkOut,
      CheckInDate: hotel?.stayPeriod?.checkIn || "",
      checkInDate: hotel?.stayPeriod?.checkIn || "",
      CheckOutDate: hotel?.stayPeriod?.checkOut || "",
      checkOutDate: hotel?.stayPeriod?.checkOut || "",
      Occupancies: hotel?.occupancies || [],
      occupancies: hotel?.occupancies || [],
      RoomCount: hotel?.guestDetails?.roomCount || 0,
      AdultCount: hotel?.guestDetails?.adultCount || 0,
      ChildrenCount: hotel?.guestDetails?.childrenCount || 0,
      GuestCount:
        (hotel?.guestDetails?.adultCount || 0) +
        (hotel?.guestDetails?.childrenCount || 0),
      HotelContentFields: hotelData?.rawContent || {},
      RoomResponseFields: hotelData?.rawRooms || {},
      StayPeriodFields: hotelData?.rawStayPeriod || {},
      Policy: policy,
      policy,
      Supplier: hotel?.supplier || "",
      supplier: hotel?.supplier || "",
      AboutHotel: details?.aboutHotel || "",
      aboutHotel: details?.aboutHotel || "",
      Amenities: details?.amenities || [],
      amenities: details?.amenities || [],
      HotelGallery: Array.isArray(details?.gallery) ? details.gallery : [],
      gallery: Array.isArray(details?.gallery) ? details.gallery : [],
      ImportantInformation: details?.importantInformation || null,
      importantInformation: details?.importantInformation || null,
      Rooms: Array.isArray(details?.rooms) ? details.rooms : [],
      rooms: Array.isArray(details?.rooms) ? details.rooms : [],
      RatePlanRecommendations: Array.isArray(details?.rooms)
        ? details.rooms
        : [],
    };
  }, [
    hotel,
    hotelId,
    location,
    contact,
    pricing,
    checkIn,
    checkOut,
    policy,
    details,
    hotelData,
    initialPayload?.hotelMeta?.hotelName,
    selectedHotelMeta,
    fallbackSelectedHotel?.name,
  ]);

  const roomPlans = useMemo(() => {
    const rooms = Array.isArray(details?.rooms) ? details.rooms : [];

    return rooms.map((room) => ({
      ...room,
      hotelDetailId: payload?.hotelDetailId || "",
      searchId: payload?.searchId || "",
      supplierHotelId: payload?.supplierHotelId || "",
    }));
  }, [details, payload]);

  const hotelImages = useMemo(() => {
    const gallery = Array.isArray(details?.gallery) ? details.gallery : [];

    const images = gallery
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.url || item?.image || item?.src || "";
      })
      .filter(Boolean);

    if (images.length > 0) {
      return images;
    }

    const selectedImages = (
      Array.isArray(selectedHotelMeta?.images) ? selectedHotelMeta.images : []
    )
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.url || item?.ImageURL || item?.image || item?.src || "",
      )
      .filter(Boolean);

    if (selectedImages.length > 0) {
      return selectedImages;
    }

    const fallbackImage =
      hotel?.image ||
      selectedHotelMeta?.image ||
      fallbackSelectedHotel?.hotelImage ||
      fallbackSelectedHotel?.image ||
      "";
    return fallbackImage ? [fallbackImage] : [];
  }, [details, hotel, fallbackSelectedHotel, selectedHotelMeta]);

  const amenities = useMemo(() => {
    const rawAmenities = details?.amenities;

    if (Array.isArray(rawAmenities)) {
      return rawAmenities
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.name || item?.title || item?.description || "";
        })
        .filter(Boolean);
    }

    if (typeof rawAmenities === "string") {
      return rawAmenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (Array.isArray(hotel?.facilities)) {
      return hotel.facilities
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.name || item?.title || "";
        })
        .filter(Boolean);
    }

    return [];
  }, [details, hotel]);

  useEffect(() => {
    if (!appliedSearchData) {
      return;
    }

    setBookingData({
      searchData: appliedSearchData,
    });
  }, [appliedSearchData, setBookingData]);

  const isLoading = routeQuery.isFetching || contentQuery.isLoading;
  const isFetching = roomQuery.isFetching;
  const detailError = routeQuery.error || contentQuery.error || null;
  const roomError = roomQuery.error || null;
  const showSkeleton =
    routeQuery.isFetching ||
    (isValidPayload && contentQuery.isLoading && !contentQuery.data);

  const firstRatePlan = roomPlans?.[0] || null;
  const basePrice = Number(
    firstRatePlan?.pricing?.basicAmount || pricing?.basicAmount || 0,
  );
  const platformFeeAndTax = Number(
    firstRatePlan?.pricing?.tax || pricing?.tax || 0,
  );
  const finalPrice = Number(
    firstRatePlan?.pricing?.totalAmount || pricing?.totalAmount || 0,
  );
  const currencySymbol =
    firstRatePlan?.pricing?.currency || pricing?.currency || "₹";

  const refetch = useCallback(
    () => Promise.all([contentQuery.refetch(), roomQuery.refetch()]),
    [contentQuery, roomQuery],
  );

  const handleRoomPageChange = useCallback(() => {
    if (roomQuery.hasNextPage && !roomQuery.isFetchingNextPage) {
      roomQuery.fetchNextPage();
    }
  }, [roomQuery]);

  const handleWishlist = useCallback(() => {
    requireAuth(async () => {
      try {
        const wishlistPayload = buildWishlistPayload({
          hotel: {
            ...hotel,
            image: hotel?.image || hotel?.heroImage || "",
          },
          hotelId: payload?.hotelId,
          supplierData,
          searchData: appliedSearchData,
          hotelMeta: payload?.hotelMeta,
          pricing: {
            basePrice,
            platformFeeAndTax,
          },
        });

        await mutateAsync(wishlistPayload);

        message.success(
          isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        );
      } catch (error) {
        message.error(
          error?.response?.data?.message ||
            error?.message ||
            "Wishlist update failed",
        );
      }
    });
  }, [
    appliedSearchData,
    basePrice,
    isWishlisted,
    hotel,
    mutateAsync,
    payload,
    platformFeeAndTax,
    requireAuth,
    supplierData,
  ]);

  const handleShare = useCallback(async () => {
    await shareHotel({
      hotelName: hotel?.name || "",
      cityName: location?.city || appliedSearchData?.city || "",
      hotelId: payload?.hotelId,
      searchId: payload?.searchId,
      supplierHotelId: payload?.supplierHotelId,
      hotelDetailId: payload?.hotelDetailId,
    });
  }, [appliedSearchData?.city, hotel?.name, location?.city, payload]);

  return {
    isMobile,
    payload,
    isValidPayload,
    isWishlisted,
    hotelData,
    hotel,
    details,
    supplierData,
    roomPlans,
    hotelImages,
    amenities,
    pricing,
    isLoading,
    isFetching,
    showSkeleton,
    detailError,
    roomError,
    refetch,
    handleWishlist,
    handleShare,
    handleRoomPageChange,
    roomQuery,
    basePrice,
    finalPrice,
    currencySymbol,
    location,
    appliedSearchData,
    isScrolled: false,
    hotelId,
  };
};
