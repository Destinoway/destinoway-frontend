import { api } from "@/services/axios";

export const initiateBusSearchApi = async (from, to, onward, signal) => {
  if (!from || !to || !onward) {
    throw new Error("Missing required search parameters");
  }

  const response = await api.post(
    "/bus/search",
    { from, to, onward },
    { signal },
  );

  const payload = response?.data;

  if (payload?.success !== true || !payload?.data?.tui) {
    throw new Error("Invalid response from bus search API");
  }

  return payload.data;
};
