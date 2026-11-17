import {
  clearCachedSession,
  getCachedSession,
  refreshCachedSession,
} from "@/lib/sessionTokenCache";
// import { recordHotelSearchActivity } from "@/modules/hotel/utils/hotelSearchSession";
import { useCurrencyStore } from "@/modules/shared/store/currency.store";
import axios from "axios";
import { signOut } from "next-auth/react";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  async (config) => {
    if (
      config.method?.toLowerCase() === "post" &&
      config.url?.split("?")[0].replace(/\/+$/, "") === "/hotelSearch/search"
    ) {
      // recordHotelSearchActivity();
    }

    try {
      const session = await getCachedSession();

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      const currency =
        useCurrencyStore.getState()?.selectedCurrency?.code || "INR";

      config.headers.currency = currency;

      return config;
    } catch (error) {
      console.error("Unable to read the current session for this request.");
      return config;
    }
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      try {
        const session = await refreshCachedSession();

        // Refresh completely failed
        if (session?.error === "RefreshAccessTokenError") {
          clearCachedSession();

          await signOut({
            redirect: false,
          });

          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }
      } catch {
        console.error("Session recovery failed after an unauthorized response.");
      }
    }

    return Promise.reject(error);
  },
);
