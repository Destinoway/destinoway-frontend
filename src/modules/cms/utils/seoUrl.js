const FALLBACK_SITE_URL = "http://localhost:3000";

const isProductionHostname = (hostname) =>
  hostname === "destinoway.com" || hostname === "www.destinoway.com";

export const getSiteUrl = () => {
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const authUrl = process.env.NEXTAUTH_URL;
  const normalizedPublicUrl = normalizeSiteUrl(publicUrl);
  const normalizedAuthUrl = normalizeSiteUrl(authUrl);

  if (publicUrl && authUrl && normalizedPublicUrl === normalizedAuthUrl) {
    return normalizedPublicUrl;
  }

  if (process.env.DEPLOYMENT_ENV === "staging") {
    const stagingUrl = publicUrl || authUrl;
    try {
      if (stagingUrl && !isProductionHostname(new URL(stagingUrl).hostname.toLowerCase())) {
        return normalizeSiteUrl(stagingUrl);
      }
      if (authUrl && !isProductionHostname(new URL(authUrl).hostname.toLowerCase())) {
        return normalizeSiteUrl(authUrl);
      }
    } catch {
      return FALLBACK_SITE_URL;
    }
    return FALLBACK_SITE_URL;
  }

  if (process.env.DEPLOYMENT_ENV === "production") {
    for (const candidate of [publicUrl, authUrl]) {
      try {
        if (candidate && isProductionHostname(new URL(candidate).hostname.toLowerCase())) {
          return normalizeSiteUrl(candidate);
        }
      } catch {
        // Try the other configured URL; indexability still requires both to match.
      }
    }
    return FALLBACK_SITE_URL;
  }

  return normalizeSiteUrl(authUrl || publicUrl);
};

export const isIndexableSite = () => {
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.DEPLOYMENT_ENV !== "production" ||
    !process.env.NEXT_PUBLIC_SITE_URL ||
    !process.env.NEXTAUTH_URL
  ) {
    return false;
  }

  try {
    const siteUrl = new URL(normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL));
    const authUrl = new URL(normalizeSiteUrl(process.env.NEXTAUTH_URL));
    const hostname = siteUrl.hostname.toLowerCase();
    const sameOrigin = siteUrl.origin === authUrl.origin;
    const isProductionHost = isProductionHostname(hostname);

    return sameOrigin && isProductionHost;
  } catch {
    return false;
  }
};

export const getRobotsMetadata = ({ noindex = false } = {}) => {
  const index = !noindex && isIndexableSite();

  return {
    index,
    follow: index,
    ...(index ? {} : { nocache: true }),
    googleBot: {
      index,
      follow: index,
      ...(index
        ? { "max-image-preview": "large", "max-snippet": -1 }
        : { noimageindex: true, "max-image-preview": "none", "max-snippet": -1 }),
    },
  };
};

// Origin only, without trailing slashes, so joined paths never produce "//".
export const normalizeSiteUrl = (value) => {
  const raw = typeof value === "string" ? value.trim() : "";

  try {
    return new URL(raw || FALLBACK_SITE_URL).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
};

export const joinSiteUrl = (siteUrl, ...segments) => {
  const path = segments
    .flatMap((segment) => String(segment ?? "").split("/"))
    .filter(Boolean)
    .join("/");

  return `${normalizeSiteUrl(siteUrl)}/${path}`;
};

const BRAND_PATTERN = /destinoway|destonoway/i;

// Root layout appends " | Destinoway" via its title template. A title that already
// carries the brand must bypass the template, otherwise the brand is repeated.
export const buildPageTitle = (title) => {
  const value = typeof title === "string" ? title.trim() : "";

  if (!value) return "Destinoway";

  return BRAND_PATTERN.test(value) ? { absolute: value } : value;
};

export const titleToText = (title) =>
  typeof title === "string" ? title : title?.absolute || "";
