"use client";

import { Button, Modal } from "antd";
import { useEffect, useRef, useState } from "react";

import {
  clearHotelSearchSessionExpiry,
  getHotelSearchSessionExpiry,
  HOTEL_SEARCH_SESSION_DURATION,
  HOTEL_SEARCH_SESSION_EVENT,
} from "../utils/hotelSearchSession";

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
  const timeoutRef = useRef(null);
  const lastNotifiedExpiryRef = useRef(null);

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
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearSessionTimeout(timeoutRef);
      window.removeEventListener(HOTEL_SEARCH_SESSION_EVENT, handleActivity);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleClose = () => {
    setIsExpired(false);
    clearHotelSearchSessionExpiry();
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
          <Button
            type="primary"
            size="large"
            onClick={handleClose}
            className="min-w-32 font-medium"
            style={{
              backgroundColor: "var(--theme-primary)",
              borderColor: "var(--theme-primary)",
              color: "var(--theme-white)",
            }}
          >
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
}
