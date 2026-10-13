const STORAGE_KEY = "hotel-search-session-expires-at";
export const HOTEL_SEARCH_SESSION_EVENT = "hotel-search-session-activity";
export const HOTEL_SEARCH_SESSION_DURATION = 60 * 60 * 1000;

export const getHotelSearchSessionExpiry = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const expiresAt = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(expiresAt) && expiresAt > 0 ? expiresAt : null;
  } catch (error) {
    console.error("Unable to read hotel search session expiry:", error);
    return null;
  }
};

export const recordHotelSearchActivity = () => {
  if (typeof window === "undefined") {
    return;
  }

  const expiresAt = Date.now() + HOTEL_SEARCH_SESSION_DURATION;

  try {
    window.localStorage.setItem(STORAGE_KEY, String(expiresAt));
  } catch (error) {
    console.error("Unable to save hotel search session expiry:", error);
  }

  window.dispatchEvent(
    new CustomEvent(HOTEL_SEARCH_SESSION_EVENT, { detail: { expiresAt } }),
  );
};

export const clearHotelSearchSessionExpiry = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Unable to clear hotel search session expiry:", error);
  }
};
