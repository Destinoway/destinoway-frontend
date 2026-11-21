// Shared rules deciding whether a CMS page may be indexed.
// Used by both sitemap.js and buildCmsMetadata so the sitemap and the page's
// robots meta tag can never disagree.

// These pages render live hotel listings around the CMS content, so they are
// never "empty" even when the CMS entry carries no blocks.
const LISTING_ENTITY_TYPES = new Set(["hotel", "hotelCity", "city"]);

const stripHtml = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();

// Explicit editorial signals from the CMS (draft, unpublished, noindex flags).
export const isCmsMarkedNoindex = (page) =>
  page?.noindex === true ||
  page?.isIndexable === false ||
  page?.robots?.index === false ||
  page?.isPublished === false ||
  page?.status === "draft";

// Mirrors CMSContentRenderer: blocks first, then the legacy template/content path.
export const hasCmsContent = (page) => {
  const blocks = page?.data?.blocks;
  if (Array.isArray(blocks) && blocks.length > 0) return true;
  if (page?.template) return true;
  return stripHtml(page?.data?.content).length > 0;
};

export const isCmsPageIndexable = (page) => {
  if (!page || isCmsMarkedNoindex(page)) return false;
  if (LISTING_ENTITY_TYPES.has(page?.entityType)) return true;
  // A standalone CMS page with nothing to render is an empty shell: keep it out of search.
  return hasCmsContent(page);
};
