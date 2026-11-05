import { fetchAllPublicBlogs } from "@/modules/blog/api/blog.server";
import { getAllCmsPages } from "@/modules/cms/services/cms.service";
import { getSiteUrl, isIndexableSite } from "@/modules/cms/utils/seoUrl";

export const revalidate = 3600;

const toSitemapEntry = (siteUrl, path, lastModified, priority) => ({
  url: `${siteUrl}${path}`,
  ...(lastModified && !Number.isNaN(new Date(lastModified).getTime())
    ? { lastModified: new Date(lastModified) }
    : {}),
  changeFrequency: "monthly",
  priority,
});

const encodePathSegment = (value) => encodeURIComponent(String(value || "").trim());

export const getCmsSitemapPath = (page) => {
  const slug = encodePathSegment(page?.slug);
  if (!slug || slug === "home") return null;

  if (page?.entityType === "hotelCity" || page?.entityType === "city") {
    return `/hotels/${slug}`;
  }

  if (page?.entityType === "hotel") {
    const city = String(page?.data?.cityMeta?.destination || "")
      .split(",")[0]
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    return city ? `/hotel-details/${encodePathSegment(city)}/${slug}` : null;
  }

  return `/${slug}`;
};

export default async function sitemap() {
  if (!isIndexableSite()) return [];

  const siteUrl = getSiteUrl();
  const staticPaths = [
    ["/", 1],
    ["/about-us", 0.8],
    ["/contact-us", 0.7],
    ["/terms-conditions", 0.5],
    ["/grievance-redressal", 0.5],
    ["/blog", 0.7],
    ["/gift-cards", 0.6],
  ];

  const [cmsPages, blogs] = await Promise.all([
    getAllCmsPages().catch(() => {
      console.error("Public CMS sitemap entries could not be loaded.");
      return [];
    }),
    fetchAllPublicBlogs(),
  ]);

  const entries = staticPaths.map(([path, priority]) =>
    toSitemapEntry(siteUrl, path, null, priority),
  );

  for (const page of cmsPages) {
    if (
      page?.noindex === true ||
      page?.isIndexable === false ||
      page?.robots?.index === false ||
      page?.isPublished === false ||
      page?.status === "draft"
    ) {
      continue;
    }
    const path = getCmsSitemapPath(page);
    if (path) {
      entries.push(
        toSitemapEntry(
          siteUrl,
          path,
          page?.updatedAt,
          page?.entityType === "hotel" ? 0.8 : 0.6,
        ),
      );
    }
  }

  for (const blog of blogs) {
    if (
      !blog?.slug ||
      blog?.noindex === true ||
      blog?.isIndexable === false ||
      blog?.robots?.index === false ||
      blog?.isPublished === false ||
      blog?.status === "draft"
    ) {
      continue;
    }
    entries.push(
      toSitemapEntry(
        siteUrl,
        `/blog/${encodePathSegment(blog.slug)}`,
        blog.updatedAt || blog.createdAt,
        0.6,
      ),
    );
  }

  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
