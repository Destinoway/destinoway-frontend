import { cache } from "react";

import { getHomeContent } from "./homeFetch";

export const fetchHomeContent = cache(async () => {
  try {
    return await getHomeContent();
  } catch {
    console.error("Home content could not be loaded.");

    return null;
  }
});
