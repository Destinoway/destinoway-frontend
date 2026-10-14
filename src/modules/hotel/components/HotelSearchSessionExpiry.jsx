"use client";

import { Button, Modal } from "antd";
import { useEffect, useRef, useState } from "react";

import {
  clearHotelSearchSessionExpiry,
  getHotelSearchSessionExpiry,
  HOTEL_SEARCH_SESSION_DURATION,
  HOTEL_SEARCH_SESSION_EVENT,
  refreshHotelSearchActivity,
} from "../utils/hotelSearchSession";
import { useHotelSearchStore } from "../store/serchData.store";
import { buildHotelPayload } from "../utils/buildHotelPayload";
import { buildHotelsUrl } from "../utils/hotelNavigation";

const clearSessionTimeout = (timeoutRef) =>
  window.clearTimeout(timeoutRef.current);

const scheduleExpiryCheck = (
  expiresAt,
  timeoutRef,
  lastNotifiedExpiryRef,
  setIsExpired,
) => {
  clearSessionTimeout(timeoutRef);

  if (!expiresAt) {
    return;
  }

  const remainingTime = expiresAt - Date.now();

  if (remainingTime <= 0) {
    if (lastNotifiedExpiryRef.current !== expiresAt) {
      lastNotifiedExpiryRef.current = expiresAt;
      clearHotelSearchSessionExpiry();
      setIsExpired(true);
    }
    return;
  }

  lastNotifiedExpiryRef.current = null;
  setIsExpired(false);
  timeoutRef.current = window.setTimeout(
    () =>
      scheduleExpiryCheck(
        getHotelSearchSessionExpiry() || expiresAt,
        timeoutRef,
        lastNotifiedExpiryRef,
        setIsExpired,
      ),
    Math.min(remainingTime, HOTEL_SEARCH_SESSION_DURATION),
  );
};

export default function HotelSearchSessionExpiry() {
  const [isExpired, setIsExpired] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const timeoutRef = useRef(null);
  const lastNotifiedExpiryRef = useRef(null);
  const lastUserActivityRef = useRef(0);
  const appliedSearchData = useHotelSearchStore(
    (state) => state.appliedSearchData,
  );

  useEffect(() => {
    const checkExpiry = (expiresAt = getHotelSearchSessionExpiry()) =>
      scheduleExpiryCheck(
        expiresAt,
        timeoutRef,
        lastNotifiedExpiryRef,
        setIsExpired,
      );

    const handleActivity = (event) => {
      checkExpiry(event.detail?.expiresAt);
    };

    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastUserActivityRef.current < 1000) {
        return;
      }

      lastUserActivityRef.current = now;
      refreshHotelSearchActivity();
    };

    const handleStorage = (event) => {
      if (event.key === "hotel-search-session-expires-at") {
        checkExpiry();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkExpiry();
      }
    };

    checkExpiry();
    window.addEventListener(HOTEL_SEARCH_SESSION_EVENT, handleActivity);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("pointermove", handleUserActivity, {
      passive: true,
    });
    window.addEventListener("pointerdown", handleUserActivity, {
      passive: true,
    });
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity, { passive: true });
    window.addEventListener("touchstart", handleUserActivity, {
      passive: true,
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearSessionTimeout(timeoutRef);
      window.removeEventListener(HOTEL_SEARCH_SESSION_EVENT, handleActivity);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pointermove", handleUserActivity);
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleSearchAgain = () => {
    const payload = buildHotelPayload({ searchData: appliedSearchData });

    if (
      !payload ||
      !payload.checkIn ||
      !payload.checkOut ||
      payload.checkIn === "Invalid Date" ||
      payload.checkOut === "Invalid Date"
    ) {
      setSearchError(
        "Your saved search details are unavailable. Please start a new search from the hotel search form.",
      );
      return;
    }

    setIsSearching(true);
    setSearchError("");
    clearHotelSearchSessionExpiry();
    window.location.assign(buildHotelsUrl(appliedSearchData));
  };

  return (
    <Modal
      open={isExpired}
      footer={null}
      centered
      closable={false}
      mask={{ closable: false }}
      width={440}
      styles={{ body: { padding: 0 } }}
    >
      <div className="overflow-hidden rounded-xl">
        <div
          className="px-6 py-7 text-center text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--theme-gradient-start), var(--theme-gradient-end))",
          }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold"
            style={{
              backgroundColor: "var(--theme-white)",
              color: "var(--theme-primary)",
            }}
            aria-hidden="true"
          >
            !
          </div>
          <h2 className="text-2xl font-bold">Your session has expired</h2>
        </div>

        <div className="px-6 py-6 text-center">
          <p className="mb-6 text-base text-gray-600">
            Your hotel search session has expired. Please start a new search to
            continue.
          </p>
          {searchError && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {searchError}
            </p>
          )}
          <Button
            type="primary"
            size="large"
            onClick={handleSearchAgain}
            loading={isSearching}
            className="min-w-32 font-medium"
            style={{
              backgroundColor: "var(--theme-primary)",
              borderColor: "var(--theme-primary)",
              color: "var(--theme-white)",
            }}
          >
            Search again
          </Button>
        </div>
      </div>
    </Modal>
  );
}
