const FALLBACK_SITE_URL = "http://localhost:3000";

// Single source of truth for production canonicals, robots.txt and sitemap URLs.
export const PRODUCTION_SITE_URL = "https://destinoway.com";

const APP_ENVS = ["development", "uat", "production"];

const isProductionHostname = (hostname) =>
  hostname === "destinoway.com" || hostname === "www.destinoway.com";

const hostnameOf = (value) => {
  try {
    return new URL(String(value).trim()).hostname.toLowerCase();
  } catch {
    return null;
  }
};

// APP_ENV is a server-only variable (no NEXT_PUBLIC_ prefix). On Amplify it is
// written to .env.production in amplify.yml so it exists at build and runtime.
// Unknown or missing values fail closed to "development" (noindex).
export const getAppEnv = () => {
  const value = String(process.env.APP_ENV || "").trim().toLowerCase();
  return APP_ENVS.includes(value) ? value : "development";
};

export const isProductionEnv = () => getAppEnv() === "production";

export const getSiteUrl = () => {
  if (isProductionEnv()) return PRODUCTION_SITE_URL;

  // Non-production environments must never resolve to the production origin.
  for (const candidate of [process.env.NEXT_PUBLIC_SITE_URL, process.env.NEXTAUTH_URL]) {
    const hostname = candidate ? hostnameOf(candidate) : null;
    if (hostname && !isProductionHostname(hostname)) {
      return normalizeSiteUrl(candidate);
    }
  }

  return FALLBACK_SITE_URL;
};

export const isIndexableSite = () => {
  if (process.env.NODE_ENV !== "production" || !isProductionEnv()) {
    return false;
  }

  // Guard against APP_ENV=production being copied onto a dev/UAT branch:
  // if the auth URL points at a non-production host, stay noindex.
  const authUrl = process.env.NEXTAUTH_URL;
  if (authUrl) {
    const hostname = hostnameOf(authUrl);
    if (!hostname || !isProductionHostname(hostname)) return false;
  }

  return true;
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
