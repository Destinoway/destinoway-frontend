const FALLBACK_SITE_URL = "http://localhost:3000";

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

// Root layout appends " | Destonoway" via its title template. A title that already
// carries the brand must bypass the template, otherwise the brand is repeated.
export const buildPageTitle = (title) => {
  const value = typeof title === "string" ? title.trim() : "";

  if (!value) return "Destonoway";

  return BRAND_PATTERN.test(value) ? { absolute: value } : value;
};

export const titleToText = (title) =>
  typeof title === "string" ? title : title?.absolute || "";
