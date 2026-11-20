import { unstable_cache } from "next/cache";
import { cache } from "react";

import { getHomeContent } from "./homeFetch";

// Home blocks the hero render until this resolves; cache it for a minute.
const getHomeContentCached = unstable_cache(getHomeContent, ["home-content"], {
  revalidate: 60,
  tags: ["home-content"],
});

export const fetchHomeContent = cache(async () => {
  try {
    return await getHomeContentCached();
  } catch {
    console.error("Home content could not be loaded.");

    return null;
  }
});
