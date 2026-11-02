

import { serverApi } from "@/services/serverApi";

export const getThemeServer = async () => {
  try {
    const { data } = await serverApi.get("/theme");
    return data?.data ?? null;
  } catch {
    console.error("Server theme could not be loaded.");
    return null;
  }
};
