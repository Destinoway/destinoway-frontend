// Shared by the server page (preload) and the client Hero (render) so both
// request exactly the same desktop banner URL.

export const HERO_FALLBACK_IMAGE = "/images/homepage/Banner-1.webp";
export const HERO_DESKTOP_MEDIA = "(min-width: 778px)";
export const HERO_QUALITY = 60;

export const getHeroBannerSrc = (banner) =>
  banner?.items?.[0]?.image || HERO_FALLBACK_IMAGE;

// Admin banners are usually uploaded as compressed WebP/AVIF already.
// Re-encoding them made the file bigger (91 KB WebP -> 148 KB AVIF) and cost
// 0.4-0.7 s on a cold optimizer cache, so serve those as-is.
export const isPreOptimizedImage = (src = "") =>
  /\.(webp|avif)(\?.*)?$/i.test(String(src));
