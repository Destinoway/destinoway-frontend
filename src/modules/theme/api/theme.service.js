

import { serverApi } from "@/services/serverApi";

export const getThemeServer = async () => {
  const start = Date.now();

  try {
    const { data } = await serverApi.get("/theme");

    console.log("🔥 THEME API TIME:", Date.now() - start, "ms");

    return data?.data ?? null;
  } catch (error) {
    console.error(
      "Server Theme Fetch Error:",
      error?.response?.data || error?.message,
    );

    console.log("🔥 THEME API FAILED AFTER:", Date.now() - start, "ms");

    return null;
  }
};
