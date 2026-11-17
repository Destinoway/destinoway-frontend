"use client";

import { useCallback, useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 778;

export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const query = `(max-width:${breakpoint - 1}px)`;

  const subscribe = useCallback(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", onChange);
        return () => mediaQuery.removeEventListener("change", onChange);
      }

      mediaQuery.addListener(onChange);
      return () => mediaQuery.removeListener(onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}
