import { serverApi } from "@/services/serverApi";
import { permanentRedirect } from "next/navigation";
import { pickRedirectDestination } from "../utils/redirectPath";

const REDIRECT_TIMEOUT_MS = 3000;

// Asks the backend whether a retired CMS path has a new public URL.
// Only a 301/308 with a safe local Location counts; 404, timeouts and errors resolve to null.
export const resolveCmsRedirect = async (requestedPath) => {
  try {
    const response = await serverApi.get("/cms/redirect", {
      params: { path: requestedPath },
      maxRedirects: 0,
      timeout: REDIRECT_TIMEOUT_MS,
      validateStatus: (status) => status === 301 || status === 308,
    });

    return pickRedirectDestination(requestedPath, response?.headers?.location);
  } catch (error) {
    if (error?.response?.status !== 404) {
      console.error("CMS REDIRECT ERROR:", error?.message);
    }
    return null;
  }
};

// Call from a page when its CMS entry is missing. Never returns when a redirect exists.
// Query parameters are intentionally not forwarded: they may hold stale identifiers.
export const redirectIfCmsMoved = async (requestedPath) => {
  const destination = await resolveCmsRedirect(requestedPath);

  if (destination) {
    permanentRedirect(destination);
  }
};
