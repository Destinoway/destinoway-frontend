"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import { useHotelBookingStore } from "@/modules/hotel/store/booking.store";
import { buildRoomBookingUrl } from "@/modules/hotel/utils/buildRoomBookingUrl";
import { selectFeaturedRoomPlan } from "@/modules/hotel/utils/selectFeaturedRoomPlan";
import RoomPriceBreakdown from "./RoomPriceBreakdown";
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Skeleton } from "antd";
import { useRouter } from "next/navigation";

const ViewHotelPriceCard = ({
  ratePlans = [],
  supplierData = {},
  hotelDetailId = "",
  isRoomsLoading = false,
}) => {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const { appliedSearchData = {} } = useHotelSearchStore();
  const { setBookingData } = useHotelBookingStore();

  const { plan: selectedPlan, isRecommended: isRecommendedPlan } =
    selectFeaturedRoomPlan(ratePlans);

  /* ================= ROOM DETAILS ================= */

  const roomName = selectedPlan?.roomType || "Best Available Room";

  const inclusion = selectedPlan?.inclusion || "";
  const additionalInfo = selectedPlan?.additionalInfo || "";

  const cancellationPolicy = selectedPlan?.cancellationPolicy || null;
  const payment = selectedPlan?.payment || {};
  const pricing = selectedPlan?.pricing || {};

  /* ================= PRICE DATA ================= */

  /* ================= CHECK-IN / CHECK-OUT ================= */

  const checkIn = supplierData?.CheckIn || {};
  const checkOut = supplierData?.CheckOut || {};

  const checkInDate =
    supplierData?.CheckInDate ||
    checkIn?.date ||
    appliedSearchData?.checkIn ||
    "";
  const checkOutDate =
    supplierData?.CheckOutDate ||
    checkOut?.date ||
    appliedSearchData?.checkOut ||
    "";

  /* ================= GUEST DETAILS ================= */

  const hasContentOccupancies = supplierData?.Occupancies?.length > 0;

  const roomCount = Math.max(
    1,
    Number(
      (hasContentOccupancies ? supplierData?.RoomCount : null) ??
        appliedSearchData?.rooms ??
        appliedSearchData?.roomCount ??
        supplierData?.rooms ??
        1,
    ) || 1,
  );

  const adultCount = Math.max(
    0,
    Number(
      (hasContentOccupancies ? supplierData?.AdultCount : null) ??
        appliedSearchData?.adults ??
        appliedSearchData?.adultCount ??
        supplierData?.adults ??
        2,
    ) || 0,
  );

  const childrenCount = Math.max(
    0,
    Number(
      (hasContentOccupancies ? supplierData?.ChildrenCount : null) ??
        appliedSearchData?.children ??
        appliedSearchData?.childCount ??
        supplierData?.children ??
        0,
    ) || 0,
  );
  /* ================= DATE FORMAT ================= */

  const formatDate = (value) => {
    if (!value) return "";

    const dateString = String(value);
    const dateOnlyMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    // Prevent timezone shifts for YYYY-MM-DD values.
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;

      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= TIME FORMAT ================= */

  const formatTime = (value) => {
    if (!value) return "";

    const match = String(value).match(/^(\d{1,2}):(\d{2})/);

    if (!match) return String(value);

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return String(value);
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= LIST HELPER ================= */

  const getList = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) =>
          typeof item === "string"
            ? item.trim()
            : String(item?.name || item?.description || "").trim(),
        )
        .filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const inclusionList = getList(inclusion);
  const additionalInfoList = getList(additionalInfo);

  /* ================= BOOK NOW ================= */

  const handleBookNow = () => {
    if (!selectedPlan) return;

    const recommendationId =
      selectedPlan?.recommendationId || "";

    if (
      !selectedPlan?.searchId ||
      !selectedPlan?.supplierHotelId ||
      !recommendationId
    ) {
      console.error("Room selection is missing required search identifiers", {
        missing: [
          !selectedPlan?.searchId && "searchId",
          !selectedPlan?.supplierHotelId && "supplierHotelId",
          !recommendationId && "recommendationId",
        ].filter(Boolean),
        hotelDetailId,
        recommendationId,
        searchId: selectedPlan?.searchId,
        supplierHotelId: selectedPlan?.supplierHotelId,
        selectedPlan,
      });

      return;
    }

    setBookingData({ selectedRatePlan: selectedPlan, selectedRoom: selectedPlan });
    router.push(
      buildRoomBookingUrl({
        hotelDetailId,
        searchId: selectedPlan.searchId,
        supplierHotelId: selectedPlan.supplierHotelId,
        recommendationId,
      }),
    );
  };

  /* ================= VIEW ALL ================= */

  const handleRoomScroll = () => {
    const section = document.getElementById("rooms-section");

    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (isRoomsLoading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 font-sans shadow-sm sm:p-5">
        <Skeleton active paragraph={{ rows: 7 }} />
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 font-sans shadow-sm sm:p-5">
        <h3 className="m-0 text-base font-semibold text-gray-900">
          Room rates unavailable
        </h3>
        <p className="m-0 mt-2 text-sm leading-5 text-gray-600">
          Room prices for these dates are not available. Check the room options
          below for current availability.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 font-sans shadow-sm sm:p-5">
      {/* ================= ROOM DETAILS ================= */}

      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="m-0 text-xl leading-7 font-bold tracking-tight text-gray-900">
            {roomName}
          </h3>
          {selectedPlan && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isRecommendedPlan
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-sky-100 text-sky-800"
              }`}
            >
              {isRecommendedPlan ? "Recommended" : "First room"}
            </span>
          )}
        </div>
      </div>

      {/* ================= STAY DETAILS ================= */}

      <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50">
        {/* CHECK-IN / CHECK-OUT */}

        <div className="grid grid-cols-2">
          <div className="border-r border-gray-200 p-3">
            <div className="flex items-center gap-1.5">
              <CalendarOutlined className="text-sm text-blue-600" />

              <p className="!m-0 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Check-in
              </p>
            </div>

            <p className="!m-0 text-base leading-6 font-medium text-gray-900">
              {formatDate(checkInDate) || "Date not available"}
            </p>

            {checkIn?.time && (
              <p className="!m-0 mt-1! text-xs font-medium text-gray-500">
                {formatTime(checkIn.time)}
              </p>
            )}
          </div>

          <div className="p-3">
            <div className="flex items-center gap-1.5">
              <CalendarOutlined className="text-sm text-blue-600" />

              <p className="!m-0 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Check-out
              </p>
            </div>

            <p className="!m-0 text-base leading-6 font-medium text-gray-900">
              {formatDate(checkOutDate) || "Date not available"}
            </p>

            {checkOut?.time && (
              <p className="!m-0 text-xs font-medium text-gray-500">
                {formatTime(checkOut.time)}
              </p>
            )}
          </div>
        </div>

        {/* GUEST DETAILS */}

        <div className="border-t border-gray-200 px-3 py-3">
          <div className="mb-2 flex items-center gap-2">
            <TeamOutlined className="text-base text-blue-600" />

            <h4 className="!m-0 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Guest Details
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5 text-gray-700">
              <span className="font-semibold">{roomCount}</span>
              <span>{roomCount === 1 ? "Room" : "Rooms"}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-700">
              <UserOutlined className="text-gray-500" />

              <span className="font-semibold">{adultCount}</span>
              <span>{adultCount === 1 ? "Adult" : "Adults"}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-700">
              <UserOutlined className="text-gray-500" />

              <span className="font-semibold">{childrenCount}</span>
              <span>{childrenCount === 1 ? "Child" : "Children"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADDITIONAL INFORMATION ================= */}

      {additionalInfoList.length > 0 && (
        <div className="mb-3 rounded-xl bg-gray-50 p-3">
          <h4 className="text-xs font-bold tracking-wide text-gray-700 uppercase">
            Additional Information
          </h4>

          <ul className="mt-2 space-y-1.5">
            {additionalInfoList.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-start gap-2 text-sm leading-5 text-gray-600"
              >
                <span className="text-gray-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= CANCELLATION POLICY ================= */}

      {cancellationPolicy && (
        <div className="mb-3 rounded-xl bg-gray-50 p-3">
          <h4 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
            Cancellation Policy
          </h4>

          <p className="mt-1 text-sm leading-5 font-medium text-gray-700">
            {typeof cancellationPolicy === "string"
              ? cancellationPolicy
              : cancellationPolicy?.description ||
                cancellationPolicy?.policy ||
                "Cancellation policy available"}
          </p>
        </div>
      )}

      {/* ================= PAYMENT REQUIREMENTS ================= */}

      {(payment?.creditCardRequired || payment?.panMandatory) && (
        <div className="mb-3 rounded-xl bg-gray-50 p-3">
          <h4 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
            Payment Requirements
          </h4>

          {payment?.creditCardRequired && (
            <p className="mt-2 text-sm font-medium text-gray-700">
              Credit card required
            </p>
          )}

          {payment?.panMandatory && (
            <p className="mt-1 text-sm font-medium text-gray-700">
              PAN required
            </p>
          )}
        </div>
      )}

      {/* ================= PRICE DETAILS ================= */}

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
        <h4 className="text-sm font-bold tracking-wide text-gray-800 uppercase">
          Price Details
        </h4>

        <div className="mt-3">
          <RoomPriceBreakdown pricing={pricing} />
        </div>
      </div>

      {/* ================= BUTTONS ================= */}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          type="primary"
          size="large"
          onClick={() => requireAuth(handleBookNow)}
          className="buttion-background-color !h-11 w-full !rounded-lg !border-0 !text-sm !font-bold !text-white"
        >
          Book Now
        </Button>

        <Button
          size="large"
          onClick={handleRoomScroll}
          className="most-text-color !h-11 w-full !rounded-lg !px-3 !text-sm !font-semibold"
        >
          View All
        </Button>
      </div>
    </div>
  );
};

export default ViewHotelPriceCard;
