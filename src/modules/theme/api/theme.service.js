

import { unstable_cache } from "next/cache";

import { serverApi } from "@/services/serverApi";

// The theme is requested by the root layout on every page view; cache it for
// a minute so pages do not wait on the API each time.
const fetchThemeCached = unstable_cache(
  async () => {
    const { data } = await serverApi.get("/theme");
    return data?.data ?? null;
  },
  ["server-theme"],
  { revalidate: 60, tags: ["theme"] },
);

export const getThemeServer = async () => {
  try {
    return await fetchThemeCached();
  } catch {
    console.error("Server theme could not be loaded.");
    return null;
  }
};
