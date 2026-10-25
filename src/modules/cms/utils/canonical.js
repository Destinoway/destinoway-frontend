// Saved CMS canonicalUrl is either an absolute http(s) URL or a path starting with a single "/".
// Anything else is ignored so callers fall back to their self-canonical URL.
export const resolveSavedCanonical = (canonicalUrl, siteUrl) => {
  if (typeof canonicalUrl !== "string") return null;

  const value = canonicalUrl.trim();
  if (!value) return null;

  try {
    if (/^https?:\/\//i.test(value)) {
      return new URL(value).toString();
    }

    if (/^\/(?!\/)\S*$/.test(value)) {
      return new URL(value, siteUrl).toString();
    }
  } catch {
    return null;
  }

  return null;
};
