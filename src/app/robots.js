import { getSiteUrl, isIndexableSite } from "@/modules/cms/utils/seoUrl";

export default function robots() {
  const siteUrl = getSiteUrl();
  const indexable = isIndexableSite();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    ...(indexable ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
    host: siteUrl,
  };
}
