"use client";

import { message } from "antd";
import { useCallback, useEffect, useMemo } from "react";

import useIsMobile from "@/hooks/useIsMobile";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useToggleWishlist } from "@/modules/wishlist/hooks/useToggleWishlist";
import { useWishlistIds } from "@/modules/wishlist/hooks/useWishlistIds";

import { useHotelBookingStore } from "../store/booking.store";
import { useSelectedHotelStore } from "../store/selectedHotel.store";
import { useHotelSearchStore } from "../store/serchData.store";
import { buildHotelDetailsPayload } from "../utils/buildHotelDetailsPayload";
import { buildWishlistPayload } from "../utils/buildWishlistPayload";
import { mapHotelDetailsResponse } from "../utils/mapHotelDetailsResponse";
import { shareHotel } from "../utils/shareHotel";
import { useHotelContent, useHotelRooms } from "./useHotelDetails";

const EMPTY_OBJECT = {};

export const useHotelDetailsPage = ({ initialPayload = null }) => {
  const { selectedHotel } = useSelectedHotelStore();
  const { appliedSearchData } = useHotelSearchStore();
  const { setBookingData } = useHotelBookingStore();
  const { requireAuth } = useAuthGuard();
  const { mutateAsync } = useToggleWishlist();
  const { data: wishlistData } = useWishlistIds();
  const isMobile = useIsMobile();

  const selectedHotelForRoute = useMemo(() => {
    const routeHotelId = initialPayload?.hotelId;
    if (!routeHotelId) {
      return selectedHotel;
    }

    const selectedHotelId =
      selectedHotel?.hotelMeta?.hotelId ||
      selectedHotel?.hotelId ||
      selectedHotel?.id;

    return selectedHotelId &&
      String(selectedHotelId) === String(routeHotelId)
      ? selectedHotel
      : null;
  }, [initialPayload?.hotelId, selectedHotel]);

  const payload = useMemo(() => {
    return buildHotelDetailsPayload({
      selectedHotel: selectedHotelForRoute,
      initialPayload,
    });
  }, [selectedHotelForRoute, initialPayload]);

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
  const selectedHotelMeta =
    selectedHotelForRoute?.hotelMeta || EMPTY_OBJECT;
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
        selectedHotelMeta?.hotelName ||
        initialPayload?.hotelMeta?.hotelName ||
        selectedHotelForRoute?.name ||
        "",
      hotelName:
        hotel?.name ||
        selectedHotelMeta?.hotelName ||
        initialPayload?.hotelMeta?.hotelName ||
        selectedHotelForRoute?.name ||
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
    selectedHotelForRoute?.name,
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
      selectedHotelForRoute?.hotelImage ||
      selectedHotelForRoute?.image ||
      "";
    return fallbackImage ? [fallbackImage] : [];
  }, [details, hotel, selectedHotelForRoute, selectedHotelMeta]);

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

  const isLoading = contentQuery.isLoading;
  const isFetching = roomQuery.isFetching;
  const detailError = contentQuery.error || null;
  const roomError = roomQuery.error || null;
  const showSkeleton =
    isValidPayload && contentQuery.isLoading && !contentQuery.data;

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
      } catch {
        message.error("Wishlist update failed");
      }
    });
  }, [
    appliedSearchData,
    basePrice,
    isWishlisted,
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
